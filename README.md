# API Academia

API REST para gestionar una academia: **usuarios, estudiantes, docentes, aulas, cursos y matrículas**, con autenticación **JWT** y permisos por rol.

**Stack:** Node.js · Express 5 · TypeScript · Prisma 7 (PostgreSQL) · Zod · JWT · Swagger UI

---

## Inicio rápido

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno (.env)
DATABASE_URL="postgresql://usuario:password@localhost:5432/academia?schema=public"
JWT_SECRET="cambia-este-secreto"
JWT_EXPIRES_IN="8h"

# 3. Crear tablas y generar el cliente de Prisma
npx prisma migrate dev
npx prisma generate

# 4. Levantar el servidor
pnpm dev
```

- API: http://localhost:3000
- Documentación interactiva (Swagger): http://localhost:3000/api-docs

---

## Estructura del proyecto

```
├── index.ts              # Arranque del servidor
├── app.ts                # Configuración de Express y montaje de rutas
├── prisma/schema.prisma  # Modelo de datos
└── src/
    ├── config/           # Conexión a Prisma y especificación Swagger
    ├── routes/           # Endpoints y permisos por rol
    ├── middlewares/      # JWT (authenticate / authorizeRoles) y validaciones
    ├── schemas/          # Validaciones con Zod
    ├── controllers/      # Manejo de peticiones y respuestas
    ├── services/         # Lógica de negocio (usuarios, matrículas)
    └── models/           # Acceso a datos con Prisma
```

**Flujo de una petición:** `ruta → authenticate (JWT) → authorizeRoles → validación Zod → controller → service/model → Prisma`

---

## Autenticación con JWT

1. Regístrate o inicia sesión:
   ```http
   POST /api/auth/login
   { "ecorreo": "director@academia.edu", "password": "123456" }
   ```
2. Copia el `token` de la respuesta.
3. Envíalo en cada petición:
   ```
   Authorization: Bearer <token>
   ```
   En Swagger, usa el botón **Authorize**.

| Respuesta | Significado |
|-----------|-------------|
| `401` | No se envió token, o es inválido / expiró |
| `403` | El token es válido pero tu rol no tiene permiso |

> El registro público siempre crea usuarios con rol `ESTUDIANTE`. Solo un `DIRECTOR` autenticado puede registrar usuarios `DOCENTE` o `DIRECTOR`.

---

## Roles y permisos

| Rol | Puede hacer |
|-----|-------------|
| **DIRECTOR** | Todo: crear, modificar y eliminar cualquier recurso; gestionar usuarios |
| **DOCENTE** | Consultar información; calificar y cambiar el estado de matrículas |
| **ESTUDIANTE** | Consultar cursos, aulas y docentes; inscribirse en cursos |

---

## Endpoints

### Autenticación — `/api/auth`
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/register` | Público | Registrar usuario y obtener token |
| POST | `/login` | Público | Iniciar sesión y obtener token |
| GET | `/me` | Autenticado | Perfil del usuario actual |

### Usuarios — `/api/users`
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/` | DIRECTOR | Listar usuarios |
| GET | `/:id` | DIRECTOR | Ver usuario |
| POST | `/` | DIRECTOR | Crear usuario |
| PATCH | `/:id` | DIRECTOR | Modificar usuario |
| PATCH | `/:id/status` | DIRECTOR | Activar / desactivar usuario |

### Estudiantes — `/api/estudiantes`
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/` | DOCENTE, DIRECTOR | Listar estudiantes |
| GET | `/:id` | Todos | Ver estudiante y sus matrículas |
| POST | `/` | DIRECTOR | Crear estudiante (con `userId` o datos del usuario) |
| PUT / PATCH | `/:id` | DIRECTOR | Modificar estudiante |
| DELETE | `/:id` | DIRECTOR | Eliminar (si no tiene matrículas) |

### Docentes — `/api/docentes`
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/` | Todos | Listar docentes (`?especialidad=` opcional) |
| GET | `/:id` | Todos | Ver docente |
| GET | `/:id/cursos` | DOCENTE, DIRECTOR | Cursos del docente y sus alumnos |
| POST | `/` | DIRECTOR | Crear docente |
| PUT / PATCH | `/:id` | DIRECTOR | Modificar docente |
| DELETE | `/:id` | DIRECTOR | Eliminar (si no tiene cursos) |

### Aulas — `/api/aulas`
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/` , `/:id` | Todos | Listar / ver aulas |
| POST | `/` | DIRECTOR | Crear aula |
| PUT | `/:id` | DIRECTOR | Modificar aula |
| DELETE | `/:id` | DIRECTOR | Eliminar aula |

### Cursos — `/api/cursos`
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/` , `/:id` | Todos | Listar / ver cursos |
| POST | `/` | DIRECTOR | Crear curso (asigna docente y aula) |
| PUT | `/:id` | DIRECTOR | Modificar curso |
| DELETE | `/:id` | DIRECTOR | Eliminar curso |

### Matrículas — `/api/matriculas`
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/` , `/:id` | Todos | Listar / ver matrículas |
| POST | `/` | ESTUDIANTE, DIRECTOR | Inscribir estudiante en un curso |
| PATCH | `/:id` | DOCENTE, DIRECTOR | Registrar calificación o cambiar estado |
| DELETE | `/:id` | DIRECTOR | Eliminar matrícula |

**Reglas de negocio de matrículas:** un estudiante no puede inscribirse dos veces al mismo curso y no se puede superar la capacidad del aula.

---

## Modelo de datos

```mermaid
erDiagram
    USER ||--o| ESTUDIANTE : "tiene perfil"
    USER ||--o| DOCENTE : "tiene perfil"
    DOCENTE ||--o{ CURSO : imparte
    AULA ||--o{ CURSO : aloja
    ESTUDIANTE ||--o{ MATRICULA : realiza
    CURSO ||--o{ MATRICULA : recibe

    USER {
        int id PK
        string nombres
        string apellidos
        string ecorreo UK
        string password
        string telefono
        Role rol "ESTUDIANTE | DOCENTE | DIRECTOR"
        boolean activo
        datetime createdAt
    }
    ESTUDIANTE {
        int id PK
        string documentoIdentidad UK
        date fechaNacimiento
        int userId FK, UK
    }
    DOCENTE {
        int id PK
        string especialidad
        int userId FK, UK
    }
    AULA {
        int id PK
        string nombreAula UK
        int capacidad
        string ubicacion
    }
    CURSO {
        int id PK
        string nombreCurso
        string descripcion
        int duracionHoras
        string horario
        int docenteId FK
        int aulaId FK
    }
    MATRICULA {
        int id PK
        int estudianteId FK
        int cursoId FK
        datetime fechaInscripcion
        decimal calificacionFinal
        EstadoMatricula estado "INSCRITO | APROBADO | REPROBADO | RETIRADO"
    }
```

- Un **User** puede tener como máximo un perfil de **Estudiante** o **Docente** (al eliminar el usuario se elimina su perfil).
- Un **Docente** imparte varios **Cursos**; cada **Curso** se dicta en un **Aula**.
- La **Matrícula** une Estudiante y Curso (par único) y guarda la calificación y el estado.
