// src/config/matricula.swagger.ts

export const matriculaPaths = {
  "/api/matriculas": {
    get: {
      tags: ["Matrículas"],
      summary: "Listar todas las matrículas (Roles: ESTUDIANTE, DOCENTE, DIRECTOR)",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Matrículas obtenidas correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Matrículas obtenidas correctamente" },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Matricula" },
                  },
                },
              },
            },
          },
        },
        "401": { description: "No autenticado" },
        "500": { description: "Error interno al consultar las matrículas" },
      },
    },
    post: {
      tags: ["Matrículas"],
      summary: "Inscribir un estudiante en un curso (Roles: ESTUDIANTE, DIRECTOR)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["estudianteId", "cursoId"],
              properties: {
                estudianteId: { type: "integer", example: 1 },
                cursoId: { type: "integer", example: 7 },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Matrícula registrada correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Matrícula registrada correctamente" },
                  data: { $ref: "#/components/schemas/Matricula" },
                },
              },
            },
          },
        },
        "400": { description: "Datos de entrada inválidos" },
        "401": { description: "No autenticado" },
        "404": { description: "El estudiante no existe o el curso no existe" },
        "409": {
          description:
            "El estudiante ya se encuentra matriculado en este curso o el curso alcanzó la capacidad máxima del aula",
        },
        "500": { description: "Error interno al registrar la matrícula" },
      },
    },
  },

 "/api/matriculas/aula/{aulaId}": {
    get: {
      tags: ["Matrículas"],
      summary: "Listar matrículas filtradas por aula (Roles: ESTUDIANTE, DOCENTE, DIRECTOR)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "aulaId",
          in: "path",
          required: true,
          description: "ID del aula",
          schema: { type: "integer", example: 1 },
        },
      ],
      responses: {
        "200": {
          description: "Matrículas por aula obtenidas correctamente",
          // ... (mantén tu esquema de respuesta actual)
        },
        "400": { description: "El ID del aula debe ser un número válido" },
        "401": { description: "No autenticado" },
        "403": { description: "Acceso denegado" },
        "404": { description: "Aula no encontrada" },
        "500": { description: "Error interno al consultar las matrículas por aula" },
      },
    },
  },
  
  "/api/matriculas/{id}": {
    get: {
      tags: ["Matrículas"],
      summary: "Obtener detalle de una matrícula por ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID de la matrícula",
          schema: { type: "integer", example: 1 },
        },
      ],
      responses: {
        "200": {
          description: "Matrícula obtenida correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Matrícula obtenida correctamente" },
                  data: { $ref: "#/components/schemas/Matricula" },
                },
              },
            },
          },
        },
        "400": { description: "El ID debe ser un número válido" },
        "401": { description: "No autenticado" },
        "404": { description: "Matrícula no encontrada" },
        "500": { description: "Error interno al consultar la matrícula" },
      },
    },
    patch: {
      tags: ["Matrículas"],
      summary: "Actualizar calificación final y/o estado de una matrícula (Roles: DOCENTE, DIRECTOR)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID de la matrícula",
          schema: { type: "integer", example: 1 },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                calificacionFinal: {
                  type: "number",
                  format: "decimal",
                  minimum: 0,
                  maximum: 20,
                  example: 18.5,
                },
                estado: {
                  $ref: "#/components/schemas/EstadoMatricula",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Matrícula actualizada correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Matrícula actualizada correctamente" },
                  data: { $ref: "#/components/schemas/Matricula" },
                },
              },
            },
          },
        },
        "400": { description: "El ID debe ser un número válido o datos inválidos" },
        "401": { description: "No autenticado" },
        "403": { description: "Se requiere rol DOCENTE o DIRECTOR" },
        "404": { description: "Matrícula no encontrada" },
        "500": { description: "Error interno al actualizar la matrícula" },
      },
    },
    delete: {
      tags: ["Matrículas"],
      summary: "Eliminar una matrícula por ID (Rol: DIRECTOR)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID de la matrícula",
          schema: { type: "integer", example: 1 },
        },
      ],
      responses: {
        "200": {
          description: "Matrícula eliminada correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Matrícula eliminada correctamente" },
                },
              },
            },
          },
        },
        "400": { description: "El ID debe ser un número válido" },
        "401": { description: "No autenticado" },
        "403": { description: "Se requiere rol DIRECTOR" },
        "404": { description: "Matrícula no encontrada" },
        "500": { description: "Error interno al eliminar la matrícula" },
      },
    },
  },
};
// fin - src/config/matricula.swagger.ts