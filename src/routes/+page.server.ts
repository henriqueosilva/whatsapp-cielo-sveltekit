import { db } from '$lib/connectDB';
import { fail } from '@sveltejs/kit';
import type { Cnpj, Root, RootFull, User } from '../app';
import type { Actions, PageServerLoad } from './$types';
/* import bcrypt from 'bcrypt';
import type { SqliteError } from 'better-sqlite3'; */
import { queryUrl, queryParams } from '$lib/apiCasadosDados';
import type { SqliteError } from 'better-sqlite3';

export const load: PageServerLoad = async ({ url, depends }) => {
	depends('app:empresa');
	const queryParamsLocal = queryParams;
	type CNPJ_Telefone = Cnpj & { telefones: string[] };
	const dataInicio = url.searchParams.get('dataInicio') || '';
	const dataFim = url.searchParams.get('dataFim') || '';
	queryParamsLocal.range_query.data_abertura.lte =
		dataInicio?.toString() ||
		new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
			.toISOString()
			.split('T')[0];
	queryParamsLocal.range_query.data_abertura.gte =
		dataFim?.toString() ||
		new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
			.toISOString()
			.split('T')[0];

	queryParamsLocal.page = 1;
	console.log(queryParamsLocal.range_query.data_abertura.lte);
	const rows = db
		.prepare('SELECT * FROM Empresa WHERE data_abertura = ?')
		.all([queryParamsLocal.range_query.data_abertura.lte + 'T00:00:00Z']) as CNPJ_Telefone[];
	if (rows.length > 0) {
		console.log('Returning from DB');
		rows.map(async (empresa) => {
			if (empresa.telefones.length == 0) {
				const telefones = await fetchTelefone(empresa.cnpj);
				storeTelefone(empresa.cnpj, telefones);
			}
		});
		return { status: 'success', empresas: rows, from: 'db' };
	}
	const empresas = await fetchEmpresasFromApi(queryParamsLocal);
	if (!empresas) {
		return {
			status: 'erro',
			msg: `Nenhuma empresa cadastrada no dia  ${new Date(
				queryParamsLocal.range_query.data_abertura.lte + 'T00:00:00Z'
			).toLocaleDateString()}`
		};
	}

	insertIntoDB(empresas);
	return { status: 'success', empresas: empresas, from: 'fetch' };
};

async function insertIntoDB(empresas: Cnpj[]) {
	console.log('Iniciou Inserir no Banco de Dados');
	for (const empresa of empresas) {
		let telefones = undefined;
		if (!empresa.telefones) {
			telefones = await fetchTelefone(empresa.cnpj);
		}
		try {
			db.prepare('INSERT INTO AtividadePrincipal(codigo, descricao) VALUES (?, ?)').run([
				empresa.atividade_principal.codigo,
				empresa.atividade_principal.descricao
			]);
		} catch {
			//console.log('Atividade já Inserida');
		}
		try {
			db.prepare(
				'INSERT INTO Empresa VALUES(@active, @cnpj, @cnpj_raiz, @filial_numero, @nome_fantasia, @data_abertura, @situacao_cadastral, @logradouro, @numero, @bairro, @municipio, @uf, @atividade_principal, @cnpj_mei, @versao, @telefone, @contactado)'
			).run({
				...(empresa || null),
				cnpj_mei: `${empresa.cnpj_mei ? 'TRUE' : 'FALSE'}`,
				active: 'TRUE',
				atividade_principal: empresa.atividade_principal.codigo,
				telefone: `${empresa?.telefones || telefones?.join('&')}`,
				contactado: 0
			});
		} catch (error) {
			if (error.code == 'SQLITE_CONSTRAINT_PRIMARYKEY') {
				console.log('Empresa já Inserida');
			} else {
				console.log(error);
			}
		}
	}
	console.log('Finalizou Inserir no Banco de Dados');
}

async function fetchTelefone(cnpj: string): Promise<string[]> {
	const empresa = (await (await fetch(queryUrl + cnpj)).json()) as RootFull;
	return empresa.cnpj.telefones;
}

function storeTelefone(cnpj: string, telefones: string[]) {
	try {
		db.prepare('UPDATE Empresa SET telefone = ? WHERE cnpj = ?').run([cnpj, telefones.join('&')]);
	} catch (err) {
		console.log(err);
	}
}

async function fetchEmpresasFromApi(queryParamsLocal: typeof queryParams): Promise<[] | Cnpj[]> {
	const empresas = [];
	let qtd = 20;
	while (qtd == 20) {
		console.log('Returning from Fetch');
		const res = (await (
			await fetch(queryUrl + 'search', {
				method: 'POST',
				body: JSON.stringify(queryParamsLocal),
				headers: {
					'Content-Type': 'application/json'
				}
			})
		).json()) as Root;
		if (res.data.count == 0) {
			return [];
		}
		if (!res.data.cnpj) break;
		empresas.push(...res.data.cnpj);
		queryParamsLocal.page += 1;
		qtd = res.data.cnpj.length;
	}
	return empresas;
}
