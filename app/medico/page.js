import Header from "@/components/Header";
import Historico from "@/components/Historico";

export default function Médico() {
  return (
    <div className="">
      <Header />
      <div className="min-h-screen bg-white dark:bg-black flex justify-center px-6 md:px-12 py-4 transition-colors duration-500">
        <Historico />
      </div>
    </div>
  );
}
