'use client';
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Historico from "@/components/Historico";
import PlantaoMedico from "@/components/PlantaoMedico";

export default function Medico() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "plantao";

  return (
    <div>
      <Header />

      <div className="min-h-screen bg-white dark:bg-black flex justify-center px-6 md:px-12 py-4 transition-colors duration-500">
        {tab === "historico" && <Historico />}
        {tab === "plantao" && <PlantaoMedico />}
      </div>
    </div>
  );
}