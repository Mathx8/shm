import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api-hospital-95ax.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const authData = JSON.parse(localStorage.getItem("authData") || "{}");
  const token = authData.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
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
export const createPlantao = (dados) => apiClient.post("/plantoes/", dados);
export const updatePlantao = (id, dados) => apiClient.put(`/plantoes/${id}`, dados);
export const deletePlantao = (id) => apiClient.delete(`/plantoes/${id}`);

export const aceitarPlantao = (CRM, plantao_id) => apiClient.post("/aceita_plantoes/", {CRM, plantao_id});

export const getHistorico = (usuario_id) => apiClient.get(`/historico/${usuario_id}`);
export const updateHistorico = (usuario_id) => apiClient.put(`/historico/${usuario_id}`);
export const getHistoricoMedico = (crm) => apiClient.get(`/historico_medico/${crm}`);

export const getLogsAuditoria = () => apiClient.get("/logs_auditoria/");