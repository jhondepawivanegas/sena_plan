import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
  return new NextResponse(error.message, { status: 500 });
}

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'ID de horario inválido' }, { status: 400 });
    }

    const horario = await prisma.horarios.findUnique({
      where: { id_horario: parseInt(params.id)},
      include: {

      },
    });

    if (!horario) {
      return NextResponse.json({ error: 'Horario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(horario);
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
    const horario = await prisma.horarios.delete({
      where: { id_horario: parseInt(params.id) },
    });
    return NextResponse.json({ message: "Horario Eliminado", horario }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      throw new Error(`Invalid ID: ${params.id_horario}`);
    }
    const data = await request.json();
    const updatedHorario = await prisma.horarios.update({
      where: { id_horario: parseInt(params.id) },
      data: {
        fecha_inicio: data.fecha_inicio,
        hora_inicio: data.hora_inicio,
        fecha_fin: data.fecha_fin,
        hora_fin: data.hora_fin,
        dia: data.dia,
        cantidad_horas: data.cantidad_horas,
        instructor: data.instructor,
        ficha: data.ficha,
        ambiente: data.ambiente,
      },
    });
    return NextResponse.json({ message: "Horario Actualizado", horario: updatedHorario }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}