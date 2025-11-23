"use client";
import { useEffect, useState } from "react";
import { getHistorico, updateHistorico, getMedicos } from "@/services/api";

export default function ModalAceitarMedico({ gestor_id, plantao_id }) {
    const [historico, setHistorico] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [medicosMap, setMedicosMap] = useState({});

    useEffect(() => {
        if (!gestor_id || !plantao_id) return;

        let mounted = true;
        async function fetchAll() {
            setCarregando(true);
            setErro(null);

            try {
                const resHist = await getHistorico(gestor_id);
                const histData = Array.isArray(resHist.data)
                    ? resHist.data
                    : resHist.data
                        ? [resHist.data]
                        : [];

                const filtrado = histData.filter(
                    (h) => Number(h.plantao_id) === Number(plantao_id)
                );

                const resMed = await getMedicos();
                const medicosList = Array.isArray(resMed.data) ? resMed.data : [];

                const map = {};
                for (const m of medicosList) {
                    if (m.CRM) map[String(m.CRM)] = m;
                }

                if (!mounted) return;
                setMedicosMap(map);

                const enriched = filtrado.map((item) => ({
                    ...item,
                    infoMedico: map[String(item.CRM)] || null,
                }));

                setHistorico(enriched);
            } catch (err) {
                console.error("Erro ao carregar histórico ou médicos:", err);
                if (mounted) setErro("Erro ao carregar dados. Veja o console.");
            } finally {
                if (mounted) setCarregando(false);
            }
        }

        fetchAll();
        return () => {
            mounted = false;
        };
    }, [gestor_id, plantao_id]);

    async function handleDecision(item, decision) {
        const idParaAtualizar = item.historico_gestor_id ?? item._id;
        if (!idParaAtualizar) {
            console.error("Não foi possível determinar o id para atualizar:", item);
            setErro("ID do histórico não encontrado para atualização.");
            return;
        }

        const novoStatus = decision === "aceitar" ? "ACEITO" : "RECUSADO";

        setUpdatingId(idParaAtualizar);
        setErro(null);

        try {
            const payload = {
                status: novoStatus,
            };

            await updateHistorico(idParaAtualizar, payload);

            setHistorico((prev) =>
                prev.map((h) =>
                    (h.historico_gestor_id ?? h._id) === idParaAtualizar
                        ? { ...h, status: novoStatus }
                        : h
                )
            );
        } catch (err) {
            console.error("Erro ao atualizar status:", err);
            setErro("Falha ao atualizar. Veja o console para mais detalhes.");
        } finally {
            setUpdatingId(null);
        }
    }

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold text-[#008CFF] mb-4">Médicos disponíveis</h1>

            {carregando ? (
                <p className="text-sm text-gray-500">Carregando...</p>
            ) : erro ? (
                <p className="text-sm text-red-500">{erro}</p>
            ) : historico.length === 0 ? (
                <p className="text-sm text-gray-600">Nenhum médico disponível para este plantão.</p>
            ) : (
                <div className="grid gap-3">
                    {historico.map((item) => {
                        const idKey = item.historico_gestor_id ?? item._id;
                        const info = item.infoMedico;
                        return (
                            <div
                                key={idKey}
                                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 bg-white dark:bg-gray-900 border border-[#008CFF]/30 rounded-lg shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[#f0f8ff] flex items-center justify-center text-[#008CFF] font-bold border border-[#008CFF]/30">
                                        {info?.nome ? info.nome.charAt(0).toUpperCase() : item.CRM?.charAt(0)}
                                    </div>

                                    <div>
                                        <div className="text-sm font-semibold">
                                            {info?.nome || `CRM ${item.CRM}`}
                                        </div>
                                        {info?.especialidade && (
                                            <div className="text-xs text-gray-500">{info.especialidade}</div>
                                        )}
                                        <div className="text-xs text-gray-500">
                                            {item.dia} · {item.horario_inicio} - {item.horario_final}
                                        </div>
                                        {item.observacao && (
                                            <div className="text-xs text-gray-500 mt-1">Obs: {item.observacao}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-3 md:mt-0">
                                    <div className="text-sm font-semibold text-gray-700 mr-2">
                                        {item.status}
                                    </div>

                                    <button
                                        onClick={() => handleDecision(item, "aceitar")}
                                        disabled={updatingId === idKey || item.status === "ACEITO"}
                                        className={`px-3 py-1.5 rounded-md border font-medium text-sm transition-all hover:cursor-pointer
                      ${item.status === "ACEITO" ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-green-500 text-green-600 hover:shadow-md"}
                    `}
                                        title="Aceitar médico para o plantão"
                                    >
                                        {updatingId === idKey ? "Processando..." : "Aceitar"}
                                    </button>

                                    <button
                                        onClick={() => handleDecision(item, "recusar")}
                                        disabled={updatingId === idKey || item.status === "RECUSADO"}
                                        className={`px-3 py-1.5 rounded-md border font-medium text-sm transition-all hover:cursor-pointer
                      ${item.status === "RECUSADO" ? "bg-red-50 border-red-200 text-red-700" : "bg-white border-red-500 text-red-600 hover:shadow-md"}
                    `}
                                        title="Recusar médico para o plantão"
                                    >
                                        {updatingId === idKey ? "Processando..." : "Recusar"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
