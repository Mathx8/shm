export default function PlantaoMedico() {
    return (
        <div className="w-full flex flex-col mx-auto py-8 px-4 gap-5">
            <div className="">
                <div className="w-full py-2 border-b-1 border-[#448ae9] mb-4">
                    <h1 className="text-2xl font-bold text-[#008CFF]">
                        Plantões Disponíveis
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