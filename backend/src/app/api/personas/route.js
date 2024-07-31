import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
  return new NextResponse(error.message, { status: 500 });
};

export async function GET() {
  try {
    const personas = await prisma.personas.findMany({
      include: {
        Vinculacion: true, // Relación con Vinculación
        Municipios: true, // Relación con Municipios
      },
    });
    return NextResponse.json({ datos: personas }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}

export async function POST(request) {
    try {
      const data = await request.json();
      const persona = await prisma.personas.create({
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
      return new NextResponse(JSON.stringify(persona), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      });
    } catch (error) {
      return handleErrors(error);
    }
  }