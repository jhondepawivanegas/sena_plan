import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
  return new NextResponse(error.message, { status: 500 });
};

export async function GET() {
  try {
    const horarios = await prisma.horarios.findMany({
      include: {
        Fichas: true, // Relación con Fichas
        Ambientes: true, // Relación con Ambientes
      },
    });
    return NextResponse.json({ datos: horarios }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const horario = await prisma.horarios.create({
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
    return new NextResponse(JSON.stringify(horario), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    return handleErrors(error);
  }
}