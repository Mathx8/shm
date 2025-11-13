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

        try {
            const response = await axios.post(rota, {
                login: login,
                senha: senha,
            });

            console.log("Login bem-sucedido:", response.data);

            localStorage.setItem("token", response.data.token);
            alert(`Bem-vindo ${isCRM ? "médico" : "usuário"}!`);
            window.location.href = `${isCRM ? "/medico" : "/gestor"}`;
        } catch (err) {
            console.error("Erro no login:", err);
            setErro("Usuário/CRM ou senha inválidos.");
        }
    };

    return (
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-10 w-full items-center">
            <input
                className="w-full bg-[#E3FCFF] p-5 rounded-xl shadow-lg text-black placeholder:text-left"
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
            <a className="text-[#008CFF] self-start" href="#">
                Esqueceu a senha?
            </a>
            <button
                onClick={handleLogin}
                className="w-full text-black font-bold bg-[#008CFF] p-5 rounded-full shadow-lg cursor-pointer hover:bg-[#4AADFF]"
            >
                ENTRAR
            </button>
        </div>
    );
}
