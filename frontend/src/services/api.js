import axios from 'axios';

const axioCliente = axios.create({
baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export default axioCliente;
app.use(cors({
  origin: 'http://localhost:5173', // Reemplaza con la URL de tu frontend
  methods: 'GET,POST,PUT,DELETE',
}));
