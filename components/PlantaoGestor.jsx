"use client";
import { useEffect, useState } from "react";
import { getPlantoes, createPlantao, updatePlantao, deletePlantao, getHospitais } from "@/services/api";
import ModalAceitarMedico from "./ModalAceitarMedico";

export default function PlantaoGestor() {
    const [plantoes, setPlantoes] = useState([]);
    const [hospitais, setHospitais] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [buscando, setBuscando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [modalAberto, setModalAberto] = useState(false);
    const [plantaoSelecionado, setPlantaoSelecionado] = useState(null);

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [cargo_requerido, setCargo] = useState("");
    const [tipo, setTipo] = useState("");
    const [valor, setValor] = useState("");
    const [dia, setDia] = useState("");
    const [horario_inicio, setHoraInicio] = useState("");
    const [horario_final, setHoraFim] = useState("");
    const [hospital_id, setHospitalId] = useState("");
    const [status, setStatus] = useState("DISPONIVEL");

    const authData =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("authData"))
            : null;

    const gestor_id = authData?.dados?.usuario_id;

    useEffect(() => {
        fetchPlantoes();
        fetchHospitais();
    }, []);

    async function fetchPlantoes() {
        setBuscando(true);
        try {
            const res = await getPlantoes(); //TODO: listar por id do gestor
            let data = res.data?.plantoes ?? res.data ?? [];

            data = data.map(p => ({
                ...p,
                valor:
                    typeof p.valor === "object" && p.valor?.$numberDecimal
                        ? parseFloat(p.valor.$numberDecimal)
                        : p.valor,
            }));

            setPlantoes(data);
        } catch (err) {
            setMensagem("Erro ao buscar plantões.");
        } finally {
            setBuscando(false);
        }
    }

    async function fetchHospitais() {
        try {
            const res = await getHospitais();
            const data = res.data?.hospitais ?? res.data ?? [];
            setHospitais(data);
        } catch (err) {
            console.error(err);
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
        setHospitalId("");
        setStatus("DISPONIVEL");
        setEditingId(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMensagem("");

        if (!titulo.trim() || !cargo_requerido.trim() || !dia.trim() || !hospital_id.trim()) {
            setMensagem("Preencha os campos obrigatórios (Título, Cargo, Dia e Hospital).");
            return;
        }

        setCarregando(true);

        try {
            const payload = {
                hospital_id,
                gestor_id,
                titulo,
                descricao,
                cargo_requerido,
                tipo,
                valor,
                dia: formatarDiaParaBR(dia),
                horario_inicio,
                horario_final,
                status,
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
            setMensagem("Erro ao salvar plantão.");
        } finally {
            setCarregando(false);
        }
    }

    function formatarDiaParaBR(diaISO) {
        if (!diaISO) return "";
        if (diaISO.includes("/")) return diaISO;
        const [ano, mes, dia] = diaISO.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    function formatarDiaParaInput(diaBr) {
        if (!diaBr) return "";
        const [dia, mes, ano] = diaBr.split("/");
        return `${ano}-${mes}-${dia}`;
    }

    function handleMedicos(plantao) {
        setPlantaoSelecionado(plantao);
        setModalAberto(true);
    }

    function startEdit(p) {
        setEditingId(p.plantao_id);
        setHospitalId(p.hospital_id || "");
        setTitulo(p.titulo || "");
        setDescricao(p.descricao || "");
        setCargo(p.cargo_requerido || "");
        setTipo(p.tipo || "");
        setValor(p.valor || "");
        setDia(formatarDiaParaInput(p.dia));
        setHoraInicio(p.horario_inicio || "");
        setHoraFim(p.horario_final || "");
        setStatus(p.status || "DISPONIVEL");

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id) {
        if (!confirm("Deseja excluir este plantão?")) return;

        try {
            setCarregando(true);
            await deletePlantao(id);
            setMensagem("Plantão excluído com sucesso!");
            await fetchPlantoes();
        } catch (err) {
            setMensagem("Erro ao excluir plantão.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="w-full flex flex-col mx-auto py-8 px-4 gap-5">

            <div className="bg-white dark:bg-black border-2 border-[#008CFF] rounded-xl shadow-inner">

                <div className="w-full p-4 border-b border-[#008CFF] mb-4">
                    <h1 className="text-2xl font-bold text-[#008CFF]">Adicione um Plantão</h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6 p-4">

                    <select
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl"
                        value={hospital_id}
                        onChange={(e) => setHospitalId(e.target.value)}
                    >
                        <option value="">Selecione um hospital</option>
                        {hospitais.map((h) => (
                            <option key={h.hospital_id} value={h.hospital_id}>
                                {h.nome}
                            </option>
                        ))}
                    </select>

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

                    <select
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl text-black dark:text-white"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="DISPONIVEL">DISPONÍVEL</option>
                        <option value="EM ANDAMENTO">EM ANDAMENTO</option>
                        <option value="FINALIZADO">FINALIZADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                    </select>

                    {mensagem && <p className="text-center text-[#008CFF]">{mensagem}</p>}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={carregando}
                            className="flex-1 bg-[#008CFF] text-white py-3 rounded-full font-bold hover:opacity-90 disabled:opacity-60"
                        >
                            {carregando ? "Salvando..." : editingId ? "ATUALIZAR" : "ADICIONAR"}
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
                    <h1 className="text-2xl font-bold text-[#008CFF]">Seus Plantões</h1>
                </div>

                {buscando ? (
                    <p className="p-4">Carregando...</p>
                ) : (
                    <ul className="p-4 flex flex-col gap-3">
                        {plantoes.map(p => (
                            <li key={p.plantao_id} className="flex items-center justify-between bg-[#E4EBFF] p-4 rounded-lg border">
                                <div>
                                    <div className="font-semibold text-[#008CFF]">{p.titulo} {p.tipo}: {p.status}</div>
                                    <div>{p.descricao}</div>
                                    <div>{p.cargo_requerido} | R$ {p.valor}</div>
                                    <div>{p.dia} - {p.horario_inicio} às {p.horario_final}</div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleMedicos(p)}
                                        className="px-3 py-2 bg-[#cce2ff] text-[#008CFF] rounded-md hover:cursor-pointer"
                                    >
                                        Médicos
                                    </button>
                                    <button
                                        onClick={() => startEdit(p)}
                                        className="px-3 py-2 rounded-md bg-[#cce2ff] hover:bg-[#b7d7ff] text-[#008CFF] font-semibold hover:cursor-pointer"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.plantao_id)}
                                        className="px-3 py-2 rounded-md bg-red-600 hover:opacity-90 text-white font-semibold hover:cursor-pointer"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {modalAberto && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-black p-6 rounded-xl max-w-3xl w-full shadow-xl relative">

                        <button
                            onClick={() => setModalAberto(false)}
                            className="absolute top-2 right-2 text-red-500 text-xl font-bold hover:cursor-pointer"
                        >
                            ✖
                        </button>

                        <ModalAceitarMedico
                            gestor_id={gestor_id}
                            plantao_id={plantaoSelecionado?.plantao_id}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
