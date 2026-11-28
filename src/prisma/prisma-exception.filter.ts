// src/prisma/prisma-exception.filter.ts

import { ArgumentsHost, BadRequestException, Catch, ConflictException, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = 500;
    let message = 'Error interno de base de datos';

    switch (exception.code) {
      case 'P2002':
        status = 409;
        message = new ConflictException('El estudiante ya se encuentra matriculado en este curso').message;
        break;
      case 'P2003':
        status = 400;
        message = new BadRequestException('El estudianteId o cursoId proporcionado no existe').message;
        break;
      case 'P2025':
        status = 404;
        message = new NotFoundException('Registro no encontrado').message;
        break;
      default:
        throw exception;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.code,
    });
  }
}

