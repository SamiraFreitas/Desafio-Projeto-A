CREATE TABLE USUARIOS
(
	id_User char(200) UNIQUE,
	Nome_Usuario char(200) NOT NULL,
	Email char(200) NOT NULL,
	Senha varchar(200) NOT NULL,
	
	PRIMARY KEY (Email)
);

INSERT INTO USUARIOS
VALUES	('123456','Filipe','filipe.soares.fn@gmail.com','$2b$10$kf3Xt2zz4TNiF9pnfvOoBeQTV26xc7Y.whoztdEzUDRVSnDerj28C'),('654321','Josh','leomoreira.com@gmail.com','$2b$10$kf3Xt2zz4TNiF9pnfvOoBeQTV26xc7Y.whoztdEzUDRVSnDerj28C');

CREATE TABLE REPUBLICAS
(
	id_rep char(200),
	Nome_Republica char(200) NOT NULL,
	Rua char(200),
	Numero int,
	Bairro char(200),
	Cidade char(200),
	Whatsapp char(200),
	sexo char(200),
	N_Quartos int,
	N_Suites int,
	N_Banheiros int,
	Wifi int,
	Trote boolean,
	Area_Estudos boolean,
	TV_a_Cabo boolean,
	Area_Externa boolean,
	Piscina boolean,
	Faxineira boolean,
	Almoco_Diario boolean,
	Garagem boolean,
	Animais boolean,
	status boolean,
	img char(200),
	id_User char(200),
	
	
	PRIMARY KEY (id_rep),
	FOREIGN KEY (id_User) REFERENCES USUARIOS(id_User)
);

INSERT INTO REPUBLICAS
VALUES	('1','Granja','Dona Guiguita','127','Santa Barbara','João Monlevade','5531991884649','Masculina',5,4,3,360,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,'1NT3fUXworu2KlY1K9dYZGYDC8IulepnZ','123456');










