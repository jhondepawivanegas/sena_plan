import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import axiosCliente from "../axioCliente.js";

export function FichaTemplate() {
  const [fichasData, setFichasData] = useState([]);
  const [newFicha, setNewFicha] = useState({
    codigo: "",
    inicio_fecha: "",
    fin_lectiva: "",
    fin_ficha: "",
    programa: 0,
    sede: "",
    estado: "",
  });
  const [selectedFicha, setSelectedFicha] = useState(null); // Estado para la ficha seleccionada
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [programas, setProgramas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const estados = ["lectiva", "electiva", "finalizada"]; // Opciones de estado

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosCliente.get("/fichas");
        console.log(res.data); // Muestra la estructura de la respuesta en consola
        if (Array.isArray(res.data.datos)) {
          setFichasData(res.data.datos); // Accede al array 'datos'
        } else {
          throw new Error("La respuesta no contiene un arreglo de datos");
        }
      } catch (error) {
        setError("Error al cargar las fichas.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Carga los datos para los selects de programa y sede
    const fetchSelectData = async () => {
      try {
        const programasRes = await axiosCliente.get("/programas");
        const sedesRes = await axiosCliente.get("/sedes");
        setProgramas(programasRes.data);
        setSedes(sedesRes.data);
      } catch (error) {
        console.error("Error al cargar los datos para selects:", error);
      }
    };

    fetchSelectData();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !newFicha.codigo ||
      !newFicha.inicio_fecha ||
      !newFicha.fin_lectiva ||
      !newFicha.fin_ficha ||
      !newFicha.programa ||
      !newFicha.sede ||
      !newFicha.estado
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      if (selectedFicha) {
        // Si hay una ficha seleccionada, actualiza
        const res = await axiosCliente.put(
          `/fichas/${selectedFicha.codigo}`,
          newFicha
        );
        setFichasData(
          fichasData.map((ficha) =>
            ficha.codigo === selectedFicha.codigo ? res.data : ficha
          )
        );
        setSuccess("Ficha actualizada con éxito.");
      } else {
        // Si no hay ficha seleccionada, crea una nueva
        const res = await axiosCliente.post("/fichas", newFicha);
        setFichasData([...fichasData, res.data]);
        setSuccess("Ficha creada con éxito.");
      }
      setNewFicha({
        codigo: "",
        inicio_fecha: "",
        fin_lectiva: "",
        fin_ficha: "",
        programa: 0,
        sede: "",
        estado: "",
      });
      setSelectedFicha(null); // Restablecer la ficha seleccionada
    } catch (error) {
      console.error(error);
      setError("Error al guardar la ficha.");
    }
  };

  const handleDelete = async (codigo) => {
    setError(null);
    setSuccess(null);

    try {
      await axiosCliente.delete(`/fichas/${codigo}`);
      setFichasData(fichasData.filter((ficha) => ficha.codigo !== codigo));
      setSuccess("Ficha eliminada con éxito.");
    } catch (error) {
      console.error(error);
      setError("Error al eliminar la ficha.");
    }
  };

  const handleEdit = (ficha) => {
    setNewFicha({
      codigo: ficha.codigo,
      inicio_fecha: ficha.inicio_fecha.slice(0, 10), // Formato de fecha correcto para el input
      fin_lectiva: ficha.fin_lectiva.slice(0, 10),
      fin_ficha: ficha.fin_ficha.slice(0, 10),
      programa: ficha.Programas.id_programa, // Asegúrate de usar el ID del programa
      sede: ficha.sede.id,
      estado: ficha.estado,
    });
    setSelectedFicha(ficha);
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
        <Form onSubmit={handleCreateOrUpdate}>
          <FormGroup>
            <Label htmlFor="codigo">Código</Label>
            <Input
              type="number"
              name="codigo"
              value={newFicha.codigo}
              onChange={handleChange}
              placeholder="Código"
              required
              disabled={selectedFicha !== null} // Desactivar durante la edición
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="inicio_fecha">Fecha de Inicio</Label>
            <Input
              type="date"
              name="inicio_fecha"
              value={newFicha.inicio_fecha}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="fin_lectiva">Fin Lectiva</Label>
            <Input
              type="date"
              name="fin_lectiva"
              value={newFicha.fin_lectiva}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="fin_ficha">Fin Ficha</Label>
            <Input
              type="date"
              name="fin_ficha"
              value={newFicha.fin_ficha}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="programa">Programa</Label>
            <Select
              name="programa"
              value={newFicha.programa}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un programa</option>
              {programas.map((programa) => (
                <option key={programa.id_programa} value={programa.id_programa}>
                  {programa.nombre}
                </option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="sede">Sede</Label>
            <Select
              name="sede"
              value={newFicha.sede}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una sede</option>
              {sedes.map((sede) => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre}
                </option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="estado">Estado</Label>
            <Select
              name="estado"
              value={newFicha.estado}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un estado</option>
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </Select>
          </FormGroup>
          <Button type="submit">
            {selectedFicha ? "Actualizar Ficha" : "Crear Ficha"}
          </Button>
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
                  <th>Código</th>
                  <th>Inicio Fecha</th>
                  <th>Fin Lectiva</th>
                  <th>Fin Ficha</th>
                  <th>Programa</th>
                  <th>Sede</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {fichasData.map((ficha) => (
                  <tr key={ficha.codigo}>
                    <td>{ficha.codigo}</td>
                    <td>{new Date(ficha.inicio_fecha).toLocaleDateString()}</td>
                    <td>{new Date(ficha.fin_lectiva).toLocaleDateString()}</td>
                    <td>{new Date(ficha.fin_ficha).toLocaleDateString()}</td>
                    <td>{ficha.Programas.nombre_programa}</td>
                    <td>{ficha.sede}</td>
                    <td>{ficha.estado}</td>
                    <td>
                      <ActionButton onClick={() => handleEdit(ficha)}>
                        Editar
                      </ActionButton>
                      <ActionButton onClick={() => handleDelete(ficha.codigo)}>
                        Eliminar
                      </ActionButton>
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
  background-color: #f5f5f5;
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
  font-family: "Roboto Slab", serif;
  font-weight: 700;
  color: #333;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  border: 2px solid #ddd;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4682b4;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4682b4;
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #4682b4;
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
    background-color: #3a69a1;
    transform: scale(1.05);
  }
`;

const TableContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  overflow-x: auto;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #fff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  color: #333;
  border-radius: 10px;

  thead {
    background-color: #4682b4;
    color: #fff;
  }

  th,
  td {
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
  background-color: #d9534f;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
  margin: 0 5px;

  &:hover {
    background-color: #c9302c;
  }
`;

const Loading = styled.div`
  font-size: 1.3rem;
  color: #333;
`;

const Message = styled.div`
  font-size: 1.1rem;
  color: ${(props) => (props.success ? "green" : "red")};
  margin: 15px 0;
  text-align: center;
`;
