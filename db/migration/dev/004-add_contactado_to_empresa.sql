--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
ALTER TABLE Empresa
ADD contactado INTEGER DEFAULT 0;
--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
ALTER TABLE Empresa DROP contactado;