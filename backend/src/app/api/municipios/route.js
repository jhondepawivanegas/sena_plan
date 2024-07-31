import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
return new NextResponse(error.message, { status: 500 });
};

export async function GET() {
try {
    const municipios = await prisma.municipios.findMany({
    include: {

    },
    });
    return NextResponse.json({ datos: municipios }, { status: 200 });
} catch (error) {
    return handleErrors(error);
}
}

export async function POST(request) {
    try {
      const data = await request.json();
      const municipio = await prisma.municipios.create({
        data: {
          nombre_mpio: data.nombre_mpio,
          departamento: data.departamento,
        },
      });
      return new NextResponse(JSON.stringify(municipio), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      });
    } catch (error) {
      return handleErrors(error);
    }
  }