"use client";
import { useState } from "react";
import axios from "axios";

export default function Login() {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const handleLogin = async () => {
        setErro("");

        if (!login || !senha) {
            setErro("Preencha todos os campos.");
            return;
        }

        const isCRM = !login.includes("@");

        const rota = isCRM
            ? "https://api-hospital-95ax.onrender.com/medicos/login"
            : "https://api-hospital-95ax.onrender.com/usuarios/login";

        const payload = isCRM
            ? { CRM: login, senha }
            : { email: login, senha };

        try {
            const response = await axios.post(rota, payload);

            const { token, usuario, medico } = response.data;

            const authData = {
                token,
                tipo: isCRM ? "MEDICO" : "USUARIO",
                dados: isCRM ? medico : usuario,
            };

            localStorage.setItem("authData", JSON.stringify(authData));

            alert(`Bem-vindo ${isCRM ? medico?.nome : usuario?.nome}!`);

            if (isCRM) {
                window.location.href = "/medico";
                return;
            }

            const papel = usuario?.papel;
            if (papel === "ADMIN_SISTEMA") {
                window.location.href = "/adm";
            } else {
                window.location.href = "/gestor";
            }

        } catch (err) {
            console.error("Erro no login:", err.response?.data || err);
            setErro(err.response?.data?.error || "Usuário/CRM ou senha inválidos.");
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full items-center">
            <input
                className="w-full bg-[#E3FCFF] p-5 rounded-xl shadow-lg text-black"
                type="text"
                placeholder="CRM ou email"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />

            <input
                className="w-full bg-[#E3FCFF] p-5 rounded-xl shadow-lg text-black"
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />

            {erro && <p className="text-red-500 self-start">{erro}</p>}

            <button
                onClick={handleLogin}
                className="w-full text-black font-bold bg-[#008CFF] p-5 rounded-full shadow-lg cursor-pointer hover:bg-[#4AADFF]"
            >
                ENTRAR
            </button>
        </div>
    );
}
