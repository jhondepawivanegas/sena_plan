import styled, { keyframes } from "styled-components";
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
    <MainContainer>
      <Header>
        <Title>Gestión de Fichas</Title>
      </Header>
      <Content>
        <Form>
          <FormGroup>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              type="text"
              name="nombre"
              value={newFicha.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              type="date"
              name="fecha"
              value={newFicha.fecha}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="estado">Estado</Label>
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
          <Loading>Cargando...</Loading>
        ) : (
          <TableContainer>
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
          </TableContainer>
        )}
      </Content>
    </MainContainer>
  );
}

// Estilos usando styled-components
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 40px;
  background-color: #ffffff;
  color: #333;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-family: 'Roboto Slab', serif;
  font-weight: 700;
  color: #4682b4; /* Color azul anterior */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  color: #333;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #555;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #ccc;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #6e8efb;
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #6e8efb; /* Color igual al de la tabla */
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
  align-self: center;
  margin-top: 20px;

  &:hover {
    background-color: #546dc5; /* Color más oscuro para el hover */
    transform: scale(1.05);
  }
`;

const TableContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  overflow-x: auto;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  color: #333;
  border-radius: 10px;

  thead {
    background-color: #6e8efb;
    color: #fff;
  }

  th, td {
    padding: 14px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  tbody tr:nth-of-type(even) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #efefef;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 1;
  }
`;

const ActionButton = styled.button`
  background-color: #6e8efb;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #546dc5;
  }
`;

const Loading = styled.div`
  font-size: 1.3rem;
  color: #333;
`;

const Message = styled.div`
  font-size: 1.1rem;
  color: ${(props) => (props.success ? 'green' : 'red')};
  margin: 15px 0;
  text-align: center;
`;
