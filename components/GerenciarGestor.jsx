export default function GerenciarGestor() {
    return (
        <div className="w-full flex flex-col mx-auto py-8 px-4 gap-5">
            <div className="">
                <div className="w-full py-2 border-b-1 border-[#448ae9] mb-4">
                    <h1 className="text-2xl font-bold text-[#008CFF]">
                        Adicione um Gestor
                    </h1>
                </div>
                <div className="w-full py-2">
                    <form className="flex flex-col gap-4 mb-6">
                        <input
                            className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                            type="text"
                            placeholder="Nome"
                        />
                        <input
                            className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                            type="email"
                            placeholder="E-mail"
                        />
                        <input
                            className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                            type="password"
                            placeholder="Senha"
                        />
                        <input
                            className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                            type="text"
                            placeholder="Papel"
                        />
                        <input
                            className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                            type="text"
                            placeholder="Telefone"
                        />
                        <select
                            className="w-full bg-[#E4EBFF] dark:bg-[#141B29] p-4 rounded-xl shadow-sm text-black dark:text-white"
                        >
                            <option value="">Selecione um hospital</option>
                                <option>
                                    Teste
                                </option>
                        </select>
                        <button className="w-full text-black font-bold bg-[#008CFF] p-5 rounded-full shadow-lg cursor-pointer hover:bg-[#4AADFF]">
                            CRIAR
                        </button>
                    </form>
                </div>
            </div>
            <div className="">
                <div className="w-full py-2 border-b-1 border-[#448ae9] mb-4">
                    <h1 className="text-2xl font-bold text-[#008CFF]">
                        Seus Gestores
                    </h1>
                </div>
                <div className="w-full flex flex-wrap justify-between py-2">
                    <div className="w-[32%] h-[100px] bg-[#E4EBFF] dark:bg-[#141B29] border-1 border-[#448ae9] rounded-xl shadow-inner"></div>
                    <div className="w-[32%] h-[100px] bg-[#E4EBFF] dark:bg-[#141B29] border-1 border-[#448ae9] rounded-xl shadow-inner"></div>
                    <div className="w-[32%] h-[100px] bg-[#E4EBFF] dark:bg-[#141B29] border-1 border-[#448ae9] rounded-xl shadow-inner"></div>
                </div>
            </div>
        </div>
    )
}