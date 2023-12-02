--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Empresa (
  active BOOLEAN NOT NULL DEFAULT "TRUE",
  cnpj TEXT PRIMARY KEY,
  cnpj_raiz TEXT,
  filial_numero INTEGER,
  nome_fantasia TEXT,
  data_abertura DATE,
  situacao_cadastral TEXT,
  logradouro TEXT,
  numero TEXT,
  bairro TEXT,
  municipio TEXT,
  uf TEXT,
  atividade_principal TEXT REFERENCES AtividadePrincipal(codigo),
  cnpj_mei BOOLEAN,
  versao TEXT
);
CREATE TABLE IF NOT EXISTS AtividadePrincipal (
  codigo TEXT PRIMARY KEY,
  descricao TEXT NOT NULL
);
--------------------------------------------------------------------------------
-- DOWN
--------------------------------------------------------------------------------
DROP TABLE Empresa;
DROP TABLE AtividadePrincipal;