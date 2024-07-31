import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
  return new NextResponse(error.message, { status: 500 });
}

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'ID de persona inválido' }, { status: 400 });
    }

    const persona = await prisma.personas.findUnique({
      where: { id_persona: parseInt(params.id)},
      include: {
        // Agrega relaciones con otras tablas si es necesario
      },
    });

    if (!persona) {
      return NextResponse.json({ error: 'Persona no encontrada' }, { status: 404 });
    }

    return NextResponse.json(persona);
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
    const persona = await prisma.personas.delete({
      where: { id_persona: parseInt(params.id) },
    });
    return NextResponse.json({ message: "Persona deleted successfully", persona }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      throw new Error(`Invalid ID: ${params.id_persona}`);
    }
    const data = await request.json();
    const updatedPersona = await prisma.personas.update({
      where: { id_persona: parseInt(params.id) },
      data: {
        identificacion: data.identificacion,
        nombres: data.nombres,
        correo: data.correo,
        telefono: data.telefono,
        password: data.password,
        rol: data.rol,
        cargo: data.cargo,
        municipio: data.municipio,
      },
    });
    return NextResponse.json({ message: "Persona updated successfully", persona: updatedPersona }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}