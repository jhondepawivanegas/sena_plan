-- CreateTable
CREATE TABLE `Ambientes` (
    `id_ambiente` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_amb` VARCHAR(191) NOT NULL,
    `municipio` INTEGER NOT NULL,
    `sede` ENUM('centro', 'Yamboro') NOT NULL,
    `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',

    PRIMARY KEY (`id_ambiente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Areas` (
    `id_area` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_area` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_area`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fichas` (
    `codigo` INTEGER NOT NULL,
    `inicio_fecha` DATETIME(3) NOT NULL,
    `fin_lectiva` DATETIME(3) NOT NULL,
    `fin_ficha` DATETIME(3) NOT NULL,
    `programa` INTEGER NOT NULL,
    `sede` ENUM('centro', 'Yamboro') NOT NULL,
    `estado` ENUM('lectiva', 'electiva', 'finalizada') NOT NULL,

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Horarios` (
    `id_horario` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `hora_inicio` VARCHAR(191) NOT NULL,
    `fecha_fin` DATETIME(3) NOT NULL,
    `hora_fin` VARCHAR(191) NOT NULL,
    `dia` ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL,
    `cantidad_horas` INTEGER NOT NULL,
    `instructor` INTEGER NOT NULL,
    `ficha` INTEGER NOT NULL,
    `ambiente` INTEGER NOT NULL,
    `estado` ENUM('solicitud', 'aprobado', 'noaprobado') NOT NULL DEFAULT 'aprobado',

    PRIMARY KEY (`id_horario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Municipios` (
    `id_municipio` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_mpio` VARCHAR(191) NOT NULL,
    `departamento` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_municipio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Personas` (
    `id_persona` INTEGER NOT NULL AUTO_INCREMENT,
    `identificacion` INTEGER NOT NULL,
    `nombres` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `rol` ENUM('Administrador', 'Instructor', 'Coordinador', 'Lider') NOT NULL,
    `cargo` ENUM('Instructor', 'Aprendiz', 'Coordinador') NOT NULL,
    `municipio` INTEGER NOT NULL,

    UNIQUE INDEX `Personas_identificacion_key`(`identificacion`),
    PRIMARY KEY (`id_persona`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Programas` (
    `id_programa` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_programa` VARCHAR(191) NOT NULL,
    `sigla` VARCHAR(191) NOT NULL,
    `nivel` ENUM('Tecnico', 'Tecnologo') NOT NULL,
    `estado` ENUM('activo', 'inactivo') NOT NULL,

    PRIMARY KEY (`id_programa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vinculacion` (
    `id_vinculacion` INTEGER NOT NULL AUTO_INCREMENT,
    `instructor` INTEGER NOT NULL,
    `tipo` ENUM('contratista', 'planta') NOT NULL,
    `sede` ENUM('centro', 'Yamboro') NOT NULL,
    `area` INTEGER NOT NULL,

    UNIQUE INDEX `Vinculacion_instructor_key`(`instructor`),
    PRIMARY KEY (`id_vinculacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ambientes` ADD CONSTRAINT `Ambientes_municipio_fkey` FOREIGN KEY (`municipio`) REFERENCES `Municipios`(`id_municipio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fichas` ADD CONSTRAINT `Fichas_programa_fkey` FOREIGN KEY (`programa`) REFERENCES `Programas`(`id_programa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Horarios` ADD CONSTRAINT `Horarios_ficha_fkey` FOREIGN KEY (`ficha`) REFERENCES `Fichas`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Horarios` ADD CONSTRAINT `Horarios_ambiente_fkey` FOREIGN KEY (`ambiente`) REFERENCES `Ambientes`(`id_ambiente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Horarios` ADD CONSTRAINT `Horarios_instructor_fkey` FOREIGN KEY (`instructor`) REFERENCES `Vinculacion`(`id_vinculacion`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Personas` ADD CONSTRAINT `Personas_municipio_fkey` FOREIGN KEY (`municipio`) REFERENCES `Municipios`(`id_municipio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vinculacion` ADD CONSTRAINT `Vinculacion_instructor_fkey` FOREIGN KEY (`instructor`) REFERENCES `Personas`(`id_persona`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vinculacion` ADD CONSTRAINT `Vinculacion_area_fkey` FOREIGN KEY (`area`) REFERENCES `Areas`(`id_area`) ON DELETE RESTRICT ON UPDATE CASCADE;
