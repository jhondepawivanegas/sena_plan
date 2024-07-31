import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
return new NextResponse(error.message, { status: 500 });
};

export async function GET(request, { params }) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id) || id <= 0) {
        return NextResponse.json({ error: 'ID de ambiente inválido' }, { status: 400 });
      }
  
      const ambiente = await prisma.ambientes.findUnique({
        where: { id_ambiente: parseInt(params.id)},
        include: {

        },
      });
  
      if (!ambiente) {
        return NextResponse.json({ error: 'Ambiente no encontrado' }, { status: 404 });
      }
  
      return NextResponse.json(ambiente);
    } catch (error) {
      return handleErrors(error);
    }
  }

  export async function DELETE(request, { params }) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)){
        return NextResponse.json({ error: 'ID de ambiente inválido' }, { status: 400 });
      }
      const ambiente = await prisma.ambientes.delete({
        where: { id_ambiente: parseInt(params.id) },
      })
      return NextResponse.json({ message: "Ambiente eliminado",ambiente }, { status: 200 });
    } catch (error) {
      return handleErrors(error);
    }
  }

export async function PUT(request, { params }) {
try {
    const id = parseInt(params.id);
    const data = await request.json();
    const updatedAmbiente = await prisma.ambientes.update({
    where: { id_ambiente: parseInt(params.id) },
    data: {
        nombre_amb: data.nombre_amb,
        municipio: data.municipio,
        sede: data. sede,
        estado: data.estado,
    },
    });
    return NextResponse.json({ message: "Ambiente Actualizado" }, { status: 200 });
} catch (error) {
    return handleErrors(error);
}
}