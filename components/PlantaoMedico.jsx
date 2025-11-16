"use client";
import { useEffect, useState } from "react";
import { getPlantoes, getHistoricoMedico, aceitarPlantao } from "@/services/api";

export default function PlantaoMedico() {
    const [plantoes, setPlantoes] = useState([]);
    const [aceitos, setAceitos] = useState({});
    const [loading, setLoading] = useState(true);

    const authData =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("authData"))
            : null;

    const CRM = authData?.dados?.CRM;

    useEffect(() => {
        async function fetchData() {
            try {
                const resPlantoes = await getPlantoes();
                const disponiveis = resPlantoes.data.filter(p => p.status === "DISPONIVEL");
                setPlantoes(disponiveis);

                const resHistorico = await getHistoricoMedico(CRM);
                const historico = Array.isArray(resHistorico.data) ? resHistorico.data : [];

                const mapa = {};
                historico.forEach(h => {
                    if (h.status === "ACEITO") {
                        mapa[h.plantao_id] = true;
                    }
                });

                setAceitos(mapa);

            } catch (error) {
                console.error("Erro ao carregar plantões:", error);
            } finally {
                setLoading(false);
            }
        }

        if (CRM) fetchData();
    }, [CRM]);

    async function handleAceitar(p) {
        try {
            await aceitarPlantao(CRM, p.plantao_id);

            setAceitos(prev => ({
                ...prev,
                [p.plantao_id]: true
            }));

        } catch (error) {
            console.error("Erro ao aceitar plantão:", error);
        }
    }

    return (
        <div className="w-full flex flex-col mx-auto py-8 px-4 gap-5">

            <div>
                <div className="w-full py-2 border-b-2 border-[#008CFF] mb-4">
                    <h1 className="text-2xl font-bold text-[#008CFF]">
                        Plantões Disponíveis
                    </h1>
                </div>
            </div>

            {loading && (
                <p className="text-center text-gray-500">Carregando plantões...</p>
            )}

            {!loading && (
                <div className="w-full flex flex-wrap gap-5 justify-start">
                    {plantoes.map((p) => {
                        const jaAceitou = aceitos[p.plantao_id];

                        return (
                            <div
                                key={p._id}
                                className="
                                    w-full md:w-[32%] 
                                    bg-[#E4EBFF] dark:bg-[#141B29]
                                    border-2 border-[#008CFF]
                                    rounded-xl shadow-sm 
                                    p-4
                                    flex flex-col gap-2
                                "
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-[#008CFF]">
                                        {p.dia}
                                    </h2>

                                    <span className="px-2 py-1 text-xs rounded bg-blue-200 text-blue-800 font-bold">
                                        DISPONÍVEL
                                    </span>
                                </div>

                                <p className="text-sm">
                                    <span className="font-semibold">Início:</span>{" "}
                                    {p.horario_inicio}
                                </p>

                                <p className="text-sm">
                                    <span className="font-semibold">Final:</span>{" "}
                                    {p.horario_final}
                                </p>

                                <p className="text-sm text-gray-600">
                                    {p.descricao || "Sem observações"}
                                </p>

                                <button
                                    onClick={() => handleAceitar(p)}
                                    disabled={jaAceitou}
                                    className={`
                                        mt-3 w-full py-2 rounded-lg font-semibold transition
                                        ${jaAceitou
                                            ? "bg-gray-400 cursor-not-allowed text-white"
                                            : "bg-[#008CFF] text-white hover:opacity-90"
                                        }
                                    `}
                                >
                                    {jaAceitou ? "Já Aceito" : "Aceitar Plantão"}
                                </button>
                            </div>
                        );
                    })}

                    {plantoes.length === 0 && (
                        <p className="text-gray-500 w-full text-center py-4">
                            Nenhum plantão disponível no momento.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
