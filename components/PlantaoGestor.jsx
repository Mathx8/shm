"use client";
import { useEffect, useState } from "react";
import { getPlantoes, createPlantao, updatePlantao, deletePlantao } from "@/services/api";

export default function PlantaoGestor() {
    const [plantoes, setPlantoes] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [buscando, setBuscando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [cargo_requerido, setCargo] = useState("");
    const [tipo, setTipo] = useState("");
    const [valor, setValor] = useState("");
    const [dia, setDia] = useState("");
    const [horario_inicio, setHoraInicio] = useState("");
    const [horario_final, setHoraFim] = useState("");

    useEffect(() => {
        fetchPlantoes();
    }, []);

    async function fetchPlantoes() {
        setBuscando(true);
        try {
            const res = await getPlantoes();
            let data = res.data?.plantoes ?? res.data ?? [];

            data = data.map((p) => ({
                ...p,
                valor: typeof p.valor === "object" && p.valor?.$numberDecimal
                    ? parseFloat(p.valor.$numberDecimal)
                    : p.valor
            }));

            setPlantoes(data);

        } catch (err) {
            console.error(err);
            setMensagem(err.message || "Erro ao buscar plantões.");
        } finally {
            setBuscando(false);
        }
    }

    function resetForm() {
        setTitulo("");
        setDescricao("");
        setCargo("");
        setTipo("");
        setValor("");
        setDia("");
        setHoraInicio("");
        setHoraFim("");
        setEditingId(null);
    }

    async function handleSubmit(e) {
        e?.preventDefault();
        setMensagem("");

        if (!titulo.trim() || !cargo_requerido.trim() || !dia.trim()) {
            setMensagem("Preencha os campos obrigatórios (Título, Cargo e Dia).");
            return;
        }

        setCarregando(true);
        try {
            const payload = {
                titulo,
                descricao,
                cargo_requerido,
                tipo,
                valor,
                dia,
                horario_inicio,
                horario_final,
            };

            if (editingId) {
                await updatePlantao(editingId, payload);
                setMensagem("Plantão atualizado com sucesso!");
            } else {
                await createPlantao(payload);
                setMensagem("Plantão criado com sucesso!");
            }

            await fetchPlantoes();
            resetForm();
        } catch (err) {
            console.error(err);
            setMensagem(err.message || "Erro ao salvar plantão.");
        } finally {
            setCarregando(false);
        }
    }

    function formatarDiaParaBR(diaISOouBR) {
        if (!diaISOouBR) return "";

        if (diaISOouBR.includes("/")) return diaISOouBR;

        const [ano, mes, dia] = diaISOouBR.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    function formatarDiaParaInput(diaBr) {
        if (!diaBr) return "";
        const [dia, mes, ano] = diaBr.split("/");
        return `${ano}-${mes}-${dia}`;
    }

    function startEdit(plantao) {
        setEditingId(plantao.plantao_id);
        setTitulo(plantao.titulo || "");
        setDescricao(plantao.descricao || "");
        setCargo(plantao.cargo_requerido || "");
        setTipo(plantao.tipo || "");
        setValor(plantao.valor || "");
        setDia(formatarDiaParaInput(plantao.dia));
        setHoraInicio(plantao.horario_inicio || "");
        setHoraFim(plantao.horario_final || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id) {
        const confirmMsg = "Deseja excluir este plantão?";
        if (!confirm(confirmMsg)) return;
        try {
            setCarregando(true);
            await deletePlantao(id);
            setMensagem("Plantão excluído com sucesso!");
            await fetchPlantoes();
        } catch (err) {
            console.error(err);
            setMensagem(err.message || "Erro ao excluir plantão.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="w-full flex flex-col mx-auto py-8 px-4 gap-5">
            <div className="bg-white dark:bg-black border-2 border-[#008CFF] rounded-xl shadow-inner">
                <div className="w-full p-4 border-b border-[#008CFF] mb-4">
                    <h1 className="text-2xl font-bold text-[#008CFF]">
                        Adicione um Plantão
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6 p-4">
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                        type="text"
                        placeholder="Título"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                        type="text"
                        placeholder="Descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                        type="text"
                        placeholder="Cargo Requerido"
                        value={cargo_requerido}
                        onChange={(e) => setCargo(e.target.value)}
                    />
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                        type="text"
                        placeholder="Tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                    />
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                        type="number"
                        placeholder="Valor (R$)"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                    />
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                        type="date"
                        value={dia}
                        onChange={(e) => setDia(e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="time"
                            className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                            value={horario_inicio}
                            onChange={(e) => setHoraInicio(e.target.value)}
                        />
                        <input
                            type="time"
                            className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                            value={horario_final}
                            onChange={(e) => setHoraFim(e.target.value)}
                        />
                    </div>

                    {mensagem && (
                        <p className="text-sm text-center text-[#008CFF]">{mensagem}</p>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={carregando}
                            className="flex-1 bg-[#008CFF] text-white py-3 rounded-full font-bold hover:opacity-90 disabled:opacity-60"
                        >
                            {carregando
                                ? "Salvando..."
                                : editingId
                                    ? "ATUALIZAR"
                                    : "ADICIONAR"
                            }
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-white dark:bg-black text-[#008CFF] py-3 px-4 rounded-full font-semibold border hover:opacity-90"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-black border-2 border-[#008CFF] rounded-xl shadow-inner">
                <div className="w-full p-4 border-b border-[#008CFF]">
                    <h1 className="text-2xl font-bold text-[#008CFF]">
                        Seus Plantões
                    </h1>
                </div>

                {buscando ? (
                    <p className="p-4">Carregando...</p>
                ) : plantoes.length === 0 ? (
                    <p className="p-4">Nenhum plantão encontrado.</p>
                ) : (
                    <ul className="flex flex-col gap-3 p-4">
                        {plantoes.map((plantao) => (
                            <li
                                key={plantao.plantao_id}
                                className="flex items-center justify-between gap-4 p-3 bg-[#E4EBFF] dark:bg-[#141B29] rounded-lg border border-[#008CFF]/30"
                            >
                                <div>
                                    <div className="font-semibold text-[#008CFF]">
                                        {plantao.titulo}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        {plantao.cargo_requerido} — {plantao.tipo}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        {formatarDiaParaBR(plantao.dia)} | R$ {plantao.valor}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(plantao)}
                                        className="px-3 py-2 rounded-md bg-[#cce2ff] hover:bg-[#b7d7ff] text-[#008CFF] font-semibold"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plantao.plantao_id)}
                                        className="px-3 py-2 rounded-md bg-red-600 hover:opacity-90 text-white font-semibold"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}