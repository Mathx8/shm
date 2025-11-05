'use client';
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function Header() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const url = `${pathname}?${searchParams}`
    console.log(url)

    return (
        <header className="flex items-center justify-between w-full px-6 md:px-12 py-4 bg-white dark:bg-black text-[#008CFF] shadow-sm transition-colors duration-500">
            <div className="">
                <h1>SHM</h1>
            </div>
            <nav className="flex gap-5">
                {url === "/medico?" && <>
                    <a className="hover:border-b-2 hover:opacity-75" href="#">Plantões</a>
                    <a className="hover:border-b-2 hover:opacity-75" href="#">Histórico</a>
                </>}
                {url === "/gestor?" && <>
                    <a className="hover:border-b-2 hover:opacity-75" href="#">Plantões</a>
                </>}
                {url === "/adm?" && <>
                    <a className="hover:border-b-2 hover:opacity-75" href="#">Médico</a>
                    <a className="hover:border-b-2 hover:opacity-75" href="#">Gestor</a>
                    <a className="hover:border-b-2 hover:opacity-75" href="#">Logs</a>
                </>}
            </nav>
        </header>
    )
}