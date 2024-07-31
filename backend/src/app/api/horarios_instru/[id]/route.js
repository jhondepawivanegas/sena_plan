// pages/api/horariosInstructores/[id]/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
  return new NextResponse(error.message, { status: 500 });
}

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'ID de instructor inválido' }, { status: 400 });
    }

    const instructor = await prisma.instructores.findUnique({
      where: { id_instructor: parseInt(params.id)},
      include: {
        horarios: true,
      },
    });

    if (!instructor) {
      return NextResponse.json({ error: 'Instructor no encontrado' }, { status: 404 });
    }

    return NextResponse.json(instructor.horarios);
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
    await prisma.instructores.delete({
      where: { id_instructor: parseInt(params.id) },
    });
    return NextResponse.json({ message: "Instructor Eliminado" }, { status: 200 });
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
    const updatedInstructor = await prisma.instructores.update({
      where: { id_instructor: parseInt(params.id) },
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        // ...
      },
    });
    return NextResponse.json({ message: "Instructor Actualizado", instructor: updatedInstructor }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}