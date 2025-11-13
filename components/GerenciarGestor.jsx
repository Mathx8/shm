"use client";
import { useEffect, useState } from "react";
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario, getHospitais } from "@/services/api";

export default function GerenciarGestor() {
    const [gestores, setGestores] = useState([]);
    const [hospitais, setHospitais] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [buscando, setBuscando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [telefone, setTelefone] = useState("");
    const [idHospital, setIdHospital] = useState("");

    useEffect(() => {
        fetchGestores();
        fetchHospitais();
    }, []);

    async function fetchGestores() {
        setBuscando(true);
        try {
            const res = await getUsuarios();
            const data = res.data?.usuarios ?? res.data ?? [];
            const apenasGestores = data.filter((u) => u.papel === "gestor");
            setGestores(apenasGestores);
        } catch (err) {
            console.error(err);
            setMensagem(err.message || "Erro ao buscar gestores.");
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
        setNome("");
        setEmail("");
        setSenha("");
        setTelefone("");
        setIdHospital("");
        setEditingId(null);
    }

    async function handleSubmit(e) {
        e?.preventDefault();
        setMensagem("");

        if (!nome.trim() || !email.trim() || (!editingId && !senha.trim()) || !idHospital) {
            setMensagem("Preencha todos os campos obrigatórios.");
            return;
        }

        setCarregando(true);
        try {
            if (editingId) {
                await updateUsuario(editingId, {
                    nome,
                    email,
                    telefone,
                    id_hospital: idHospital,
                });
                setMensagem("Gestor atualizado com sucesso!");
            } else {
                await createUsuario({
                    nome,
                    email,
                    senha,
                    telefone,
                    papel: "gestor",
                    id_hospital: idHospital,
                });
                setMensagem("Gestor criado com sucesso!");
            }
            await fetchGestores();
            resetForm();
        } catch (err) {
            console.error(err);
            setMensagem(err.message || "Erro ao salvar gestor.");
        } finally {
            setCarregando(false);
        }
    }

    function startEdit(gestor) {
        setEditingId(gestor.id);
        setNome(gestor.nome || "");
        setEmail(gestor.email || "");
        setTelefone(gestor.telefone || "");
        setIdHospital(gestor.id_hospital || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id) {
        const confirmMsg = "Deseja excluir este gestor?";
        if (!confirm(confirmMsg)) return;
        try {
            setCarregando(true);
            await deleteUsuario(id);
            setMensagem("Gestor excluído.");
            await fetchGestores();
        } catch (err) {
            console.error(err);
            setMensagem(err.message || "Erro ao excluir gestor.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="w-full flex flex-col mx-auto py-8 px-4 gap-5">
            <div className="bg-white dark:bg-black border-2 border-[#008CFF] rounded-xl shadow-inner">
                <div className="w-full p-4 border-b-1 border-[#008CFF] mb-4">
                    <h1 className="text-2xl font-bold text-[#008CFF]">
                        {editingId ? "Editar Gestor" : "Cadastrar Gestor"}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6 p-4">
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl text-black dark:text-white"
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl text-black dark:text-white"
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {!editingId && (
                        <input
                            className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl text-black dark:text-white"
                            type="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    )}
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl text-black dark:text-white"
                        type="text"
                        placeholder="Telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                    />

                    <select
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl text-black dark:text-white"
                        value={idHospital}
                        onChange={(e) => setIdHospital(e.target.value)}
                    >
                        <option value="">Selecione um hospital</option>
                        {hospitais.map((h) => (
                            <option key={h.id} value={h.id}>
                                {h.nome}
                            </option>
                        ))}
                    </select>

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
                                    : "ADICIONAR"}
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
                    <h1 className="text-2xl font-bold text-[#008CFF]">Todos os Gestores</h1>
                </div>

                {buscando ? (
                    <p>Carregando...</p>
                ) : gestores.length === 0 ? (
                    <p className="p-4">Nenhum gestor encontrado.</p>
                ) : (
                    <ul className="flex flex-col gap-3 p-4">
                        {gestores.map((gestor) => (
                            <li
                                key={gestor.id}
                                className="flex items-center justify-between gap-4 p-3 bg-[#E4EBFF] dark:bg-[#141B29] rounded-lg border border-[#008CFF]/30"
                            >
                                <div>
                                    <div className="font-semibold text-[#008CFF]">{gestor.nome}</div>
                                    {gestor.email && (
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            {gestor.email}
                                        </div>
                                    )}
                                    {gestor.telefone && (
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            {gestor.telefone}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(gestor)}
                                        className="px-3 py-2 rounded-md bg-[#cce2ff] hover:bg-[#b7d7ff] text-[#008CFF] font-semibold cursor-pointer"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => handleDelete(gestor.id)}
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
