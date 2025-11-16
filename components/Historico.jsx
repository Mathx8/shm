"use client";
import { useEffect, useState } from "react";
import { getHistoricoMedico } from "@/services/api";

export default function Historico() {
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [crm, setCrm] = useState(null);

    useEffect(() => {
        const authData = JSON.parse(localStorage.getItem("authData") || "{}");
        const crmLocal = authData?.dados?.CRM;
        setCrm(crmLocal);
    }, []);

    useEffect(() => {
        if (!crm) return;

        async function fetchData() {
            try {
                const res = await getHistoricoMedico(crm);
                setHistorico(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Erro ao carregar histórico:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [crm]);

    return (
        <div className="w-full flex flex-col mx-auto py-8 px-4 gap-5">
            <div>
                <div className="w-full py-2 border-b-2 border-[#008CFF] mb-4">
                    <h1 className="text-2xl font-bold text-[#008CFF]">
                        Histórico de Plantões
                    </h1>
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Carregando histórico...</p>
            ) : (
                <div className="overflow-auto border-2 border-[#008CFF] rounded-lg">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="border-b-2 border-[#008CFF] text-[#008CFF]">
                            <tr>
                                <th className="p-3">Dia</th>
                                <th className="p-3">Início</th>
                                <th className="p-3">Fim</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Observação</th>
                                <th className="p-3">Criado em</th>
                            </tr>
                        </thead>

                        <tbody>
                            {historico.map((item) => (
                                <tr key={item._id} className="border-b">
                                    <td className="p-3 font-semibold">{item.dia}</td>
                                    <td className="p-3">{item.horario_inicio}</td>
                                    <td className="p-3">{item.horario_final}</td>

                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded font-semibold text-xs ${item.status === "ACEITO"
                                                ? "text-green-700 bg-green-200"
                                                : item.status === "RECUSADO"
                                                    ? "text-red-700 bg-red-200"
                                                    : "text-blue-700 bg-blue-200"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        {item.observacao?.trim() || "-"}
                                    </td>

                                    <td className="p-3">
                                        {new Date(item.createdAt).toLocaleString("pt-BR")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {historico.length === 0 && (
                        <p className="text-center py-4 text-gray-600">
                            Nenhum registro encontrado.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
