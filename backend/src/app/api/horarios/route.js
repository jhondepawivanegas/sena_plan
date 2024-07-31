import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const horarios = await prisma.horarios.findMany({
        include: {
          Fichas: true,
          Ambientes: true,
          Vinculacion: true,
        },
      });
      res.status(200).json(horarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener horarios' });
    }
  } else if (req.method === 'POST') {
    const { fecha_inicio, hora_inicio, fecha_fin, hora_fin, dia, cantidad_horas, instructor, ficha, ambiente } = req.body;
    
    // Verificar si el instructor ya está asignado a la misma ficha en el mismo bloque
    const existingSchedule = await prisma.horarios.findFirst({
      where: {
        ficha: ficha,
        dia: dia,
        hora_inicio: hora_inicio,
        instructor: instructor,
      },
    });

    if (existingSchedule) {
      return res.status(400).json({ error: 'El instructor ya está asignado a la misma ficha en el mismo bloque.' });
    }

    try {
      const newHorario = await prisma.horarios.create({
        data: {
          fecha_inicio,
          hora_inicio,
          fecha_fin,
          hora_fin,
          dia,
          cantidad_horas,
          instructor,
          ficha,
          ambiente,
        },
      });
      res.status(201).json(newHorario);
    } catch (error) {
      res.status(500).json({ error: 'Error al añadir horario' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
