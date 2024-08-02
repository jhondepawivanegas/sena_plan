import React, { useState, useEffect } from "react";
import axiosCliente from "../axioCliente.js";
import styled from "styled-components";
import Modal from "react-modal";

const SEDE_OPTIONS = [
  { value: "centro", label: "Centro" },
  { value: "Yamboro", label: "Yamboró" },
];

// Estilos
const Container = styled.div`
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background: #f0f8ff; /* Azul claro */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #4682b4; /* Azul claro */
  text-align: center;
  font-family: "Arial", sans-serif;
`;

const AmbienteForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const AmbienteInput = styled.input`
  flex: 1;
  padding: 12px;
  font-size: 1em;
  border: 1px solid #b0c4de; /* Azul claro */
  border-radius: 8px;
  outline: none;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  background: #fff;
  color: #333;

  &:focus {
    border-color: #4682b4; /* Azul claro */
    box-shadow: 0 0 0 2px rgba(70, 130, 180, 0.25); /* Azul claro */
  }
`;

const AmbienteSelect = styled.select`
  flex: 1;
  padding: 12px;
  font-size: 1em;
  border: 1px solid #b0c4de; /* Azul claro */
  border-radius: 8px;
  outline: none;
  background: #fff;
  color: #333;

  &:focus {
    border-color: #4682b4; /* Azul claro */
    box-shadow: 0 0 0 2px rgba(70, 130, 180, 0.25); /* Azul claro */
  }
`;

const AmbienteButton = styled.button`
  padding: 12px 24px;
  font-size: 1em;
  color: #fff;
  background-color: ${(props) =>
    props.delete
      ? "#ff4d4d"
      : "#4682b4"}; /* Rojo para eliminar, azul para otros */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${(props) =>
      props.delete
        ? "#e60000"
        : "#4169e1"}; /* Rojo oscuro para eliminar, azul oscuro para otros */
  }

  &:active {
    background-color: ${(props) =>
      props.delete
        ? "#cc0000"
        : "#3742fa"}; /* Rojo más oscuro para eliminar, azul más oscuro para otros */
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  padding: 12px;
  background: #4682b4; /* Azul claro */
  color: #fff;
  text-align: left;
  border-bottom: 2px solid #4169e1; /* Azul más oscuro */
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #b0c4de; /* Azul claro */
  color: #333;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #e6f0ff; /* Azul claro muy suave */
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ToggleSwitch = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

const ToggleInput = styled.input`
  display: none;
`;

const ToggleSlider = styled.span`
  position: relative;
  width: 60px;
  height: 34px;
  background-color: ${(props) =>
    props.checked
      ? "#4caf50"
      : "#ff0000"}; /* Verde para activo, gris para inactivo */
  border-radius: 34px;
  transition: background-color 0.4s;
  &::before {
    content: "";
    position: absolute;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: white;
    transition: transform 0.4s;
    transform: ${(props) =>
      props.checked ? "translateX(26px)" : "translateX(0)"};
    top: 4px;
    left: 4px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 2em;
  margin-bottom: 20px;
  color: #4682b4; /* Azul claro */
  font-family: "Arial", sans-serif;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

// Configuración de Modal
Modal.setAppElement("#root");

export function AmbienteTemplate() {
  const [ambientes, setAmbientes] = useState([]);
  const [newAmbiente, setNewAmbiente] = useState({
    nombre_amb: "",
    municipio: "",
    sede: "",
    estado: "activo",
  });
  const [token] = useState(""); // Asegúrate de que este valor esté proporcionado correctamente
  const [municipios, setMunicipios] = useState([]);
  const [selectedAmbientes, setSelectedAmbientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAmbiente, setCurrentAmbiente] = useState(null);
  const [updateAmbiente, setUpdateAmbiente] = useState({
    nombre_amb: "",
    municipio: "",
    sede: "",
    estado: "activo",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener ambientes
        // const ambientesResponse = await axiosCliente.get(
        //   "http://localhost:3000/api/ambientes",
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );
        // setAmbientes(ambientesResponse.data.datos);
        listarAmbientes();

        // Obtener municipios
        const municipiosResponse = await axiosCliente.get(
          "http://localhost:3000/api/municipios",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMunicipios(municipiosResponse.data.datos);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, [token]);

  // Funncion listar ambientes para reutilizar
  const listarAmbientes = async () => {
    const ambientesResponse = await axiosCliente.get(
      "http://localhost:3000/api/ambientes",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAmbientes(ambientesResponse.data.datos);
  };

  const handleCreateAmbiente = async (event) => {
    event.preventDefault();
    if (newAmbiente.nombre_amb.trim() === "") {
      return;
    }
    try {
      console.log(newAmbiente);
      const response = await axiosCliente.post(
        "http://localhost:3000/api/ambientes",
        newAmbiente,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Llama la peticion de listar ambientes nuevamente
      listarAmbientes();

      // setAmbientes([...ambientes, response.data.datos]);
      // setNewAmbiente({
      //   nombre_amb: "",
      //   municipio: "",
      //   sede: "",
      //   estado: "activo",
      // });
    } catch (error) {
      console.error("Error al crear ambiente:", error);
    }
  };

  const handleUpdateAmbiente = async () => {
    if (updateAmbiente.nombre_amb.trim() === "") {
      return;
    }
    try {
      const response = await axiosCliente.put(
        `http://localhost:3000/api/ambientes/${currentAmbiente.id_ambiente}`,
        updateAmbiente,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAmbientes(
        ambientes.map((ambiente) =>
          ambiente.id_ambiente === currentAmbiente.id_ambiente
            ? response.data.datos
            : ambiente
        )
      );
      setIsModalOpen(false);
      setCurrentAmbiente(null);
      setUpdateAmbiente({
        nombre_amb: "",
        municipio: "",
        sede: "",
        estado: "activo",
      });
    } catch (error) {
      console.error("Error al actualizar ambiente:", error);
    }
  };

  const handleDeleteAmbiente = async (id) => {
    try {
      await axiosCliente.delete(`http://localhost:3000/api/ambientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAmbientes(ambientes.filter((ambiente) => ambiente.id_ambiente !== id));
    } catch (error) {
      console.error("Error al eliminar ambiente:", error);
    }
  };

  const handleToggleChange = (id, currentState) => {
    const newState = currentState === "activo" ? "inactivo" : "activo";
    setAmbientes(
      ambientes.map((ambiente) =>
        ambiente.id_ambiente === id
          ? { ...ambiente, estado: newState }
          : ambiente
      )
    );
    axiosCliente.put(
      `http://localhost:3000/api/ambientes/${id}`,
      { estado: newState },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const handleEditClick = (ambiente) => {
    setCurrentAmbiente(ambiente);
    setUpdateAmbiente({
      nombre_amb: ambiente.nombre_amb,
      municipio: ambiente.municipio,
      sede: ambiente.sede,
      estado: ambiente.estado,
    });
    setIsModalOpen(true);
  };

  return (
    <Container>
      <Title>Gestión de Ambientes</Title>
      <AmbienteForm onSubmit={handleCreateAmbiente}>
        <AmbienteInput
          type="text"
          value={newAmbiente.nombre_amb}
          onChange={(e) =>
            setNewAmbiente({ ...newAmbiente, nombre_amb: e.target.value })
          }
          placeholder="Nombre del Ambiente"
        />
        <AmbienteSelect
          value={newAmbiente.municipio}
          onChange={(e) =>
            setNewAmbiente({ ...newAmbiente, municipio: e.target.value })
          }
        >
          <option value="">Seleccionar Municipio</option>
          {municipios.map((municipio) => (
            <option key={municipio.id_municipio} value={municipio.id_municipio}>
              {municipio.nombre_mpio}
            </option>
          ))}
        </AmbienteSelect>
        <AmbienteSelect
          value={newAmbiente.sede}
          onChange={(e) =>
            setNewAmbiente({ ...newAmbiente, sede: e.target.value })
          }
        >
          <option value="">Seleccionar Sede</option>
          {SEDE_OPTIONS.map((sede) => (
            <option key={sede.value} value={sede.value}>
              {sede.label}
            </option>
          ))}
        </AmbienteSelect>
        <AmbienteButton type="submit">Agregar Ambiente</AmbienteButton>
      </AmbienteForm>

      <Table>
        <thead>
          <tr>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Municipio</TableHeader>
            <TableHeader>Sede</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </tr>
        </thead>
        <tbody>
          {ambientes.map((ambiente) => (
            <TableRow key={ambiente.id_ambiente}>
              <TableCell>{ambiente.nombre_amb}</TableCell>
              <TableCell>{ambiente.Municipio.nombre_mpio}</TableCell>
              <TableCell>
                {SEDE_OPTIONS.find((s) => s.value === ambiente.sede)?.label}
              </TableCell>
              <TableCell>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={ambiente.estado === "activo"}
                    onChange={() =>
                      handleToggleChange(ambiente.id_ambiente, ambiente.estado)
                    }
                  />
                  <ToggleSlider checked={ambiente.estado === "activo"} />
                </ToggleSwitch>
              </TableCell>
              <TableCell>
                <ButtonGroup>
                  <AmbienteButton onClick={() => handleEditClick(ambiente)}>
                    Editar
                  </AmbienteButton>
                  <AmbienteButton
                    delete
                    onClick={() => handleDeleteAmbiente(ambiente.id_ambiente)}
                  >
                    Eliminar
                  </AmbienteButton>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Editar Ambiente"
      >
        <ModalTitle>Editar Ambiente</ModalTitle>
        <ModalForm>
          <AmbienteInput
            type="text"
            value={updateAmbiente.nombre_amb}
            onChange={(e) =>
              setUpdateAmbiente({
                ...updateAmbiente,
                nombre_amb: e.target.value,
              })
            }
            placeholder="Nombre del Ambiente"
          />
          <AmbienteSelect
            value={updateAmbiente.municipio}
            onChange={(e) =>
              setUpdateAmbiente({
                ...updateAmbiente,
                municipio: e.target.value,
              })
            }
          >
            <option value="">Seleccionar Municipio</option>
            {municipios.map((municipio) => (
              <option
                key={municipio.id_municipio}
                value={municipio.id_municipio}
              >
                {municipio.nombre_mpio}
              </option>
            ))}
          </AmbienteSelect>
          <AmbienteSelect
            value={updateAmbiente.sede}
            onChange={(e) =>
              setUpdateAmbiente({ ...updateAmbiente, sede: e.target.value })
            }
          >
            <option value="">Seleccionar Sede</option>
            {SEDE_OPTIONS.map((sede) => (
              <option key={sede.value} value={sede.value}>
                {sede.label}
              </option>
            ))}
          </AmbienteSelect>
          <ModalButtonGroup>
            <AmbienteButton type="button" onClick={handleUpdateAmbiente}>
              Actualizar
            </AmbienteButton>
            <AmbienteButton delete onClick={() => setIsModalOpen(false)}>
              Cancelar
            </AmbienteButton>
          </ModalButtonGroup>
        </ModalForm>
      </Modal>
    </Container>
  );
}
