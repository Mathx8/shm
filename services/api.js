import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api-hospital-95ax.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUsuarios = () => apiClient.get("/usuarios/");

export const getMedicos = () => apiClient.get("/medicos/");

export const getHospitais = () => apiClient.get("/hospitais/");

export const getPlantoes = () => apiClient.get("/plantoes/");

export const getAceitaPlantoes = () => apiClient.get("/aceita_plantoes/");

export const getHistorico = () => apiClient.get("/historico/"); 

export const getHistoricoMedico = () => apiClient.get("/historico_medico/");