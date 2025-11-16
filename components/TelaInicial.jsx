import Login from "./Login"
import Image from "next/image"
import Icon from "@/public/Icon.svg"

export default function TelaInicial() {
    return (
        <div className="min-h-screen flex items-stretch justify-evenly bg-white dark:bg-black relative">
            <div className="hidden md:flex flex-[1.3] min-h-full bg-[url(@/public/Inicial.jpg)] bg-cover bg-center bg-no-repeat relative">
            </div>
            <div className="min-h-screen flex flex-col justify-between items-center p-8 w-full md:flex-[0.7]">
                {/*<h1 className="text-7xl text-bold text-[#008CFF] p-4">SHM</h1>*/}
                <Image
                    src={Icon}
                    alt="Sistema Hospital Médico"
                    width={200} 
                    height={200} 
                />
                <Login />
            </div>
        </div>
    )
}