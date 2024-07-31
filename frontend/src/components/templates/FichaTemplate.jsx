import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";

export function FichaTemplate() {
  const [fichasData, setFichasData] = useState([]);
  const [newFicha, setNewFicha] = useState({ nombre: '', fecha: '', estado: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/fichas");
        if (Array.isArray(res.data)) {
          setFichasData(res.data);
        } else {
          throw new Error("La respuesta no es un arreglo");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await axios.post("/fichas", newFicha);
      setFichasData([...fichasData, res.data]);
      setNewFicha({ nombre: '', fecha: '', estado: '' });
      setSuccess("Ficha creada con éxito.");
    } catch (error) {
      console.error(error);
      setError("Error al crear la ficha.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/fichas/${id}`);
      setFichasData(fichasData.filter((ficha) => ficha.id !== id));
      setSuccess("Ficha eliminada con éxito.");
    } catch (error) {
      console.error(error);
      setError("Error al eliminar la ficha.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFicha({ ...newFicha, [name]: value });
  };

  return (
    <Container>
      <Header>
        <Title>Gestión de Fichas</Title>
      </Header>
      <Form>
        <FormGroup>
          <Input
            type="text"
            name="nombre"
            value={newFicha.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          <Input
            type="date"
            name="fecha"
            value={newFicha.fecha}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="estado"
            value={newFicha.estado}
            onChange={handleChange}
            placeholder="Estado"
            required
          />
        </FormGroup>
        <Button onClick={handleCreate}>Crear Ficha</Button>
        {success && <Message success>{success}</Message>}
        {error && <Message>{error}</Message>}
      </Form>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fichasData.map((ficha) => (
              <tr key={ficha.id}>
                <td>{ficha.id}</td>
                <td>{ficha.nombre}</td>
                <td>{ficha.fecha}</td>
                <td>{ficha.estado}</td>
                <td>
                  <ActionButton onClick={() => handleDelete(ficha.id)}>Eliminar</ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

// Estilos usando styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 30px;
  background-color: ${(props) => props.theme.background};
  color: ${({ theme }) => theme.text};
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${(props) => props.theme.primary};
  font-weight: bold;
  text-align: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  background: ${(props) => props.theme.formBackground};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 15px;
`;

const Input = styled.input`
  margin: 5px 0;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 5px;
  width: calc(100% - 22px);
  box-sizing: border-box;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.text};
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.primaryDark};
    transform: scale(1.02);
  }
`;

const Table = styled.table`
  width: 100%;
  max-width: 1200px;
  border-collapse: collapse;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  thead {
    background-color: ${(props) => props.theme.headerBg};
    color: ${(props) => props.theme.headerText};
    font-weight: bold;
  }

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid ${(props) => props.theme.border};
  }

  tbody tr:nth-of-type(even) {
    background-color: ${(props) => props.theme.rowEven};
  }

  tbody tr:nth-of-type(odd) {
    background-color: ${(props) => props.theme.rowOdd};
  }

  tr:hover {
    background-color: ${(props) => props.theme.rowHover};
  }
`;

const ActionButton = styled.button`
  background-color: ${(props) => props.theme.actionBg};
  color: ${(props) => props.theme.text};
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.actionBgDark};
  }
`;

const Loading = styled.div`
  font-size: 1.2rem;
  color: ${(props) => props.theme.text};
`;

const Message = styled.div`
  font-size: 1rem;
  color: ${(props) => props.success ? 'green' : 'red'};
  margin: 10px 0;
  text-align: center;
`;
