import { matriculaPaths } from "./matricula.swagger";
export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "API Academia",
    version: "1.0.0",
    description:
      "API RESTful para la gestión académica de Estudiantes (ESTUDIANTE), Docentes (DOCENTE), Aulas, Cursos y Matrículas, administrada por Dirección (DIRECTOR) y protegida mediante JWT.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local de desarrollo",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Ingresa el token JWT obtenido en /api/auth/login o /api/auth/register",
      },
    },
    schemas: {
      Role: {
        type: "string",
        enum: ["ESTUDIANTE", "DOCENTE", "DIRECTOR"],
        example: "ESTUDIANTE",
      },
      EstadoMatricula: {
        type: "string",
        enum: ["INSCRITO", "APROBADO", "REPROBADO", "RETIRADO"],
        example: "INSCRITO",
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nombres: { type: "string", maxLength: 100, example: "Juan Carlos" },
          apellidos: { type: "string", maxLength: 100, example: "Pérez Gómez" },
          ecorreo: { type: "string", format: "email", maxLength: 100, example: "juan.perez@academia.edu" },
          telefono: { type: "string", maxLength: 20, nullable: true, example: "5512345678" },
          rol: { $ref: "#/components/schemas/Role" },
          activo: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time", example: "2026-11-17T14:00:00Z" },
        },
      },
      Estudiante: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          documentoIdentidad: { type: "string", maxLength: 20, example: "DNI12345678" },
          fechaNacimiento: { type: "string", format: "date", nullable: true, example: "2002-05-15" },
          userId: { type: "integer", example: 1 },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      Docente: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          especialidad: { type: "string", maxLength: 100, example: "Desarrollo Web Full Stack" },
          userId: { type: "integer", example: 2 },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      Aula: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nombreAula: { type: "string", maxLength: 50, example: "Laboratorio 101" },
          capacidad: { type: "integer", example: 30 },
          ubicacion: { type: "string", maxLength: 100, nullable: true, example: "Edificio A - Piso 1" },
        },
      },
      Curso: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nombreCurso: { type: "string", maxLength: 120, example: "Programación Backend con TypeScript" },
          descripcion: { type: "string", nullable: true, example: "Curso práctico de Node.js, Express y Prisma ORM" },
          duracionHoras: { type: "integer", example: 60 },
          horario: { type: "string", maxLength: 100, example: "Lunes y Miércoles 18:00 - 20:00" },
          docenteId: { type: "integer", example: 1 },
          aulaId: { type: "integer", example: 1 },
        },
      },
      Matricula: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          estudianteId: { type: "integer", example: 1 },
          cursoId: { type: "integer", example: 1 },
          fechaInscripcion: { type: "string", format: "date-time", example: "2026-11-17T14:00:00Z" },
          calificacionFinal: { type: "number", format: "decimal", nullable: true, example: 95.5 },
          estado: { $ref: "#/components/schemas/EstadoMatricula" },
        },
      },
    },
  },
  // Todos los endpoints usan JWT por defecto (excepto /health, login y register)
  security: [{ bearerAuth: [] }],
  tags: [
    { name: "Salud", description: "Estado del servidor" },
    { name: "Autenticación (JWT)", description: "Inicio de sesión, registro y perfil de usuario (ESTUDIANTE, DOCENTE, DIRECTOR)" },
    { name: "Usuarios", description: "Gestión de cuentas de usuario (User)" },
    { name: "Estudiantes", description: "Registro de estudiantes y consulta de historial académico" },
    { name: "Docentes", description: "Directorio de docentes y asignación de cursos" },
    { name: "Aulas", description: "Catálogo y disponibilidad de aulas físicas/virtuales" },
    { name: "Cursos", description: "Gestión de cursos, horarios, aulas y docentes asignados" },
    { name: "Matrículas", description: "Inscripción de estudiantes a cursos, estado y calificación final" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Salud"],
        summary: "Verifica que el servidor esté activo",
        responses: {
          "200": {
            description: "Servidor funcionando",
            content: {
              "application/json": {
                example: { status: "ok" },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Autenticación (JWT)"],
        summary: "Registrar un nuevo usuario con rol (ESTUDIANTE, DOCENTE o DIRECTOR)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nombres", "apellidos", "ecorreo", "password"],
                properties: {
                  nombres: { type: "string", maxLength: 100, example: "Juan Carlos" },
                  apellidos: { type: "string", maxLength: 100, example: "Pérez Gómez" },
                  ecorreo: { type: "string", format: "email", example: "juan.perez@academia.edu" },
                  password: { type: "string", example: "123456" },
                  telefono: { type: "string", maxLength: 20, example: "5512345678" },
                  rol: {
                    type: "string",
                    enum: ["ESTUDIANTE", "DOCENTE", "DIRECTOR"],
                    default: "ESTUDIANTE",
                    example: "ESTUDIANTE",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Usuario registrado y token JWT generado" },
          "400": { description: "Datos inválidos" },
          "409": { description: "El correo electrónico (ecorreo) ya está registrado" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Autenticación (JWT)"],
        summary: "Iniciar sesión y obtener token JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["ecorreo", "password"],
                properties: {
                  ecorreo: { type: "string", format: "email", example: "director@academia.edu" },
                  password: { type: "string", example: "123456" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Credenciales válidas; devuelve token JWT y datos del usuario" },
          "401": { description: "Credenciales inválidas o usuario inactivo" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Autenticación (JWT)"],
        summary: "Obtener perfil del usuario autenticado",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Perfil del usuario actual y su perfil de Estudiante o Docente vinculado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "401": { description: "Token faltante o inválido" },
        },
      },
    },
    "/api/estudiantes": {
      get: {
        tags: ["Estudiantes"],
        summary: "Listar todos los estudiantes (Roles: DOCENTE, DIRECTOR)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Lista de estudiantes con sus datos de usuario",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Estudiante" },
                },
              },
            },
          },
          "401": { description: "No autenticado" },
        },
      },
      post: {
        tags: ["Estudiantes"],
        summary: "Crear perfil de estudiante vinculado a un usuario (Rol: DIRECTOR)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["documentoIdentidad", "userId"],
                properties: {
                  documentoIdentidad: { type: "string", maxLength: 20, example: "DNI12345678" },
                  fechaNacimiento: { type: "string", format: "date", example: "2002-05-15" },
                  userId: { type: "integer", example: 1 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Estudiante registrado exitosamente" },
          "400": { description: "Datos inválidos o usuario inexistente" },
          "401": { description: "No autenticado" },
          "403": { description: "Se requiere rol DIRECTOR" },
          "409": { description: "Documento de identidad o userId ya vinculado" },
        },
      },
    },
    "/api/estudiantes/{id}": {
      get: {
        tags: ["Estudiantes"],
        summary: "Consultar detalle de un estudiante y sus matrículas (Roles: ESTUDIANTE, DOCENTE, DIRECTOR)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID del estudiante",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          "200": {
            description: "Datos del estudiante e historial de matrículas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Estudiante" },
              },
            },
          },
          "401": { description: "No autenticado" },
          "404": { description: "Estudiante no encontrado" },
        },
      },
    },
    "/api/docentes": {
      get: {
        tags: ["Docentes"],
        summary: "Listar docentes y filtrar por especialidad (Roles: ESTUDIANTE, DOCENTE, DIRECTOR)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "especialidad",
            in: "query",
            description: "Filtro por especialidad del docente",
            schema: { type: "string", example: "Backend" },
          },
        ],
        responses: {
          "200": {
            description: "Lista de docentes",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Docente" },
                },
              },
            },
          },
          "401": { description: "No autenticado" },
        },
      },
      post: {
        tags: ["Docentes"],
        summary: "Dar de alta un nuevo docente vinculado a un usuario (Rol: DIRECTOR)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["especialidad", "userId"],
                properties: {
                  especialidad: { type: "string", maxLength: 100, example: "Desarrollo Web Full Stack" },
                  userId: { type: "integer", example: 2 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Docente registrado" },
          "400": { description: "Datos inválidos o usuario inexistente" },
          "401": { description: "No autenticado" },
          "403": { description: "Se requiere rol DIRECTOR" },
          "409": { description: "El usuario ya está vinculado a un docente" },
        },
      },
    },
    "/api/docentes/{id}/cursos": {
      get: {
        tags: ["Docentes"],
        summary: "Obtener los cursos asignados a un docente (Roles: DOCENTE, DIRECTOR)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID del docente",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          "200": { description: "Datos del docente y sus cursos asignados" },
          "401": { description: "No autenticado" },
          "404": { description: "Docente no encontrado" },
        },
      },
    },
    "/api/aulas": {
      get: {
        tags: ["Aulas"],
        summary: "Listar todas las aulas (Público / Autenticado)",
        responses: {
          "200": {
            description: "Lista de aulas con su capacidad y ubicación",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Aula" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Aulas"],
        summary: "Registrar una nueva aula (Rol: DIRECTOR)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nombreAula", "capacidad"],
                properties: {
                  nombreAula: { type: "string", maxLength: 50, example: "Laboratorio 101" },
                  capacidad: { type: "integer", example: 30 },
                  ubicacion: { type: "string", maxLength: 100, example: "Edificio A - Piso 1" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Aula creada exitosamente" },
          "400": { description: "Datos inválidos" },
          "401": { description: "No autenticado" },
          "403": { description: "Se requiere rol DIRECTOR" },
          "409": { description: "El nombre del aula ya existe" },
        },
      },
    },
    "/api/cursos": {
      get: {
        tags: ["Cursos"],
        summary: "Listar todos los cursos con su docente y aula (Roles: ESTUDIANTE, DOCENTE, DIRECTOR)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Lista de cursos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Curso" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Cursos"],
        summary: "Crear un nuevo curso asignando docente y aula (Rol: DIRECTOR)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nombreCurso", "duracionHoras", "horario", "docenteId", "aulaId"],
                properties: {
                  nombreCurso: { type: "string", maxLength: 120, example: "Programación Backend con TypeScript" },
                  descripcion: { type: "string", example: "Curso práctico de Node.js, Express y Prisma ORM" },
                  duracionHoras: { type: "integer", example: 60 },
                  horario: { type: "string", maxLength: 100, example: "Lunes y Miércoles 18:00 - 20:00" },
                  docenteId: { type: "integer", example: 1 },
                  aulaId: { type: "integer", example: 1 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Curso creado exitosamente" },
          "400": { description: "Datos inválidos, docente o aula inexistente" },
          "401": { description: "No autenticado" },
          "403": { description: "Se requiere rol DIRECTOR" },
        },
      },
    },
    "/api/cursos/{id}": {
      get: {
        tags: ["Cursos"],
        summary: "Obtener detalle de un curso por ID, incluyendo docente, aula y matrículas",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID del curso",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          "200": {
            description: "Detalle del curso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Curso" },
              },
            },
          },
          "401": { description: "No autenticado" },
          "404": { description: "Curso no encontrado" },
        },
      },
    },
    // esparciendo ...matriculaPaths
    ...matriculaPaths,
  },
};
