import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
return new NextResponse(error.message, { status: 500 });
};

export async function GET() {
try {
    const areas = await prisma.areas.findMany({
    include: {

    },
    });
    return NextResponse.json({ datos: areas }, { status: 200 });
} catch (error) {
    return handleErrors(error);
}
}

export async function POST(request) {
    try {
      const data = await request.json();
      const area = await prisma.areas.create({
        data: {
          nombre_area: data.nombre_amb,
        },
      });
      return new NextResponse(JSON.stringify(area), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      });
    } catch (error) {
      return handleErrors(error);
    }
  }