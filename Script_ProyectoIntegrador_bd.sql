DROP DATABASE IF EXISTS riesgo_bd;
CREATE DATABASE riesgo_bd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE riesgo_bd;

CREATE TABLE organizacion (
    id_organizacion   INT AUTO_INCREMENT PRIMARY KEY,
    nombre            VARCHAR(150) NOT NULL,
    sector            VARCHAR(100),
    fecha_registro    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuario (
    id_usuario        INT AUTO_INCREMENT PRIMARY KEY,
    nombre            VARCHAR(150) NOT NULL,
    correo            VARCHAR(150) NOT NULL UNIQUE,
    clave_hash        VARCHAR(255) NOT NULL,
    rol               ENUM('ADMIN','AUDITOR','DBA') NOT NULL,
    activo            TINYINT(1) DEFAULT 1
);

CREATE TABLE auditoria (
    id_auditoria      INT AUTO_INCREMENT PRIMARY KEY,
    id_organizacion   INT NOT NULL,
    id_auditor        INT NOT NULL,
    id_dba            INT NULL,
    area_evaluada     VARCHAR(150),
    fecha_auditoria   DATE NOT NULL,
    estado            ENUM('EN_PROGRESO','FINALIZADA') DEFAULT 'EN_PROGRESO',
    peso_c            DECIMAL(3,2) DEFAULT 1.00, 
    peso_i            DECIMAL(3,2) DEFAULT 1.00,
    peso_d            DECIMAL(3,2) DEFAULT 1.00,
    fecha_creacion    DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aud_org FOREIGN KEY (id_organizacion) REFERENCES organizacion(id_organizacion),
    CONSTRAINT fk_aud_auditor FOREIGN KEY (id_auditor) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_aud_dba FOREIGN KEY (id_dba) REFERENCES usuario(id_usuario)
);

CREATE TABLE control (
    id_control        INT AUTO_INCREMENT PRIMARY KEY,
    codigo            VARCHAR(10) NOT NULL UNIQUE,   --  '5.9', '8.13'
    nombre            VARCHAR(200) NOT NULL,
    dominio           ENUM('Organizacional','Personas','Físico','Tecnológico') NOT NULL,
    objetivo          TEXT,
    descripcion       TEXT,
    peso              TINYINT NOT NULL,              -- 1 a 5 (Persona 1, sección 4.2)
    relacion_c        ENUM('Alta','Media','Baja') NOT NULL,
    relacion_i        ENUM('Alta','Media','Baja') NOT NULL,
    relacion_d        ENUM('Alta','Media','Baja') NOT NULL,
    coef_c            DECIMAL(2,1) NOT NULL,          -- Alta=1.0 Media=0.6 Baja=0.3 (Persona 2, 5.2)
    coef_i            DECIMAL(2,1) NOT NULL,
    coef_d            DECIMAL(2,1) NOT NULL
);


CREATE TABLE pregunta (
    id_pregunta       INT AUTO_INCREMENT PRIMARY KEY,
    id_control        INT NOT NULL,
    nivel             TINYINT NOT NULL,               -- 1 a 5
    texto             TEXT NOT NULL,
    CONSTRAINT fk_preg_control FOREIGN KEY (id_control) REFERENCES control(id_control),
    CONSTRAINT uq_control_nivel UNIQUE (id_control, nivel)
);


CREATE TABLE respuesta (
    id_respuesta      INT AUTO_INCREMENT PRIMARY KEY,
    id_auditoria      INT NOT NULL,
    id_pregunta       INT NOT NULL,
    valor             ENUM('SI','NO','NA') NOT NULL,
    evidencia         TEXT,
    fecha_registro    DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resp_auditoria FOREIGN KEY (id_auditoria) REFERENCES auditoria(id_auditoria),
    CONSTRAINT fk_resp_pregunta FOREIGN KEY (id_pregunta) REFERENCES pregunta(id_pregunta),
    CONSTRAINT uq_aud_pregunta UNIQUE (id_auditoria, id_pregunta)
);


CREATE TABLE resultado_control (
    id_resultado_control INT AUTO_INCREMENT PRIMARY KEY,
    id_auditoria      INT NOT NULL,
    id_control        INT NOT NULL,
    aplica            TINYINT(1) DEFAULT 1,          
    nivel_madurez     TINYINT,                        
    cumplimiento_pct  DECIMAL(5,2),                   
    riesgo_c          DECIMAL(8,4),                   
    riesgo_i          DECIMAL(8,4),
    riesgo_d          DECIMAL(8,4),
    CONSTRAINT fk_rc_auditoria FOREIGN KEY (id_auditoria) REFERENCES auditoria(id_auditoria),
    CONSTRAINT fk_rc_control FOREIGN KEY (id_control) REFERENCES control(id_control),
    CONSTRAINT uq_aud_control UNIQUE (id_auditoria, id_control)
);

CREATE TABLE resultado_auditoria (
    id_auditoria          INT PRIMARY KEY,
    cumplimiento_general  DECIMAL(5,2),
    exposicion_c          DECIMAL(5,2),
    exposicion_i          DECIMAL(5,2),
    exposicion_d          DECIMAL(5,2),
    indice_general_riesgo DECIMAL(5,2),
    CONSTRAINT fk_ra_auditoria FOREIGN KEY (id_auditoria) REFERENCES auditoria(id_auditoria)
);

CREATE TABLE resultado_dominio (
    id_resultado_dominio  INT AUTO_INCREMENT PRIMARY KEY,
    id_auditoria          INT NOT NULL,
    dominio               ENUM('Organizacional','Personas','Físico','Tecnológico') NOT NULL,
    cumplimiento_pct      DECIMAL(5,2),
    CONSTRAINT fk_rd_auditoria FOREIGN KEY (id_auditoria) REFERENCES auditoria(id_auditoria),
    CONSTRAINT uq_aud_dominio UNIQUE (id_auditoria, dominio)
);

INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('5.9', 'Inventario de activos de información', 'Organizacional', 3, 'Media', 'Media', 'Media', 0.6, 0.6, 0.6);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('5.12', 'Clasificación de la información', 'Organizacional', 4, 'Alta', 'Media', 'Baja', 1.0, 0.6, 0.3);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('5.15', 'Control de acceso', 'Organizacional', 5, 'Alta', 'Alta', 'Media', 1.0, 1.0, 0.6);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('5.18', 'Derechos de acceso', 'Organizacional', 5, 'Alta', 'Alta', 'Media', 1.0, 1.0, 0.6);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('5.24', 'Planificación de la gestión de incidentes', 'Organizacional', 3, 'Media', 'Media', 'Alta', 0.6, 0.6, 1.0);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('5.34', 'Privacidad y protección de datos personales', 'Organizacional', 4, 'Alta', 'Baja', 'Baja', 1.0, 0.3, 0.3);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('6.3', 'Concienciación, educación y capacitación en seguridad', 'Personas', 2, 'Media', 'Media', 'Baja', 0.6, 0.6, 0.3);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('6.6', 'Acuerdos de confidencialidad o no divulgación', 'Personas', 3, 'Alta', 'Baja', 'Baja', 1.0, 0.3, 0.3);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('7.1', 'Perímetros de seguridad física', 'Físico', 3, 'Media', 'Media', 'Alta', 0.6, 0.6, 1.0);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('7.10', 'Medios de almacenamiento', 'Físico', 3, 'Alta', 'Media', 'Media', 1.0, 0.6, 0.6);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('8.2', 'Derechos de acceso privilegiado', 'Tecnológico', 5, 'Alta', 'Alta', 'Alta', 1.0, 1.0, 1.0);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('8.3', 'Restricción de acceso a la información', 'Tecnológico', 4, 'Alta', 'Alta', 'Media', 1.0, 1.0, 0.6);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('8.5', 'Autenticación segura', 'Tecnológico', 4, 'Alta', 'Media', 'Baja', 1.0, 0.6, 0.3);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('8.8', 'Gestión de vulnerabilidades técnicas', 'Tecnológico', 4, 'Alta', 'Alta', 'Media', 1.0, 1.0, 0.6);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('8.9', 'Gestión de la configuración', 'Tecnológico', 4, 'Media', 'Alta', 'Media', 0.6, 1.0, 0.6);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('8.13', 'Copias de seguridad de la información', 'Tecnológico', 5, 'Baja', 'Media', 'Alta', 0.3, 0.6, 1.0);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('8.15', 'Registro (logging)', 'Tecnológico', 4, 'Media', 'Alta', 'Media', 0.6, 1.0, 0.6);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('8.16', 'Actividades de monitoreo', 'Tecnológico', 4, 'Media', 'Alta', 'Alta', 0.6, 1.0, 1.0);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('8.24', 'Uso de criptografía', 'Tecnológico', 4, 'Alta', 'Media', 'Baja', 1.0, 0.6, 0.3);
INSERT INTO control (codigo, nombre, dominio, peso, relacion_c, relacion_i, relacion_d, coef_c, coef_i, coef_d) VALUES ('8.32', 'Gestión de cambios', 'Tecnológico', 3, 'Media', 'Alta', 'Media', 0.6, 1.0, 0.6);


INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.9'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la existencia y actualización del inventario de bases de datos y demás activos de información asociados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.9'), 2, '¿Existen lineamientos o procedimientos documentados sobre la existencia y actualización del inventario de bases de datos y demás activos de información asociados, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.9'), 3, '¿El procedimiento asociado a la existencia y actualización del inventario de bases de datos y demás activos de información asociados está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.9'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la existencia y actualización del inventario de bases de datos y demás activos de información asociados y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.9'), 5, '¿Se mide el desempeño de la existencia y actualización del inventario de bases de datos y demás activos de información asociados mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.12'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la clasificación de la información almacenada en las bases de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.12'), 2, '¿Existen lineamientos o procedimientos documentados sobre la clasificación de la información almacenada en las bases de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.12'), 3, '¿El procedimiento asociado a la clasificación de la información almacenada en las bases de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.12'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la clasificación de la información almacenada en las bases de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.12'), 5, '¿Se mide el desempeño de la clasificación de la información almacenada en las bases de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.15'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la aplicación de controles de acceso a las bases de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.15'), 2, '¿Existen lineamientos o procedimientos documentados sobre la aplicación de controles de acceso a las bases de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.15'), 3, '¿El procedimiento asociado a la aplicación de controles de acceso a las bases de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.15'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la aplicación de controles de acceso a las bases de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.15'), 5, '¿Se mide el desempeño de la aplicación de controles de acceso a las bases de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.18'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la asignación, revisión y revocación de derechos de acceso sobre las bases de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.18'), 2, '¿Existen lineamientos o procedimientos documentados sobre la asignación, revisión y revocación de derechos de acceso sobre las bases de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.18'), 3, '¿El procedimiento asociado a la asignación, revisión y revocación de derechos de acceso sobre las bases de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.18'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la asignación, revisión y revocación de derechos de acceso sobre las bases de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.18'), 5, '¿Se mide el desempeño de la asignación, revisión y revocación de derechos de acceso sobre las bases de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.24'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la planificación de la respuesta a incidentes de seguridad relacionados con las bases de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.24'), 2, '¿Existen lineamientos o procedimientos documentados sobre la planificación de la respuesta a incidentes de seguridad relacionados con las bases de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.24'), 3, '¿El procedimiento asociado a la planificación de la respuesta a incidentes de seguridad relacionados con las bases de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.24'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la planificación de la respuesta a incidentes de seguridad relacionados con las bases de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.24'), 5, '¿Se mide el desempeño de la planificación de la respuesta a incidentes de seguridad relacionados con las bases de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.34'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la protección de los datos personales almacenados en las bases de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.34'), 2, '¿Existen lineamientos o procedimientos documentados sobre la protección de los datos personales almacenados en las bases de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.34'), 3, '¿El procedimiento asociado a la protección de los datos personales almacenados en las bases de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.34'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la protección de los datos personales almacenados en las bases de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='5.34'), 5, '¿Se mide el desempeño de la protección de los datos personales almacenados en las bases de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='6.3'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la capacitación del personal en seguridad de bases de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='6.3'), 2, '¿Existen lineamientos o procedimientos documentados sobre la capacitación del personal en seguridad de bases de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='6.3'), 3, '¿El procedimiento asociado a la capacitación del personal en seguridad de bases de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='6.3'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la capacitación del personal en seguridad de bases de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='6.3'), 5, '¿Se mide el desempeño de la capacitación del personal en seguridad de bases de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='6.6'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con los acuerdos de confidencialidad del personal con acceso a las bases de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='6.6'), 2, '¿Existen lineamientos o procedimientos documentados sobre los acuerdos de confidencialidad del personal con acceso a las bases de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='6.6'), 3, '¿El procedimiento asociado a los acuerdos de confidencialidad del personal con acceso a las bases de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='6.6'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con los acuerdos de confidencialidad del personal con acceso a las bases de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='6.6'), 5, '¿Se mide el desempeño de los acuerdos de confidencialidad del personal con acceso a las bases de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='7.1'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la seguridad física del centro de datos donde reside el motor de base de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='7.1'), 2, '¿Existen lineamientos o procedimientos documentados sobre la seguridad física del centro de datos donde reside el motor de base de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='7.1'), 3, '¿El procedimiento asociado a la seguridad física del centro de datos donde reside el motor de base de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='7.1'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la seguridad física del centro de datos donde reside el motor de base de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='7.1'), 5, '¿Se mide el desempeño de la seguridad física del centro de datos donde reside el motor de base de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='7.10'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la gestión de los medios de almacenamiento y respaldo de las bases de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='7.10'), 2, '¿Existen lineamientos o procedimientos documentados sobre la gestión de los medios de almacenamiento y respaldo de las bases de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='7.10'), 3, '¿El procedimiento asociado a la gestión de los medios de almacenamiento y respaldo de las bases de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='7.10'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la gestión de los medios de almacenamiento y respaldo de las bases de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='7.10'), 5, '¿Se mide el desempeño de la gestión de los medios de almacenamiento y respaldo de las bases de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.2'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la gestión de cuentas y accesos privilegiados (administrativos) sobre el motor de base de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.2'), 2, '¿Existen lineamientos o procedimientos documentados sobre la gestión de cuentas y accesos privilegiados (administrativos) sobre el motor de base de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.2'), 3, '¿El procedimiento asociado a la gestión de cuentas y accesos privilegiados (administrativos) sobre el motor de base de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.2'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la gestión de cuentas y accesos privilegiados (administrativos) sobre el motor de base de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.2'), 5, '¿Se mide el desempeño de la gestión de cuentas y accesos privilegiados (administrativos) sobre el motor de base de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.3'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la restricción de acceso a nivel de tablas, vistas y procedimientos de la base de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.3'), 2, '¿Existen lineamientos o procedimientos documentados sobre la restricción de acceso a nivel de tablas, vistas y procedimientos de la base de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.3'), 3, '¿El procedimiento asociado a la restricción de acceso a nivel de tablas, vistas y procedimientos de la base de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.3'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la restricción de acceso a nivel de tablas, vistas y procedimientos de la base de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.3'), 5, '¿Se mide el desempeño de la restricción de acceso a nivel de tablas, vistas y procedimientos de la base de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.5'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con los mecanismos de autenticación segura para el acceso a la base de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.5'), 2, '¿Existen lineamientos o procedimientos documentados sobre los mecanismos de autenticación segura para el acceso a la base de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.5'), 3, '¿El procedimiento asociado a los mecanismos de autenticación segura para el acceso a la base de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.5'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con los mecanismos de autenticación segura para el acceso a la base de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.5'), 5, '¿Se mide el desempeño de los mecanismos de autenticación segura para el acceso a la base de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.8'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la gestión de vulnerabilidades técnicas y parches del motor de base de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.8'), 2, '¿Existen lineamientos o procedimientos documentados sobre la gestión de vulnerabilidades técnicas y parches del motor de base de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.8'), 3, '¿El procedimiento asociado a la gestión de vulnerabilidades técnicas y parches del motor de base de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.8'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la gestión de vulnerabilidades técnicas y parches del motor de base de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.8'), 5, '¿Se mide el desempeño de la gestión de vulnerabilidades técnicas y parches del motor de base de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.9'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la gestión segura de la configuración del motor de base de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.9'), 2, '¿Existen lineamientos o procedimientos documentados sobre la gestión segura de la configuración del motor de base de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.9'), 3, '¿El procedimiento asociado a la gestión segura de la configuración del motor de base de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.9'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la gestión segura de la configuración del motor de base de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.9'), 5, '¿Se mide el desempeño de la gestión segura de la configuración del motor de base de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.13'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con las copias de respaldo de la base de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.13'), 2, '¿Existen lineamientos o procedimientos documentados sobre las copias de respaldo de la base de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.13'), 3, '¿El procedimiento asociado a las copias de respaldo de la base de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.13'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con las copias de respaldo de la base de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.13'), 5, '¿Se mide el desempeño de las copias de respaldo de la base de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.15'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la generación de registros (logging) de la actividad de la base de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.15'), 2, '¿Existen lineamientos o procedimientos documentados sobre la generación de registros (logging) de la actividad de la base de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.15'), 3, '¿El procedimiento asociado a la generación de registros (logging) de la actividad de la base de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.15'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la generación de registros (logging) de la actividad de la base de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.15'), 5, '¿Se mide el desempeño de la generación de registros (logging) de la actividad de la base de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.16'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con las actividades de monitoreo de la actividad y el desempeño de la base de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.16'), 2, '¿Existen lineamientos o procedimientos documentados sobre las actividades de monitoreo de la actividad y el desempeño de la base de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.16'), 3, '¿El procedimiento asociado a las actividades de monitoreo de la actividad y el desempeño de la base de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.16'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con las actividades de monitoreo de la actividad y el desempeño de la base de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.16'), 5, '¿Se mide el desempeño de las actividades de monitoreo de la actividad y el desempeño de la base de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.24'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la aplicación de cifrado sobre los datos almacenados y transmitidos por la base de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.24'), 2, '¿Existen lineamientos o procedimientos documentados sobre la aplicación de cifrado sobre los datos almacenados y transmitidos por la base de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.24'), 3, '¿El procedimiento asociado a la aplicación de cifrado sobre los datos almacenados y transmitidos por la base de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.24'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la aplicación de cifrado sobre los datos almacenados y transmitidos por la base de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.24'), 5, '¿Se mide el desempeño de la aplicación de cifrado sobre los datos almacenados y transmitidos por la base de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.32'), 1, '¿Existe alguna práctica, aunque sea informal u ocasional, relacionada con la gestión de cambios sobre el esquema, la configuración y los objetos de la base de datos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.32'), 2, '¿Existen lineamientos o procedimientos documentados sobre la gestión de cambios sobre el esquema, la configuración y los objetos de la base de datos, aunque no se apliquen de manera consistente en todos los casos?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.32'), 3, '¿El procedimiento asociado a la gestión de cambios sobre el esquema, la configuración y los objetos de la base de datos está formalmente definido, documentado e implementado en la mayor parte de las bases de datos y procesos evaluados?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.32'), 4, '¿Se supervisa periódicamente el cumplimiento de lo relacionado con la gestión de cambios sobre el esquema, la configuración y los objetos de la base de datos y existe evidencia documentada (bitácoras, reportes o actas) de dicha supervisión?');
INSERT INTO pregunta (id_control, nivel, texto) VALUES ((SELECT id_control FROM control WHERE codigo='8.32'), 5, '¿Se mide el desempeño de la gestión de cambios sobre el esquema, la configuración y los objetos de la base de datos mediante indicadores, se evalúa de forma continua y forma parte de un proceso formal de mejora continua?');