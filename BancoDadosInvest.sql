CREATE DATABASE InvestHack;
USE InvestHack;

CREATE TABLE Usuario (
  idUsuario INT AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  celular VARCHAR(15),
  perfilFixo ENUM('conservador','moderado','sofisticado'),
  PRIMARY KEY (idUsuario)
);

CREATE TABLE Investimento (
  idInvestimento INT AUTO_INCREMENT,
  valorInicial DECIMAL(10,2),
  valorMensal DECIMAL(10,2),
  duracaoEmAnos INT,
  objetivo INT, -- é um select
  relacaoInvestimento INT, -- é um select
  perfil ENUM('conservador','moderado','sofisticado'), 
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (idInvestimento)
);

CREATE TABLE InvestimentoUsuario (
  idUsuario INT NOT NULL,
  idInvestimento INT NOT NULL,
  coeficienteAngular FLOAT, -- representa a taxa esperada do crescimento
  dataInicio DATE,
  PRIMARY KEY (idUsuario, idInvestimento)
);
ALTER TABLE InvestimentoUsuario ADD CONSTRAINT FK_InvestimentoUsuario_Usuario FOREIGN KEY(idUsuario) REFERENCES Usuario(idUsuario);
ALTER TABLE InvestimentoUsuario ADD CONSTRAINT FK_InvestimentoUsuario_Investimento FOREIGN KEY(idInvestimento) REFERENCES Investimento(idInvestimento);
