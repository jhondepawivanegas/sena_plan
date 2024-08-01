import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
  return new NextResponse(error.message, { status: 500 });
}

export async function GET(request, { params }) {
  try {
    const codigo = parseInt(params.id);
    console.log("codigo: ", codigo);
    console.log("parametros", params)
    if (isNaN(codigo) || codigo <= 0) {
      return NextResponse.json({ error: 'Código de ficha inválido' }, { status: 400 });
    }

    const ficha = await prisma.fichas.findUnique({
      where: { codigo: codigo },
      include: {

      },
    });

    if (!ficha) {
      return NextResponse.json({ error: 'Ficha no encontrada' }, { status: 404 });
    }

    return NextResponse.json(ficha);
  } catch (error) {
    return handleErrors(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const codigo = parseInt(params.id);
    if (isNaN(codigo)) {
      return NextResponse.json({ error: "Código invalido" }, { status: 400 });
    }
    const ficha = await prisma.fichas.delete({
      where: { codigo },
    });
    return NextResponse.json({ message: "Ficha eliminada", ficha }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      throw new Error(`Codigo Invalido: ${params.codigo}`);
    }
    const data = await request.json();
    const programa = await prisma.programas.findUnique({
      where: { id_programa: data.programa },
    });
    
    const updatedFicha = await prisma.fichas.update({
      where: { codigo: parseInt(params.id) },
      data: {
        inicio_fecha: new Date(data.inicio_fecha),
        fin_lectiva: new Date(data.fin_lectiva),
        fin_ficha: new Date(data.fin_ficha),
        programa: { set: data.programa }, // Use the `set` method to update the relation
        sede: data.sede,
        estado: data.estado,
      },
    });
    return NextResponse.json({ message: "Ficha Actualizada", ficha: updatedFicha }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}