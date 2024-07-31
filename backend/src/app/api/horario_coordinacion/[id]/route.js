// pages/api/roles/coordinacion/[id]/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
  return new NextResponse(error.message, { status: 500 });
};

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'ID de coordinación inválido' }, { status: 400 });
    }

    const coordinacion = await prisma.coordinaciones.findUnique({
      where: { id_coordinacion: parseInt(params.id)},
      include: {
        // Add relationships here
        // For example:
        usuario: true,
        programa: true,
      },
    });

    if (!coordinacion) {
      return NextResponse.json({ error: 'Coordinación no encontrada' }, { status: 404 });
    }

    return NextResponse.json(coordinacion);
  } catch (error) {
    return handleErrors(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalido" }, { status: 400 });
    }
    await prisma.coordinaciones.delete({
      where: { id_coordinacion: parseInt(params.id) },
    });
    return NextResponse.json({ message: "Coordinación Eliminada" }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      throw new Error(`Invalid ID: ${params.id}`);
    }
    const data = await request.json();
    const updatedCoordinacion = await prisma.coordinaciones.update({
      where: { id_coordinacion: parseInt(params.id) },
      data: {
        // Add fields here
        // For example:
        usuarioId: data.usuarioId,
        programaId: data.programaId,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
      },
    });
    return NextResponse.json({ message: "Coordinación Actualizada", coordinacion: updatedCoordinacion }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}