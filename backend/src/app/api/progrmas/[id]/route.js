import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
return new NextResponse(error.message, { status: 500 });
};

const handleNotFound = () => {
return new NextResponse("Ficha not found", { status: 404 });
};

export async function GET(request, { params }) {
try {
    const codigo = parseInt(params.codigo);
    const ficha = await prisma.fichas.findFirst({
    where: { codigo },
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
    if (!ficha) {
    return handleNotFound();
    }
    return NextResponse.json(ficha);
} catch (error) {
    return handleErrors(error);
}
}

export async function DELETE(request, { params }) {
try {
    const codigo = parseInt(params.codigo);
    await prisma.fichas.delete({ where: { codigo } });
    return NextResponse.json({ message: "Ficha deleted successfully" }, { status: 200 });
} catch (error) {
    return handleErrors(error);
}
}

export async function PUT(request, { params }) {
try {
    const codigo = parseInt(params.codigo);
    const data = await request.json();
    const updatedFicha = await prisma.fichas.update({
    where: { codigo },
    data: {
        inicio_ficha: data.inicio_ficha,
        fin_lectiva: data.fin_lectiva,
        fin_ficha: data.fin_ficha,
        programa: { connect: { id_programa: data.programaId } },
        sede: { connect: { id_sede: data.sedeId } },
        estado: { connect: { id_estado: data.estadoId } },
    },
    });
    return NextResponse.json({ message: "Ficha updated successfully" }, { status: 200 });
} catch (error) {
    return handleErrors(error);
}
}