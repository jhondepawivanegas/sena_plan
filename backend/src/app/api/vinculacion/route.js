import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
return new NextResponse(error.message, { status: 500 });
};

export async function GET() {
try {
    const vinculacion = await prisma.vinculacion.findMany({
    include: {

    },
    });
    return NextResponse.json({ datos: vinculacion }, { status: 200 });
} catch (error) {
    return handleErrors(error);
}
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Data:', data); // Verificar los datos que estás enviando

    const existingVinculacion = await prisma.vinculacion.findUnique({
      where: {
        instructor: data.instructor,
      },
    });
    if (existingVinculacion) {
      console.log('Vinculación ya existe:', existingVinculacion);
      return new NextResponse(JSON.stringify({ message: "Vinculación ya existe" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const vincular = await prisma.vinculacion.create({
      data: {
        instructor: data.instructor,
        tipo: data.tipo,
        sede: data.sede,
        area: data.area,
      },
    });
    console.log('Vinculación creada:', vincular); // Verificar la respuesta de Prisma

    return new NextResponse(JSON.stringify(vincular), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    console.error('Error:', error); // Verificar el error
    return handleErrors(error);
  }
}