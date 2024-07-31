// pages/api/roles/coordinacion/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
  return new NextResponse(error.message, { status: 500 });
};

export async function GET() {
  try {
    const coordinaciones = await prisma.coordinaciones.findMany({
      include: {
        // Add relationships here
        // For example:
        Usuario: true,
        Programa: true,
      },
    });
    return NextResponse.json({ datos: coordinaciones }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const coordinacion = await prisma.coordinaciones.create({
      data: {
        // Add fields here
        // For example:
        usuarioId: data.usuarioId,
        programaId: data.programaId,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
      },
    });
    return new NextResponse(JSON.stringify(coordinacion), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    return handleErrors(error);
  }
}