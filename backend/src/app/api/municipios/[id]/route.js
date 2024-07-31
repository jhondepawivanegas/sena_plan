// pages/api/municipios/[id]/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
  return new NextResponse(error.message, { status: 500 });
};

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const municipio = await prisma.municipios.findUnique({
      where: { id_municipio: id },
      include: {
        Ambientes: true,
      },
    });

    if (!municipio) {
      return NextResponse.json({ error: "Municipio no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ datos: municipio }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}



export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: "identificación invalida" }, { status: 400 });
    }

    await prisma.municipios.delete({ where: { id_municipio: id } });

    return NextResponse.json({ message: "Municipio eliminado " }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}
export async function PUT(request, { params }) {
    try {
        const id = parseInt(params.id);
        const data = await request.json();


        
        const updatedAmbiente = await prisma.municipios.update({
        where: { id_municipio: parseInt(params.id) },
        data: {
            nombre_mpio: data.nombre_mpio,
            departamento: data.departamento,
        },
        });
        return NextResponse.json({ message: "Municipio Actualizado" }, { status: 200 });
    } catch (error) {
        return handleErrors(error);
    }
    }