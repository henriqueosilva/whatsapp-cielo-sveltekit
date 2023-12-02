import { queryUrl, queryParams } from '$lib/apiCasadosDados';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { Cnpj, Root, RootFull } from '../../../app';
import { db } from '$lib/connectDB';

type CNPJ_Telefone = Cnpj & { telefones: string[] };

export const GET: RequestHandler = async () => {
	queryParams.range_query.data_abertura.lte = new Date().toISOString().split('T')[0];
	queryParams.range_query.data_abertura.gte = new Date().toISOString().split('T')[0];
	queryParams.page = 1;
	const empresas = [];
	let qtd = 20;

	const rows = db
		.prepare('SELECT * FROM Empresa WHERE data_abertura = ?')
		.all([queryParams.range_query.data_abertura.lte + 'T00:00:00Z']) as CNPJ_Telefone[];
	if (rows.length > 0) {
		console.log('Returning from DB');
		rows.map(async (empresa) => {
			if (empresa.telefones.length == 0) {
				const telefones = await fetchTelefone(empresa.cnpj);
				storeTelefone(empresa.cnpj, telefones);
			}
		});
		return json(rows);
	}
	while (qtd == 20) {
		console.log('Returning from Fetch');
		const res = (await (
			await fetch(queryUrl + 'search', {
				method: 'POST',
				body: JSON.stringify(queryParams),
				headers: {
					'Content-Type': 'application/json'
				}
			})
		).json()) as Root;
		/* console.log('Total: ', res.data.count);
		console.log('Empresas: ', res.data.cnpj.length);
		console.log('Pagina: ', queryParams.page); */
		if (res.data.count == 0) {
			return json(
				{
					status: 'erro',
					msg: `Nenhuma empresa cadastrada no dia  ${new Date(
						queryParams.range_query.data_abertura.lte + 'T03:00:00Z'
					).toLocaleDateString()}`
				},
				{ status: 404 }
			);
		}
		empresas.push(...res.data.cnpj);
		empresas.map(async (empresa) => {
			const telefones = await fetchTelefone(empresa.cnpj);
			empresa.telefones = telefones.join('&');
		});
		queryParams.page += 1;
		qtd = res.data.cnpj.length;
	}
	/* if (res.status != 200) {
		return json({ status: 'falha', msg: 'Api não retornou da maneira esperada' }, { status: 500 });
	} */
	//console.log(empresas);

	//console.log(empresas.length);
	//console.log(empresas);
	insertIntoDB(empresas);
	return json(empresas, { status: 200 });
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
			console.log('Atividade já Inserida');
		}
		try {
			db.prepare(
				'INSERT INTO Empresa VALUES(@active, @cnpj, @cnpj_raiz, @filial_numero, @nome_fantasia, @data_abertura, @situacao_cadastral, @logradouro, @numero, @bairro, @municipio, @uf, @atividade_principal, @cnpj_mei, @versao, @telefone)'
			).run({
				...(empresa || null),
				cnpj_mei: `${empresa.cnpj_mei ? 'TRUE' : 'FALSE'}`,
				active: 'TRUE',
				atividade_principal: empresa.atividade_principal.codigo,
				telefone: `${empresa?.telefones || telefones?.join('&')}`
			});
		} catch (error) {
			//console.log(error);
			console.log('Empresa já Inserida');
		}
	}
	console.log('Finalizou Inserir no Banco de Dados');
}

/* export const POST: RequestHandler = ({ request }) => {
	return new Response();
}; */

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
