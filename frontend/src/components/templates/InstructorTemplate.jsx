import styled from "styled-components";
import { useState, useEffect } from "react";

// Componente principal
export function InstructorTemplate() {
  const [fichas, setFichas] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [selectedFicha, setSelectedFicha] = useState(null);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [isEditingFicha, setIsEditingFicha] = useState(false);
  const [isEditingPersona, setIsEditingPersona] = useState(false);

  // Fetch datos iniciales
  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const response = await fetch("/api/fichas");
        const data = await response.json();
        setFichas(data);
      } catch (error) {
        console.error("Error al obtener fichas:", error);
      }
    };

    const fetchPersonas = async () => {
      try {
        const response = await fetch("/api/personas");
        const data = await response.json();
        setPersonas(data);
      } catch (error) {
        console.error("Error al obtener personas:", error);
      }
    };

    fetchFichas();
    fetchPersonas();
  }, []);

  // Manejar añadir ficha
  const handleAddFicha = () => {
    setSelectedFicha(null);
    setIsEditingFicha(true);
  };

  // Manejar editar ficha
  const handleEditFicha = (ficha) => {
    setSelectedFicha(ficha);
    setIsEditingFicha(true);
  };

  // Manejar eliminar ficha
  const handleDeleteFicha = async (fichaId) => {
    try {
      await fetch(`/api/fichas/${fichaId}`, { method: "DELETE" });
      setFichas(fichas.filter((ficha) => ficha.id !== fichaId));
    } catch (error) {
      console.error("Error al eliminar ficha:", error);
    }
  };

  // Manejar guardar ficha
  const handleSaveFicha = async (ficha) => {
    if (selectedFicha) {
      try {
        const response = await fetch(`/api/fichas/${ficha.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ficha),
        });
        const updatedFicha = await response.json();
        setFichas(
          fichas.map((f) => (f.id === updatedFicha.id ? updatedFicha : f))
        );
      } catch (error) {
        console.error("Error al actualizar ficha:", error);
      }
    } else {
      try {
        const response = await fetch("/api/fichas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ficha),
        });
        const newFicha = await response.json();
        setFichas([...fichas, newFicha]);
      } catch (error) {
        console.error("Error al crear ficha:", error);
      }
    }
    setIsEditingFicha(false);
  };

  // Manejar añadir persona
  const handleAddPersona = () => {
    setSelectedPersona(null);
    setIsEditingPersona(true);
  };

  // Manejar editar persona
  const handleEditPersona = (persona) => {
    setSelectedPersona(persona);
    setIsEditingPersona(true);
  };

  // Manejar eliminar persona
  const handleDeletePersona = async (personaId) => {
    try {
      await fetch(`/api/personas/${personaId}`, { method: "DELETE" });
      setPersonas(personas.filter((persona) => persona.id_persona !== personaId));
    } catch (error) {
      console.error("Error al eliminar persona:", error);
    }
  };

  // Manejar guardar persona
  const handleSavePersona = async (persona) => {
    if (selectedPersona) {
      try {
        const response = await fetch(`/api/personas/${persona.id_persona}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(persona),
        });
        const updatedPersona = await response.json();
        setPersonas(
          personas.map((p) =>
            p.id_persona === updatedPersona.id_persona ? updatedPersona : p
          )
        );
      } catch (error) {
        console.error("Error al actualizar persona:", error);
      }
    } else {
      try {
        const response = await fetch("/api/personas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(persona),
        });
        const newPersona = await response.json();
        setPersonas([...personas, newPersona]);
      } catch (error) {
        console.error("Error al crear persona:", error);
      }
    }
    setIsEditingPersona(false);
  };

  return (
    <Container>
      <Content>
        <Title>Vista de Instructores</Title>
        <ButtonGroup>
          <Button onClick={handleAddFicha}>Añadir Ficha</Button>
          <Button onClick={handleAddPersona}>Añadir Persona</Button>
        </ButtonGroup>

        <SectionTitle>Fichas</SectionTitle>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Nombre</TableHeader>
              <TableHeader>Acciones</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {fichas.map((ficha) => (
              <TableRow key={ficha.id}>
                <TableCell>{ficha.nombre}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <Button onClick={() => handleEditFicha(ficha)}>Editar</Button>
                    <Button danger onClick={() => handleDeleteFicha(ficha.id)}>
                      Eliminar
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <SectionTitle>Personas</SectionTitle>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Nombres</TableHeader>
              <TableHeader>Correo</TableHeader>
              <TableHeader>Teléfono</TableHeader>
              <TableHeader>Rol</TableHeader>
              <TableHeader>Cargo</TableHeader>
              <TableHeader>Municipio</TableHeader>
              <TableHeader>Acciones</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {personas.map((persona) => (
              <TableRow key={persona.id_persona}>
                <TableCell>{persona.nombres}</TableCell>
                <TableCell>{persona.correo}</TableCell>
                <TableCell>{persona.telefono}</TableCell>
                <TableCell>{persona.rol}</TableCell>
                <TableCell>{persona.cargo}</TableCell>
                <TableCell>{persona.municipio}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <Button onClick={() => handleEditPersona(persona)}>Editar</Button>
                    <Button danger onClick={() => handleDeletePersona(persona.id_persona)}>
                      Eliminar
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {isEditingFicha && (
          <FormContainer>
            <FichaForm
              ficha={selectedFicha}
              onSave={handleSaveFicha}
              onCancel={() => setIsEditingFicha(false)}
            />
          </FormContainer>
        )}

        {isEditingPersona && (
          <FormContainer>
            <PersonaForm
              persona={selectedPersona}
              onSave={handleSavePersona}
              onCancel={() => setIsEditingPersona(false)}
            />
          </FormContainer>
        )}
      </Content>
    </Container>
  );
}

// Componente para el formulario de ficha
function FichaForm({ ficha, onSave, onCancel }) {
  const [nombre, setNombre] = useState(ficha ? ficha.nombre : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...ficha, nombre });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Nombre:</Label>
        <Input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </FormGroup>
      <ButtonGroup>
        <Button type="submit">Guardar</Button>
        <Button type="button" onClick={onCancel} danger>
          Cancelar
        </Button>
      </ButtonGroup>
    </Form>
  );
}

// Componente para el formulario de persona
function PersonaForm({ persona, onSave, onCancel }) {
  const [nombres, setNombres] = useState(persona ? persona.nombres : "");
  const [correo, setCorreo] = useState(persona ? persona.correo : "");
  const [telefono, setTelefono] = useState(persona ? persona.telefono : "");
  const [rol, setRol] = useState(persona ? persona.rol : "");
  const [cargo, setCargo] = useState(persona ? persona.cargo : "");
  const [municipio, setMunicipio] = useState(persona ? persona.municipio : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...persona,
      nombres,
      correo,
      telefono,
      rol,
      cargo,
      municipio,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Nombres:</Label>
        <Input
          type="text"
          value={nombres}
          onChange={(e) => setNombres(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>Correo:</Label>
        <Input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>Teléfono:</Label>
        <Input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>Rol:</Label>
        <Input
          type="text"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>Cargo:</Label>
        <Input
          type="text"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>Municipio:</Label>
        <Input
          type="text"
          value={municipio}
          onChange={(e) => setMunicipio(e.target.value)}
        />
      </FormGroup>
      <ButtonGroup>
        <Button type="submit">Guardar</Button>
        <Button type="button" onClick={onCancel} danger>
          Cancelar
        </Button>
      </ButtonGroup>
    </Form>
  );
}

// Styled-components
const Container = styled.div`
  padding: 20px;
  background-color: #e6f0ff;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #4682b4;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #4169e1;
  margin-bottom: 15px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #4682b4;
  color: #fff;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
`;

const TableBody = styled.tbody``;

const TableCell = styled.td`
  padding: 10px;
  text-align: left;
`;

const FormContainer = styled.div`
  margin-top: 20px;
`;

const Form = styled.form`
  background-color: #f0f8ff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #4682b4;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #b0c4de;
  border-radius: 5px;
`;

const ButtonGroup = styled.div`
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: ${(props) =>
    props.danger ? "#ff4d4d" : "#4169e1"};
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;

  &:hover {
    background-color: ${(props) =>
      props.danger ? "#e60000" : "#3742fa"};
  }
`;

export default InstructorTemplate;
