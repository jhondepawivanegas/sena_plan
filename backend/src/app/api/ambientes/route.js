import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
  return new NextResponse(error.message, { status: 500 });
};

export async function GET() {
  try {
    const ambientes = await prisma.ambientes.findMany({
      include: {
        Municipio: {
          select: {
            nombre_mpio: true,
          },
        },
      },
    });
    return NextResponse.json({ datos: ambientes }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const ambiente = await prisma.ambientes.create({
      data: {
        nombre_amb: data.nombre_amb,
        municipio: data.municipio,
        sede: data.sede,
      },
    });
    return new NextResponse(JSON.stringify(ambiente), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    return handleErrors(error);
  }
}
