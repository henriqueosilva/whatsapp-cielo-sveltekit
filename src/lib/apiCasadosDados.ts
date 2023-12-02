export const queryParams = {
	query: {
		termo: [],
		atividade_principal: [],
		natureza_juridica: [],
		uf: ['DF', 'GO'],
		municipio: [],
		bairro: [],
		situacao_cadastral: 'ATIVA',
		cep: [],
		ddd: []
	},
	range_query: { data_abertura: { lte: '', gte: '' }, capital_social: { lte: null, gte: '5000' } },
	extras: {
		somente_mei: false,
		excluir_mei: false,
		com_email: false,
		incluir_atividade_secundaria: false,
		com_contato_telefonico: true,
		somente_fixo: false,
		somente_celular: true,
		somente_matriz: false,
		somente_filial: false
	},
	page: 1
};

export const queryUrl = 'https://api.casadosdados.com.br/v2/public/cnpj/';
