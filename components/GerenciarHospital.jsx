"use client";
import { useEffect, useState } from "react";
import { getHospitais, createHospital, updateHospital, deleteHospital } from "@/services/api";

export default function GerenciarHospital() {
    const [hospitais, setHospitais] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [buscando, setBuscando] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [nome, setNome] = useState("");
    const [endereco, setEndereco] = useState("");
    const [email, setEmail] = useState("");
    const [cnpj, setCnpj] = useState("");

    useEffect(() => {
        fetchHospitais();
    }, []);

    async function fetchHospitais() {
        setBuscando(true);
        try {
            const res = await getHospitais();
            const data = res.data?.hospitais ?? res.data ?? [];
            setHospitais(data);
        } catch (err) {
            console.error(err);
            setMensagem("Erro ao buscar hospitais.");
        } finally {
            setBuscando(false);
        }
    }

    function resetForm() {
        setNome("");
        setEndereco("");
        setEmail("");
        setCnpj("");
        setEditingId(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!nome.trim() || !endereco.trim() || !cnpj.trim()) {
            setMensagem("Preencha todos os campos obrigatórios.");
            return;
        }

        setCarregando(true);
        try {
            if (editingId) {
                await updateHospital(editingId, { nome, endereco, email, cnpj });
                setMensagem("Hospital atualizado com sucesso!");
            } else {
                await createHospital({ nome, endereco, email, cnpj });
                setMensagem("Hospital cadastrado com sucesso!");
            }

            await fetchHospitais();
            resetForm();
        } catch (err) {
            console.error(err);
            setMensagem("Erro ao salvar hospital.");
        } finally {
            setCarregando(false);
        }
    }

    function startEdit(hosp) {
        setEditingId(hosp.hospital_id);
        setNome(hosp.nome || "");
        setEndereco(hosp.endereco || "");
        setEmail(hosp.email || "");
        setCnpj(hosp.cnpj || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id) {
        if (!confirm("Deseja excluir este hospital?")) return;
        try {
            setCarregando(true);
            await deleteHospital(id);
            setMensagem("Hospital excluído.");
            await fetchHospitais();
        } catch (err) {
            console.error(err);
            setMensagem("Erro ao excluir hospital.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="w-full flex flex-col mx-auto py-8 px-4 gap-5">
            <div className="bg-white dark:bg-black border-2 border-[#008CFF] rounded-xl shadow-inner">
                <div className="w-full p-4 border-b-1 border-[#008CFF] mb-4">
                    <h1 className="text-2xl font-bold text-[#008CFF]">
                        Cadastrar Hospital
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
                        type="text"
                        placeholder="Endereço"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                    />
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl text-black dark:text-white"
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl text-black dark:text-white"
                        type="text"
                        placeholder="CNPJ"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                    />

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

            <div className="bg-white dark:bg-black border-2 border-[#008CFF] rounded-xl shadow-inner">
                <div className="w-full p-4 border-b-1 border-[#008CFF]">
                    <h1 className="text-2xl font-bold text-[#008CFF]">
                        Todos os Hospitais
                    </h1>
                </div>

                {buscando ? (
                    <p>Carregando...</p>
                ) : hospitais.length === 0 ? (
                    <p className="p-4">Nenhum hospital encontrado</p>
                ) : (
                    <ul className="flex flex-col gap-3 p-4">
                        {hospitais.map((h) => (
                            <li
                                key={h.id}
                                className="flex items-center justify-between gap-4 p-3 bg-[#E4EBFF] dark:bg-[#141B29] rounded-lg border border-[#008CFF]/30"
                            >
                                <div>
                                    <div className="font-semibold text-[#008CFF]">{h.nome}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        {h.endereco}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        {h.email} — {h.cnpj}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(h)}
                                        className="px-3 py-2 rounded-md bg-[#cce2ff] hover:bg-[#b7d7ff] text-[#008CFF] font-semibold cursor-pointer"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => handleDelete(h.hospital_id)}
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
