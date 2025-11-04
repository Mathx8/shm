export default function Login() {
    return (
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-10 w-full items-center">
            <input
                className="w-full bg-[#E3FCFF] p-5 rounded-xl shadow-lg text-black placeholder:text-left"
                type="email"
                placeholder="CRP ou email"
            />
            <input
                className="w-full bg-[#E3FCFF] p-5 rounded-xl shadow-lg text-black"
                type="password"
                placeholder="Senha"
            />
            <a className="text-[#008CFF] self-start" href="#">
                Esqueceu a senha?
            </a>
            <button className="w-full text-black font-bold bg-[#008CFF] p-5 rounded-full shadow-lg cursor-pointer hover:bg-[#4AADFF]">
                ENTRAR
            </button>
        </div>
    )
}