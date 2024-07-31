import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const instructors = await prisma.personas.findMany({
        where: {
          rol: 'Instructor',
        },
      });
      res.status(200).json(instructors);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener instructores' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
