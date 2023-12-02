--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS User (
  active BOOLEAN NOT NULL DEFAULT "TRUE",
  cpf TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  senha TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS Role (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS UserRole (
  cpf TEXT REFERENCES User(cpf),
  role INTEGER REFERENCES Role(id),
  UNIQUE(cpf, role)
);
INSERT INTO User(cpf, nome, email, senha)
VALUES (
    '11179443446',
    'Henrique de Oliveira Silva',
    'henriquensf2@gmail.com',
    'teste'
  );
INSERT INTO Role(id, nome)
VALUES (1, 'Admin'),
  (2, 'Gerente'),
  (3, 'User');
INSERT INTO UserRole (cpf, role)
VALUES ('11179443446', 1);
--------------------------------------------------------------------------------
-- DOWN
--------------------------------------------------------------------------------
DROP TABLE User;
DROP TABLE Role;
DROP TABLE UserRole;