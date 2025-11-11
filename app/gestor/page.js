'use client';
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import PlantaoGestor from "@/components/PlantaoGestor";

export default function Gestor() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "plantao";

  return (
    <div className="">
      <Header />

      <div className="min-h-screen bg-white dark:bg-black flex justify-center px-6 md:px-12 py-4 transition-colors duration-500">
        {tab === "plantao" && <PlantaoGestor />}
      </div>
    </div>
  );
}
