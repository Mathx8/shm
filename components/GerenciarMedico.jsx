"use client";
import { useEffect, useState } from "react";
import { getMedicos, createMedico, updateMedico, deleteMedico } from "@/services/api";

export default function Medico() {
    const [medicos, setMedicos] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [buscando, setBuscando] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [nome, setNome] = useState("");
    const [crm, setCrm] = useState("");
    const [especialidade, setEspecialidade] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    useEffect(() => {
        fetchMedicos();
    }, []);

    async function fetchMedicos() {
        setBuscando(true);
        try {
            const res = await getMedicos();
            const data = res.data?.medicos ?? res.data ?? [];
            setMedicos(data);
        } catch (err) {
            console.error(err);
            setMensagem(err.message || "Erro ao buscar médicos.");
        } finally {
            setBuscando(false);
        }
    }

    function resetForm() {
        setNome("");
        setCrm("");
        setEspecialidade("");
        setEmail("");
        setSenha("");
        setEditingId(null);
    }

    async function handleSubmit(e) {
        e?.preventDefault();
        setMensagem("");

        if (!nome.trim() || !crm.trim() || !especialidade.trim()) {
            setMensagem("Preencha todos os campos obrigatórios.");
            return;
        }

        setCarregando(true);
        try {
            if (editingId) {
                await updateMedico(editingId, { nome, crm, especialidade, email });
                setMensagem("Médico atualizado com sucesso!");
            } else {
                await createMedico({ nome, crm, especialidade, email, senha });
                setMensagem("Médico criado com sucesso!");
            }
            await fetchMedicos();
            resetForm();
        } catch (err) {
            console.error(err);
            setMensagem(err.message || "Erro ao salvar médico.");
        } finally {
            setCarregando(false);
        }
    }

    function startEdit(medico) {
        setEditingId(medico.id);
        setNome(medico.nome || "");
        setCrm(medico.crm || "");
        setEspecialidade(medico.especialidade || "");
        setEmail(medico.email || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id) {
        const confirmMsg = "Deseja excluir este médico?"
        if (!confirm(confirmMsg)) return;
        try {
            setCarregando(true);
            await deleteMedico(id);
            setMensagem("Médico excluído.");
            await fetchMedicos();
        } catch (err) {
            console.error(err);
            setMensagem(err.message || "Erro ao excluir médico.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="w-full flex flex-col mx-auto py-8 px-4 gap-5">
            <div className="bg-white dark:bg-black border-2 border-[#008CFF] rounded-xl shadow-inner">
                <div className="w-full p-4 border-b-1 border-[#008CFF] mb-4">
                    <h1 className="text-2xl font-bold text-[#008CFF]">
                        Cadastrar Médico
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6 p-4">
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                        type="text"
                        placeholder="CRM"
                        value={crm}
                        onChange={(e) => setCrm(e.target.value)}
                    />
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                        type="text"
                        placeholder="Especialidade"
                        value={especialidade}
                        onChange={(e) => setEspecialidade(e.target.value)}
                    />
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {!editingId && (
                        <input
                            className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                            type="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    )}

                    {mensagem && (
                        <p className="text-sm text-center text-[#008CFF]">{mensagem}</p>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={carregando}
                            className="flex-1 bg-[#008CFF] text-white dark:text-black py-3 rounded-full font-bold hover:opacity-90 disabled:opacity-60 cursor-pointer"
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
                                className="bg-white dark:bg-black text-[#008CFF] py-3 px-4 rounded-full font-semibold border hover:opacity-90 cursor-pointer"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-black border-2 border-[#008CFF] rounded-xl shadow-inner border-1">
                <div className="w-full p-4 border-b-1 border-[#008CFF]">
                    <h1 className="text-2xl font-bold text-[#008CFF]">
                        Todos os médicos
                    </h1>
                </div>

                {buscando ? (
                    <p>Carregando...</p>
                ) : medicos.length === 0 ? (
                    <p>Nenhum médico encontrado</p>
                ) : (
                    <ul className="flex flex-col gap-3 p-4">
                        {medicos.map((medico) => (
                            <li
                                key={medico.medico_id}
                                className="flex items-center justify-between gap-4 p-3 bg-[#E4EBFF] dark:bg-[#141B29] rounded-lg border border-[#008CFF]/30"
                            >
                                <div>
                                    <div className="font-semibold text-[#008CFF]">
                                        {medico.nome}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        {medico.crm} — {medico.especialidade}
                                    </div>
                                    {medico.email && (
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            {medico.email}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(medico)}
                                        className="px-3 py-2 rounded-md bg-[#cce2ff] hover:bg-[#b7d7ff] text-[#008CFF] font-semibold cursor-pointer"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => handleDelete(medico.id)}
                                        className="px-3 py-2 rounded-md bg-red-600 hover:opacity-90 text-white font-semibold cursor-pointer"
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
