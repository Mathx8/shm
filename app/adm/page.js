'use client';
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import GerenciarMedico from "@/components/GerenciarMedico";
import GerenciarGestor from "@/components/GerenciarGestor";
import Logs from "@/components/Logs";

export default function Adm() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "logs";

  return (
    <div className="">
      <Header />

      <div className="min-h-screen bg-white dark:bg-black flex justify-center px-6 md:px-12 py-4 transition-colors duration-500">
        {tab === "medico" && <GerenciarMedico />}
        {tab === "gestor" && <GerenciarGestor />}
        {tab === "logs" && <Logs />}
      </div>
    </div>
  );
}
