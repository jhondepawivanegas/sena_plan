import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
return new NextResponse(error.message, { status: 500 });
};

export async function GET(request, { params }) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id) || id <= 0) {
        return NextResponse.json({ error: 'ID de vinculación inválido' }, { status: 400 });
      }
  
      const vincular = await prisma.vinculacion.findUnique({
        where: { id_vinculacion: parseInt(params.id)},
        include: {

        },
      });
  
      if (!vincular) {
        return NextResponse.json({ error: 'Vinculación no encontrada' }, { status: 404 });
      }
  
      return NextResponse.json(vincular);
    } catch (error) {
      return handleErrors(error);
    }
  }

  export async function DELETE(request, { params }) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)){
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
      }
      const vincular = await prisma.vinculacion.delete({
        where: { id_vinculacion: parseInt(params.id) },
      })
      return NextResponse.json({ message: "Vinculación eliminada",vincular }, { status: 200 });
    } catch (error) {
      return handleErrors(error);
    }
  }

export async function PUT(request, { params }) {
try {
    const id = parseInt(params.id);
    const data = await request.json();
    const updatedVinculacion = await prisma.vinculacion.update({
    where: { id_vinculacion: parseInt(params.id) },
    data: {
        instructor: data.instructor,
        tipo: data.tipo,
        sede: data.sede,
        area: data.area,
    },
    });
    return NextResponse.json({ message: "Vinculación Actualizada" }, { status: 200 });
} catch (error) {
    return handleErrors(error);
}
}