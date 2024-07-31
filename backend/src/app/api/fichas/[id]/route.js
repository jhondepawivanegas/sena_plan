import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
  return new NextResponse(error.message, { status: 500 });
}

export async function GET(request, { params }) {
  try {
    const codigo = parseInt(params.id);
    if (isNaN(codigo) || codigo <= 0) {
      return NextResponse.json({ error: 'Código de ficha inválido' }, { status: 400 });
    }

    const ficha = await prisma.fichas.findUnique({
      where: { codigo:codigo},
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
      where: { codigo: codigo }, // Corregido: proporcionar objeto con clave y valor
    });
    return NextResponse.json({ message: "Ficha elimanada con exito", ficha }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const codigo = parseInt(params.codigo);
    if (isNaN(codigo)) {
      throw new Error(`Invalid codigo: ${params.codigo}`);
    }
    const data = await request.json();
    const updatedFicha = await prisma.fichas.update({
      where: { codigo },
      data: {
        inicio_fecha: new Date(data.inicio_fecha),
        fin_lectiva: new Date(data.fin_lectiva),
        fin_ficha: new Date(data.fin_ficha),
        programa: { connect: { id: data.programa } },
        sede: data.sede,
        estado: data.estado,
      },
    });
    return NextResponse.json({ message: "Ficha updated successfully", ficha: updatedFicha }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}
