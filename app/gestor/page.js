import Header from "@/components/Header";
import PlantaoGestor from "@/components/PlantaoGestor";

export default function Gestor() {
  return (
    <div className="">
      <Header />
      <div className="min-h-screen bg-white dark:bg-black flex justify-center px-6 md:px-12 py-4 transition-colors duration-500">
        <PlantaoGestor />
      </div>
    </div>
  );
}
