import styled from "styled-components";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

// Datos iniciales
const initialInstructors = [
  { id: 1, name: "Wilson Martinez" },
  { id: 2, name: "Jose Ordoney" },
];

const initialRooms = [
  { id: 1, name: "TIC Y12", occupied: false },
  { id: 2, name: "TIC Y13", occupied: false },
  { id: 3, name: "TIC Y14", occupied: false },
  { id: 4, name: "TIC Y15", occupied: false },
];

const initialBlocks = [
  { name: "Mañana", start: "07:00", end: "12:00" },
  { name: "Tarde", start: "12:0", end: "17:00" },
  { name: "Noche", start: "18:00", end: "22:00" },
  { name: "Jornada Completa", start: "18:00", end: "22:00" },

];

const daysOfWeek = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

// Función para convertir la hora local a la hora de Colombia
const convertToColombianTime = (time) => {
  const localDate = new Date(`1970-01-01T${time}:00`);
  const colombianOffset = -5 * 60; // Offset de Colombia en minutos
  const localOffset = localDate.getTimezoneOffset();
  const colombianDate = new Date(localDate.getTime() + (colombianOffset - localOffset) * 60000);
  return colombianDate.toTimeString().substring(0, 5);
};

export function HorariosTemplate() {
  const [instructors, setInstructors] = useState(initialInstructors);
  const [rooms, setRooms] = useState(initialRooms);
  const [blocks, setBlocks] = useState(initialBlocks);
  const [schedule, setSchedule] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedBlock) {
      const block = blocks.find(b => b.name === selectedBlock);
      if (block) {
        setStartTime(block.start);
        setEndTime(block.end);
      }
    }
  }, [selectedBlock]);

  const handleAddSchedule = () => {
    if (!selectedInstructor || !selectedRoom || !selectedBlock || !startTime || !endTime || !selectedDay) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    const block = blocks.find(b => b.name === selectedBlock);
    if (!block) {
      setError("Bloque seleccionado no encontrado.");
      return;
    }

    if (startTime < block.start || endTime > block.end) {
      setError(`El horario debe estar dentro del rango del bloque ${selectedBlock} (${block.start} - ${block.end}).`);
      return;
    }

    if (editIndex !== null) {
      const updatedSchedule = schedule.map((item, index) =>
        index === editIndex
          ? { instructor: selectedInstructor, room: selectedRoom, block: selectedBlock, day: selectedDay, startTime, endTime }
          : item
      );
      setSchedule(updatedSchedule);
      setRooms(rooms.map(room =>
        room.name === selectedRoom
          ? { ...room, occupied: true }
          : room
      ));
      setEditIndex(null);
      setError('');
    } else {
      const conflict = schedule.some(
        (item) =>
          item.instructor === selectedInstructor &&
          item.room === selectedRoom &&
          item.block === selectedBlock &&
          item.day === selectedDay &&
          (
            (startTime >= item.startTime && startTime < item.endTime) ||
            (endTime > item.startTime && endTime <= item.endTime)
          )
      );

      if (conflict) {
        setError("El instructor ya está asignado a una sala en este bloque y horario.");
        return;
      }

      const blockConflict = schedule.some(
        (item) =>
          item.room === selectedRoom &&
          item.block === selectedBlock &&
          item.day === selectedDay &&
          (
            (startTime >= item.startTime && startTime < item.endTime) ||
            (endTime > item.startTime && endTime <= item.endTime)
          )
      );

      if (blockConflict) {
        setError("Este bloque ya está asignado a otra sala en el horario seleccionado.");
        return;
      }

      setSchedule([
        ...schedule,
        {
          instructor: selectedInstructor,
          room: selectedRoom,
          block: selectedBlock,
          day: selectedDay,
          startTime,
          endTime,
        },
      ]);

      setRooms(rooms.map(room =>
        room.name === selectedRoom ? { ...room, occupied: true } : room
      ));

      setError('');
    }
  };

  const handleVacateRoomEarly = (roomName) => {
    const roomSchedules = schedule.filter(item => item.room === roomName);
    const earliestSchedule = roomSchedules.reduce((earliest, current) =>
      !earliest || new Date(current.startTime) < new Date(earliest.startTime)
        ? current
        : earliest
    , null);

    if (earliestSchedule) {
      setRooms(rooms.map(room =>
        room.name === roomName ? { ...room, occupied: false } : room
      ));
      setSchedule(schedule.filter(item => item !== earliestSchedule));
    }
  };

  const handleRemoveSchedule = (index) => {
    const item = schedule[index];
    setRooms(rooms.map(room =>
      room.name === item.room ? { ...room, occupied: false } : room
    ));
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleEditSchedule = (index) => {
    setSelectedInstructor(schedule[index].instructor);
    setSelectedRoom(schedule[index].room);
    setSelectedBlock(schedule[index].block);
    setSelectedDay(schedule[index].day);
    setStartTime(schedule[index].startTime);
    setEndTime(schedule[index].endTime);
    setEditIndex(index);
  };

  return (
    <Container>
      <Title>Administración de Horarios</Title>
      <Form>
        <Select onChange={(e) => setSelectedInstructor(e.target.value)} value={selectedInstructor}>
          <option value="">Seleccionar Instructor</option>
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.name}>
              {instructor.name}
            </option>
          ))}
        </Select>
        <Select onChange={(e) => setSelectedRoom(e.target.value)} value={selectedRoom}>
          <option value="">Seleccionar Ambiente</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.name} disabled={room.occupied}>
              {room.name} {room.occupied ? "(Ocupado)" : ""}
            </option>
          ))}
        </Select>
        <Select onChange={(e) => setSelectedBlock(e.target.value)} value={selectedBlock}>
          <option value="">Seleccionar Bloque</option>
          {blocks.map((block, index) => (
            <option key={index} value={block.name}>
              {block.name} ({block.start} - {block.end})
            </option>
          ))}
        </Select>
        <Select onChange={(e) => setSelectedDay(e.target.value)} value={selectedDay}>
          <option value="">Seleccionar Día</option>
          {daysOfWeek.map((day, index) => (
            <option key={index} value={day}>
              {day}
            </option>
          ))}
        </Select>
        <Input
          type="time"
          onChange={(e) => setStartTime(e.target.value)}
          value={startTime}
          placeholder="Hora de inicio"
        />
        <Input
          type="time"
          onChange={(e) => setEndTime(e.target.value)}
          value={endTime}
          placeholder="Hora de fin"
        />
        <Button onClick={handleAddSchedule}>
          {editIndex !== null ? "Actualizar Horario" : "Añadir Horario"}
        </Button>
        {error && <Error>{error}</Error>}
      </Form>
      <ScheduleTable>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Instructor</TableHeaderCell>
            <TableHeaderCell>Ambiente</TableHeaderCell>
            <TableHeaderCell>Bloque</TableHeaderCell>
            <TableHeaderCell>Día</TableHeaderCell>
            <TableHeaderCell>Hora de Inicio</TableHeaderCell>
            <TableHeaderCell>Hora de Fin</TableHeaderCell>
            <TableHeaderCell>Acciones</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedule.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.instructor}</TableCell>
              <TableCell>{item.room}</TableCell>
              <TableCell>{item.block}</TableCell>
              <TableCell>{item.day}</TableCell>
              <TableCell>{convertToColombianTime(item.startTime)}</TableCell>
              <TableCell>{convertToColombianTime(item.endTime)}</TableCell>
              <TableCell>
                <ButtonContainer>
                  <ActionButton onClick={() => handleRemoveSchedule(index)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </ActionButton>
                  <VacateButton onClick={() => handleVacateRoomEarly(item.room)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </VacateButton>
                  <UpdateButton onClick={() => handleEditSchedule(index)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </UpdateButton>
                </ButtonContainer>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </ScheduleTable>
    </Container>
  );
}

// Estilos usando styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  width: 100%;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.primary};
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  background: ${({ theme }) => theme.formBg};
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  color: #333;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  color: #333;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Button = styled.button`
  padding: 12px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: ${({ theme }) => theme.primary};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const ScheduleTable = styled.table`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  border-collapse: collapse;
  background: ${({ theme }) => theme.listBg};
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.primary};
  color: #fff;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TableHeaderCell = styled.th`
  padding: 15px;
  text-align: left;
`;

const TableBody = styled.tbody``;

const TableCell = styled.td`
  padding: 15px;
  text-align: left;
`;

const ActionButton = styled.button`
  padding: 10px;
  font-size: 1.2rem;
  color: #fff;
  background-color: #e74c3c; /* Rojo */
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px;

  &:hover {
    background-color: #c0392b; /* Rojo oscuro */
  }
`;

const VacateButton = styled.button`
  padding: 10px;
  font-size: 1.2rem;
  color: #fff;
  background-color: #3498db; /* Azul */
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px;

  &:hover {
    background-color: #2980b9; /* Azul oscuro */
  }
`;

const UpdateButton = styled.button`
  padding: 10px;
  font-size: 1.2rem;
  color: #fff;
  background-color: ${({ theme }) => theme.primary};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const Error = styled.div`
  color: ${({ theme }) => theme.error};
  margin-top: 10px;
  font-size: 0.875rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px; /* Espacio entre botones */
  margin-top: 10px; /* Espacio superior */
`;