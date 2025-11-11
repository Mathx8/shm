'use client';
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab") || "plantao";

    const linkClass = (name) => `pb-1 transition-all ${tab === name ? "border-b-2 border-[#008CFF] font-semibold" : "hover:opacity-75"}`;

    return (
        <header className="flex items-center justify-between w-full px-8 md:px-16 py-6 bg-[#E4EBFF] dark:bg-[#141B29] text-[#008CFF] shadow-sm transition-colors duration-500">
            <h1>SHM</h1>

            <nav className="flex gap-5">
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
                        <Link className={linkClass("logs")} href="/adm?tab=logs">Logs</Link>
                    </>
                )}
            </nav>
        </header>
    );
}