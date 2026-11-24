// prisma/seed.ts nuevo

import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// pnpm tsx prisma/seed.ts
// Director: 1 registro (director@academia.edu / pas123).
// Docentes: 9 registros (laura@academia.edu, roberto@academia.edu, etc. / pas123).
// Aulas: 6 registros (Aula 101 hasta Lab Cómputo 3).
// Cursos: 9 registros (6 asignados a cada aula + 3 adicionales).
// Estudiantes y Matrículas: 108 estudiantes y 90 matrículas (18 por cada una de las 6 aulas).

async function main() {
  // 1. Crear 1 usuario Director
  console.log("Creando 1 Director y 9 Docentes...");
  const director = await prisma.user.create({
    data: {
        nombres: "Carlos",     apellidos: "Mendoza", 
        telefono: "987654321", rol: "DIRECTOR",
        ecorreo: "director@academia.edu",
        password: "pas123",

    },
  });

  // 2. Crear 9 Docentes con su respectivo User
  const docente1 = await prisma.docente.create({
    data: {
      especialidad: "Backend & Node.js",
      user: {
        create: {
          nombres: "Laura",      apellidos: "Gómez",
          ecorreo: "laura@academia.edu",
          password: "pas123",    rol: "DOCENTE",
        },
      },
    },
  });

  const docente2 = await prisma.docente.create({
    data: {
      especialidad: "Bases de Datos SQL",
      user: {
        create: {
          nombres: "Roberto",     apellidos: "Silva",
          ecorreo: "roberto@academia.edu",
          password: "pas123",     rol: "DOCENTE",
        },
      },
    },
  });

  const docente3 = await prisma.docente.create({
    data: {
      especialidad: "Diseño UX/UI",
      user: {
        create: {
          nombres: "Elena",       apellidos: "Rojas",
          ecorreo: "elena@academia.edu",
          password: "pas123",     rol: "DOCENTE",
        },
      },
    },
  });

  const docente4 = await prisma.docente.create({
    data: {
      especialidad: "Python e IA",
      user: {
        create: {
          nombres: "Marcos",      apellidos: "Castro",
          ecorreo: "marcos@academia.edu",
          password: "pas123",     rol: "DOCENTE",
        },
      },
    },
  });

  const docente5 = await prisma.docente.create({
    data: {
      especialidad: "Frontend & React",
      user: {
        create: {
          nombres: "Patricia",    apellidos: "Morales",
          ecorreo: "patricia@academia.edu",
          password: "pas123",     rol: "DOCENTE",
        },
      },
    },
  });

  const docente6 = await prisma.docente.create({
    data: {
      especialidad: "DevOps & Cloud",
      user: {
        create: {
          nombres: "Fernando",   apellidos: "Ortiz",
          ecorreo: "fernando@academia.edu",
          password: "pas123",    rol: "DOCENTE",
        },
      },
    },
  });

  const docente7 = await prisma.docente.create({
    data: {
      especialidad: "Ciberseguridad",
      user: {
        create: {
          nombres: "Gabriela",    apellidos: "Navarro",
          ecorreo: "gabriela@academia.edu",
          password: "pas123",     rol: "DOCENTE",
        },
      },
    },
  });

  const docente8 = await prisma.docente.create({
    data: {
      especialidad: "Desarrollo Móvil",
      user: {
        create: {
          nombres: "Ricardo",    apellidos: "Paredes",
          ecorreo: "ricardo@academia.edu",
          password: "pas123",    rol: "DOCENTE",
        },
      },
    },
  });

  const docente9 = await prisma.docente.create({
    data: {
      especialidad: "Arquitectura de Software",
      user: {
        create: {
          nombres: "Valeria",
          apellidos: "Campos",
          ecorreo: "valeria@academia.edu",
          password: "pas123",
          rol: "DOCENTE",
        },
      },
    },
  });

  // 3. Crear 6 Aulas
  console.log("Creando 6 aulas...");
  const aula1 = await prisma.aula.create({
    data: { nombreAula: "Aula 101", capacidad: 30, ubicacion: "Piso 1" },
  });
  const aula2 = await prisma.aula.create({
    data: { nombreAula: "Lab Cómputo 1", capacidad: 20, ubicacion: "Piso 2" },
  });
  const aula3 = await prisma.aula.create({
    data: { nombreAula: "Lab Cómputo 2", capacidad: 20, ubicacion: "Piso 2" },
  });
  const aula4 = await prisma.aula.create({
    data: { nombreAula: "Sala Virtual 1", capacidad: 50, ubicacion: "Online" },
  });
  const aula5 = await prisma.aula.create({
    data: { nombreAula: "Aula 102", capacidad: 35, ubicacion: "Piso 1" },
  });
  const aula6 = await prisma.aula.create({
    data: { nombreAula: "Lab Cómputo 3", capacidad: 25, ubicacion: "Piso 3" },
  });

  // 4. Crear los 6 Cursos principales (1 por cada aula)
  console.log("Creando 6 Cursos principales...");
  const cursosPrincipales = await Promise.all([
    prisma.curso.create({
      data: {
        nombreCurso: "Backend con Node.js y Prisma",
        descripcion: "APIs REST con TypeScript",
        duracionHoras: 48,
        horario: "Lun y Mié 18:00 - 21:00",
        docenteId: docente1.id,
        aulaId: aula1.id,
      },
    }),
    prisma.curso.create({
      data: {
        nombreCurso: "PostgreSQL Avanzado",
        descripcion: "Normalización y consultas complejas",
        duracionHoras: 36,
        horario: "Mar y Jue 18:00 - 21:00",
        docenteId: docente2.id,
        aulaId: aula2.id,
      },
    }),
    prisma.curso.create({
      data: {
        nombreCurso: "Diseño UX/UI",
        descripcion: "Prototipado en Figma",
        duracionHoras: 24,
        horario: "Sáb 09:00 - 13:00",
        docenteId: docente3.id,
        aulaId: aula3.id,
      },
    }),
    prisma.curso.create({
      data: {
        nombreCurso: "Python e Inteligencia Artificial",
        descripcion: "Fundamentos de ML",
        duracionHoras: 40,
        horario: "Vie 18:00 - 22:00",
        docenteId: docente4.id,
        aulaId: aula4.id,
      },
    }),
    prisma.curso.create({
      data: {
        nombreCurso: "Frontend Moderno con React",
        descripcion: "Componentes, hooks y estado global",
        duracionHoras: 44,
        horario: "Lun y Mié 19:00 - 22:00",
        docenteId: docente5.id,
        aulaId: aula5.id,
      },
    }),
    prisma.curso.create({
      data: {
        nombreCurso: "Docker y Kubernetes",
        descripcion: "Contenedores y despliegue en la nube",
        duracionHoras: 32,
        horario: "Mar y Jue 19:00 - 21:30",
        docenteId: docente6.id,
        aulaId: aula6.id,
      },
    }),
  ]);

    // 5. Crear 3 Cursos adicionales compartiendo aulas en otro horario 
    // (sin alumnos matriculados aún)
  console.log("Agregando 3 Cursos adicionales sin alumnos...");
  await Promise.all([
    prisma.curso.create({
      data: {
        nombreCurso: "Seguridad en Aplicaciones Web",
        descripcion: "OWASP Top 10 y pruebas de penetración",
        duracionHoras: 30,
        horario: "Sáb 14:00 - 18:00",
        docenteId: docente7.id,
        aulaId: aula1.id,
      },
    }),
    prisma.curso.create({
      data: {
        nombreCurso: "Desarrollo Móvil con React Native",
        descripcion: "Apps nativas para iOS y Android",
        duracionHoras: 40,
        horario: "Vie 18:00 - 22:00",
        docenteId: docente8.id,
        aulaId: aula2.id,
      },
    }),
    prisma.curso.create({
      data: {
        nombreCurso: "Microservicios y Clean Architecture",
        descripcion: "Patrones de diseño escalables",
        duracionHoras: 36,
        horario: "Dom 09:00 - 13:00",
        docenteId: docente9.id,
        aulaId: aula3.id,
      },
    }),
  ]);

    // 6. Crear 18 Estudiantes únicos por cada Aula 
    // (108 estudiantes de 400 combinaciones aleatorias)
    console.log("Agregando 18 Estudiantes únicos y matrículas por cada aula...");

    const nombresBase = [
        "Ana", "Luis", "Sofía", "Diego", "Camila",
        "Mateo", "Lucía", "Sebastián", "Mariana", "Andrés",
        "Valeria", "Javier", "Paula", "Gabriel", "Daniela",
        "Alejandro", "Natalia", "Carlos", "Fernanda", "Ricardo",
    ];

    const apellidosBase = [
        "Torres", "Pérez", "Ramírez", "Vargas", "Herrera",
        "Díaz", "Mendoza", "Cruz", "Flores", "Ríos",
        "Salazar", "Castillo", "Morales", "Ortega", "Reyes",
        "Guzmán", "Paredes", "Navarro", "Castro", "Rojas",
    ];

    // 6.1. Generar las 400 combinaciones posibles
    const personasUnicas: { nombre: string; apellido: string }[] = [];
    for (const nombre of nombresBase) {
        for (const apellido of apellidosBase) {
            personasUnicas.push({ nombre, apellido });
        }
    }

    // 6.2. Mezclar (Shuffle Fisher-Yates) para que las aulas tengan nombres variados
    for (let i = personasUnicas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [personasUnicas[i], personasUnicas[j]] = [personasUnicas[j], personasUnicas[i]];
    }

    // Función auxiliar para limpiar tildes y la "ñ" en los correos
    const limpiarTexto = (texto: string) =>
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/ñ/g, "n");

    const ALUMNOS_POR_AULA = 18;
    let contadorGlobal = 1;

    for (let i = 0; i < cursosPrincipales.length; i++) {
        const cursoActual = cursosPrincipales[i];

        for (let j = 0; j < ALUMNOS_POR_AULA; j++) {
            const persona = personasUnicas[contadorGlobal - 1];
            const dni = String(71234000 + contadorGlobal);
            const correo = `${limpiarTexto(persona.nombre)}.${limpiarTexto(persona.apellido)}@academia.edu`;

            const estudiante = await prisma.estudiante.create({
                data: {
                    documentoIdentidad: dni,
                    fechaNacimiento: new Date(`200${j % 4}-0${(j % 9) + 1}-15`),
                    user: {
                        create: {
                            nombres: persona.nombre,
                            apellidos: persona.apellido,
                            ecorreo: correo,
                            password: "pas123",
                            rol: "ESTUDIANTE",
                        },
                    },
                },
            });

            let estadoMatricula: "APROBADO" | "INSCRITO" | "REPROBADO" = "INSCRITO";
            let nota: number | undefined = undefined;

            if (j % 3 === 0) {
                estadoMatricula = "APROBADO";
                nota = 16.5;
            } else if (j % 5 === 0) {
                estadoMatricula = "REPROBADO";
                nota = 9.5;
            }

            await prisma.matricula.create({
                data: {
                    estudianteId: estudiante.id,
                    cursoId: cursoActual.id,
                    calificacionFinal: nota,
                    estado: estadoMatricula,
                },
            });

            contadorGlobal++;
        }
    }

  console.log("Base de datos poblada correctamente:", {
    directorId: director.id,
    totalAulas: 6,     totalCursos: 9,
    totalEstudiantesCreados: contadorGlobal - 1,
  });
}

export async function runSeed() {
  try {
    console.log("Vaciando tablas en cascada...");
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE users, estudiantes, docentes, aulas, cursos, matriculas RESTART IDENTITY CASCADE;`
    );

    await main();
    console.log("Datos insertados con éxito.");
  } catch (error) {
    console.error("Error al poblar la base de datos:", error);
} finally {
await prisma.$disconnect();
}
}
runSeed();
