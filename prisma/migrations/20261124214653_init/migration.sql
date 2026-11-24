-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ESTUDIANTE', 'DOCENTE', 'DIRECTOR');

-- CreateEnum
CREATE TYPE "EstadoMatricula" AS ENUM ('INSCRITO', 'APROBADO', 'REPROBADO', 'RETIRADO');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "ecorreo" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20),
    "rol" "Role" NOT NULL DEFAULT 'ESTUDIANTE',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudiantes" (
    "id" SERIAL NOT NULL,
    "documento_identidad" VARCHAR(20) NOT NULL,
    "fecha_nacimiento" DATE,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docentes" (
    "id" SERIAL NOT NULL,
    "especialidad" VARCHAR(100) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "docentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aulas" (
    "id" SERIAL NOT NULL,
    "nombre_aula" VARCHAR(50) NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "ubicacion" VARCHAR(100),

    CONSTRAINT "aulas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" SERIAL NOT NULL,
    "nombre_curso" VARCHAR(120) NOT NULL,
    "descripcion" TEXT,
    "duracion_horas" INTEGER NOT NULL,
    "horario" VARCHAR(100) NOT NULL,
    "docente_id" INTEGER NOT NULL,
    "aula_id" INTEGER NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matriculas" (
    "id" SERIAL NOT NULL,
    "estudiante_id" INTEGER NOT NULL,
    "curso_id" INTEGER NOT NULL,
    "fecha_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calificacion_final" DECIMAL(5,2),
    "estado" "EstadoMatricula" NOT NULL DEFAULT 'INSCRITO',

    CONSTRAINT "matriculas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_ecorreo_key" ON "users"("ecorreo");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_documento_identidad_key" ON "estudiantes"("documento_identidad");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_user_id_key" ON "estudiantes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "docentes_user_id_key" ON "docentes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "aulas_nombre_aula_key" ON "aulas"("nombre_aula");

-- CreateIndex
CREATE UNIQUE INDEX "matriculas_estudiante_id_curso_id_key" ON "matriculas"("estudiante_id", "curso_id");

-- AddForeignKey
ALTER TABLE "estudiantes" ADD CONSTRAINT "estudiantes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "docentes" ADD CONSTRAINT "docentes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_docente_id_fkey" FOREIGN KEY ("docente_id") REFERENCES "docentes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_aula_id_fkey" FOREIGN KEY ("aula_id") REFERENCES "aulas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "estudiantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
