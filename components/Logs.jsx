"use client";
import { useEffect, useState } from "react";
import { getLogsAuditoria } from "@/services/api";

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLogs() {
            try {
                const response = await getLogsAuditoria();
                setLogs(response.data);
            } catch (error) {
                console.error("Erro ao buscar logs:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchLogs();
    }, []);

    function limparDados(dados) {
        if (!dados) return "-";
        try {
            return JSON.stringify(dados, null, 2);
        } catch {
            return String(dados);
        }
    }

    return (
        <div className="w-full flex flex-col mx-auto py-8 px-4 gap-5">

            {loading ? (
                <p className="text-center text-gray-500">Carregando logs...</p>
            ) : (
                <div className="overflow-auto border-2 border-[#008CFF] rounded-lg">
                    <table className="w-full text-left min-w-[900px]">
                        <thead className="border-b-1 border-[#008CFF] text-[#008CFF]">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Usuário</th>
                                <th className="p-3">Hospital</th>
                                <th className="p-3">Entidade</th>
                                <th className="p-3">ID Entidade</th>
                                <th className="p-3">Ação</th>
                                <th className="p-3">Antes</th>
                                <th className="p-3">Depois</th>
                                <th className="p-3">IP</th>
                                <th className="p-3">Data</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.log_id} className="border-b">
                                    <td className="p-3 font-semibold">{log.log_id}</td>
                                    <td className="p-3">{log.usuario_id}</td>
                                    <td className="p-3">{log.hospital_id}</td>
                                    <td className="p-3">{log.entidade}</td>
                                    <td className="p-3">{log.entidade_id}</td>
                                    <td className="p-3">{log.acao}</td>

                                    <td className="p-3 max-w-[300px]">
                                        <pre className="text-xs p-2 rounded overflow-auto">
                                            {limparDados(log.dados_anteriores)}
                                        </pre>
                                    </td>

                                    <td className="p-3 max-w-[300px]">
                                        <pre className="text-xs p-2 rounded overflow-auto">
                                            {limparDados(log.dados_posteriores)}
                                        </pre>
                                    </td>

                                    <td className="p-3">{log.ip || "-"}</td>

                                    <td className="p-3">
                                        {new Date(log.createdAt).toLocaleString("pt-BR")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}