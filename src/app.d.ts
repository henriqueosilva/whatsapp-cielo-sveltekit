export interface Root {
	success: boolean;
	data: Data;
	page: Page;
}

export interface RootFull {
	status: string;
	cnpj: CnpjFull;
}

export interface Data {
	cnpj: Cnpj[];
	count: number;
}

export interface Cnpj {
	cnpj: string;
	cnpj_raiz: string;
	filial_numero: number;
	razao_social: string;
	nome_fantasia: string;
	data_abertura: string;
	situacao_cadastral: string;
	logradouro: string;
	numero: string;
	bairro: string;
	municipio: string;
	uf: string;
	atividade_principal: AtividadePrincipal;
	cnpj_mei: boolean;
	versao: string;
	telefones?: string;
	contactado?: number;
}

export interface CnpjFull {
	cnpj: string;
	cnpj_raiz: string;
	filial_numero: number;
	razao_social: string;
	matriz_filial: string;
	codigo_natureza_juridica: string;
	descricao_natureza_juridica: string;
	nome_fantasia: string;
	situacao_cadastral: string;
	data_situacao: string;
	logradouro: string;
	numero: string;
	complemento: string;
	cep: string;
	bairro: string;
	municipio: string;
	uf: string;
	data_abertura: string;
	telefones: string[];
	motivo_situacao: string;
	email: string;
	capital_social: number;
	situacao_especial: string;
	data_situacao_especial: string;
	quadro_societario: unknown[];
	atividade_principal: AtividadePrincipal;
	atividade_secundaria: unknown;
	ibge: Ibge;
	data_consulta: string;
	cnpj_mei: boolean;
	contato_telefonico: ContatoTelefonico[];
	contato_email: ContatoEmail[];
	versao: string;
}

export interface AtividadePrincipal {
	codigo: string;
	descricao: string;
}

export interface Page {
	current: number;
}

export interface Ibge {
	codigo_municipio: number;
	codigo_uf: number;
	latitude: number;
	longitude: number;
}

export interface ContatoTelefonico {
	completo: string;
	ddd: string;
	numero: string;
	tipo: string;
}

export interface ContatoEmail {
	email: string;
	valido: boolean;
	dominio: string;
}

export interface ErroApi {
	status: string;
	msg: string;
}
export type User = {
	active: boolean;
	cpf: string;
	nome: string;
	email: string;
	senha?: string;
};
