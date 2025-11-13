import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api-hospital-95ax.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUsuarios = () => apiClient.get("/usuarios/");
export const createUsuario = (data) => apiClient.post("/usuarios/", data);
export const updateUsuario = (id, data) => apiClient.put(`/usuarios/${id}`, data);
export const deleteUsuario = (id) => apiClient.delete(`/usuarios/${id}`);

export const getMedicos = () => apiClient.get("/medicos/");
export const createMedico = (data) => apiClient.post("/medicos/", data);
export const updateMedico = (id, data) => apiClient.put(`/medicos/${id}`, data);
export const deleteMedico = (id) => apiClient.delete(`/medicos/${id}`);

export const getHospitais = () => apiClient.get("/hospitais/");
export const createHospital = (data) => apiClient.post("/hospitais/", data);
export const updateHospital = (id, data) => apiClient.put(`/hospitais/${id}`, data);
export const deleteHospital = (id) => apiClient.delete(`/hospitais/${id}`);

export const getPlantoes = () => apiClient.get("/plantoes/");
export const createPlantao = (dados) => api.post("/plantoes", dados);
export const updatePlantao = (id, dados) => api.put(`/plantoes/${id}`, dados);
export const deletePlantao = (id) => api.delete(`/plantoes/${id}`);

export const getAceitaPlantoes = () => apiClient.get("/aceita_plantoes/");

export const getHistorico = () => apiClient.get("/historico/"); 

export const getHistoricoMedico = () => apiClient.get("/historico_medico/");