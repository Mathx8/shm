"use client";
import { useEffect, useState } from "react";
import { getHistorico, updateHistorico } from "@/services/api";

export default function ModalAceitarMedico({ gestor_id, plantao_id }) {
    const [historico, setHistorico] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        if (!gestor_id || !plantao_id) return;

        async function fetchData() {
            try {
                const res = await getHistorico(gestor_id);
                setHistorico(
                    Array.isArray(res.data)
                        ? res.data
                        : res.data ? [res.data] : []
                );
            } catch (error) {
                console.error("Erro ao carregar histórico:", error);
            } finally {
                setCarregando(false);
            }
        }

        async function handleUpdate() {
            try {
                const res = await updateHistorico(gestor_id);
                setHistorico(
                    Array.isArray(res.data)
                        ? res.data
                        : res.data ? [res.data] : []
                );
            } catch (error) {
                console.error("Erro ao carregar histórico:", error);
            } finally {
                setCarregando(false);
            }
        }

        fetchData();
    }, [gestor_id, plantao_id]);

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold text-[#008CFF] mb-4">
                Médicos disponíveis
            </h1>

            {carregando ? (
                <p>Carregando...</p>
            ) : (
                <table className="w-full bg-white dark:bg-black border border-[#008CFF] rounded-lg">
                    <thead className="bg-[#008CFF] text-white">
                        <tr>
                            <th className="p-3">Médico</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Opções</th>
                        </tr>
                    </thead>

                    <tbody>
                        {historico.map((item) => (
                            <tr key={item.aceita_plantao_id} className="border-b">
                                <td className="p-3">{item.CRM}</td>

                                <td className="p-3 font-semibold">{item.status}</td>

                                <td className="p-3 flex gap-2">
                                    <button className="text-green-600 font-bold">Aceitar</button>
                                    <button className="text-red-600 font-bold">Recusar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
