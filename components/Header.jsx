'use client';
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image"
import Icon from "@/public/Icon.svg"

export default function Header() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const tab = searchParams.get("tab") || "plantao";

    const linkClass = (name) =>
        `pb-1 transition-all ${tab === name
            ? "border-b-2 border-[#008CFF] font-semibold"
            : "hover:opacity-75"
        }`;

    const handleLogout = () => {
        if (!confirm("Deseja sair?")) return;
        localStorage.removeItem("authData");
        router.push("/");
    };

    return (
        <header className="flex items-center justify-between w-full px-8 md:px-16 py-6 bg-[#E4EBFF] dark:bg-[#141B29] text-[#008CFF] shadow-sm transition-colors duration-500">

            <Image
                src={Icon}
                alt="Sistema Hospital Médico"
                width={36}
                height={36}
            />

            <nav className="flex items-center gap-6">
                {pathname === "/medico" && (
                    <>
                        <Link className={linkClass("plantao")} href="/medico?tab=plantao">
                            Plantões
                        </Link>
                        <Link className={linkClass("historico")} href="/medico?tab=historico">
                            Histórico
                        </Link>
                    </>
                )}

                {pathname === "/gestor" && (
                    <Link className={linkClass("plantao")} href="/gestor?tab=plantao">
                        Plantões
                    </Link>
                )}

                {pathname === "/adm" && (
                    <>
                        <Link className={linkClass("medico")} href="/adm?tab=medico">Médico</Link>
                        <Link className={linkClass("gestor")} href="/adm?tab=gestor">Gestor</Link>
                        <Link className={linkClass("hospital")} href="/adm?tab=hospital">Hospital</Link>
                        <Link className={linkClass("logs")} href="/adm?tab=logs">Logs</Link>
                    </>
                )}
            </nav>
            <button
                onClick={handleLogout}
                className="ml-4 px-4 py-1 text-sm rounded-lg border border-[#008CFF] text-[#008CFF] hover:bg-[#008CFF] hover:text-white transition-all"
            >
                Sair
            </button>
        </header>
    );
}