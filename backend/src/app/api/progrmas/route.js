import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
return new NextResponse(error.message, { status: 500 });
};

export async function GET() {
try {
    const fichas = await prisma.fichas.findMany({
    include: {
        sede: true,
        estado: true,
        programa: {
        include: {
            nivel: true,
            estado: true,
        },
        },
    },
    });
    return NextResponse.json({ datos: fichas }, { status: 200 });
} catch (error) {
    return handleErrors(error);
}
}

export async function POST(request) {
try {
    const data = await request.json();
    const ficha = await prisma.fichas.create({
    data: {
        inicio_ficha: data.inicio_ficha,
        fin_lectiva: data.fin_lectiva,
        fin_ficha: data.fin_ficha,
        programa: { connect: { id_programa: data.programaId } },
        sede: { connect: { id_sede: data.sedeId } },
        estado: { connect: { id_estado: data.estadoId } },
    },
    });
    return new NextResponse(JSON.stringify(ficha), {
    headers: { "Content-Type": "application/json" },
    status: 201,
    });
} catch (error) {
    return handleErrors(error);
}
}