// Tailwind class-string map "Գրականություն" բաժնի համար.
// Palette-ը նույնն է, ինչ Quotes/ThematicBooks էջերինը (navy #14315C + terracotta #d35400),
// քանի որ Գրականությունը նավիգացիայում գտնվում է հենց այս երկուսի արանքում։
const styles = {
    pageWrapper: "px-[8%] py-[60px] bg-[#fdfdfd] min-h-screen box-border max-[700px]:px-[6%] max-[700px]:py-10",
    loading: "py-[100px] text-center text-lg text-[#6b7280]",
    pageHeader: "text-center max-w-[700px] mx-auto mb-10",
    pageHeaderH1: "font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[34px] text-[#14315C] mb-2.5 max-[700px]:text-[26px]",
    pageHeaderP: "font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[15px] text-[#6b7280] m-0",

    adminSection: "max-w-[900px] mx-auto mb-[30px]",
    publishBtn: "bg-[#14315C] text-white border-none px-[30px] py-[15px] rounded-xl font-semibold cursor-pointer transition-all duration-300 w-fit mb-5 hover:bg-[#d35400] hover:scale-[1.02] max-[480px]:w-full max-[480px]:text-center",
    cancelBtn: "bg-none border border-[#e2e8f0] text-[#6b7280] px-6 py-[15px] rounded-xl cursor-pointer ml-2.5",
    adminFormContainer: "bg-white p-10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-10 border border-[#f0f0f0] max-[700px]:p-6",
    adminFormContainerH3: "mt-0 font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[#14315C]",
    form: "flex flex-col gap-[15px]",
    formInput: "p-[15px] border border-[#eee] rounded-xl text-base font-[inherit]",
    formTextarea: "p-[15px] border border-[#eee] rounded-xl text-base font-[inherit] resize-none h-[120px]",
    adminSelect: "w-full px-4 py-3.5 border border-[#eee] rounded-xl bg-white text-base text-[#333] cursor-pointer transition-colors duration-300 focus:border-[#14315C] focus:outline-none",
    fileInput: "hidden",
    fileLabel: "p-[15px] bg-[#f8f9fa] border border-dashed border-[#d1d5db] rounded-xl cursor-pointer text-center text-[#6b7280] text-sm transition-all duration-300 block hover:border-[#14315C] hover:text-[#14315C] hover:bg-[#f4f7fb]",

    categoryTabs: "flex flex-wrap justify-center gap-3 max-w-[900px] mx-auto mb-10 max-[480px]:gap-2",
    categoryTabBtn: "bg-white border border-[#e2e8f0] px-5 py-2.5 rounded-full font-medium text-[15px] text-[#3A322C] cursor-pointer transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:bg-[#14315C] hover:text-white hover:border-[#14315C] max-[480px]:px-4 max-[480px]:py-2 max-[480px]:text-sm",
    categoryTabBtnActive: "!bg-[#14315C] !text-white !border-[#14315C]",

    searchContainer: "relative mx-auto mb-[50px] max-w-[600px] flex items-center justify-center",
    searchIcon: "absolute left-[22px] text-[#9ca3af] text-lg pointer-events-none",
    searchInput: "w-full px-[50px] py-[15px] rounded-full border border-[#e2e8f0] text-base outline-none transition-[0.3s] shadow-[0_4px_6px_rgba(0,0,0,0.05)] box-border focus:border-[#14315C] focus:shadow-[0_0_0_3px_rgba(20,49,92,0.1)]",
    clearSearchBtn: "absolute right-[22px] bg-none border-none text-[#9ca3af] cursor-pointer text-lg flex hover:text-[#d35400]",
    resultsCount: "absolute -bottom-[26px] text-[13px] text-[#9ca3af]",
    highlight: "bg-[#ffe6b3] text-inherit rounded-[3px] px-0.5",

    noResults: "text-center text-[#9ca3af] text-base py-[60px]",

    itemsGrid: "grid grid-cols-1 gap-[30px] max-w-[1100px] mx-auto max-[900px]:gap-[25px] max-[480px]:gap-5",
    itemCard: "relative bg-white p-5 rounded-3xl border border-[#f5f5f5] transition-[0.4s] flex flex-row items-start gap-[30px] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] max-[480px]:flex-col max-[480px]:p-[18px]",
    itemImg: "w-[220px] h-[220px] shrink-0 object-cover rounded-2xl max-[900px]:w-[180px] max-[900px]:h-[180px] max-[480px]:w-full max-[480px]:h-[200px]",
    itemContent: "flex flex-col flex-1 min-h-[220px] justify-center py-1.5",
    itemCategoryTag: "inline-block w-fit font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[12px] uppercase tracking-[0.5px] font-semibold text-[#d35400] mb-2.5",
    itemContentH2: "font-['Playfair_Display','Noto_Serif_Armenian',serif] text-2xl font-semibold text-[#14315C] mb-2 leading-[1.3]",
    itemAuthor: "font-[Noto_Sans_Armenian,Poppins,sans-serif] text-sm text-[#6B3245] font-medium mb-2.5",
    itemContentP: "font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[15px] leading-[1.7] text-[#6b7280] mb-[15px]",
    itemContentLink: "font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[#14315C] font-semibold no-underline hover:text-[#d35400]",
    adminItemActions: "absolute top-5 right-5 flex gap-2 z-[2]",
    editDeleteBtn: "bg-[rgba(255,255,255,0.9)] border-none rounded-lg cursor-pointer text-lg px-2 py-1 transition-transform duration-200 hover:scale-110",
};

export default styles;
