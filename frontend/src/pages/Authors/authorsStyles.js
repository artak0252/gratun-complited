// Tailwind class-string map for the Authors pages, հետևելով quotesStyles.js-ի
// և literatureStyles.js-ի նույն օրինակին
const styles = {
          // --- Ընդհանուր էջի wrapper (list և detail) ---
          page: "px-[8%] py-[60px] bg-[#fdfdfd] min-h-screen box-border max-[700px]:px-[6%] max-[700px]:py-10",
          loading: "py-[100px] text-center text-lg text-[#6b7280]",
          noResults: "text-center text-[#9ca3af] text-base py-[60px]",

          // --- Authors.jsx (ցանկ) ---
          pageHeader: "text-center max-w-[700px] mx-auto mb-10",
          pageHeaderH1: "font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[34px] text-[#14315C] mb-2.5 max-[700px]:text-[26px]",
          pageHeaderP: "font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[15px] text-[#6b7280] m-0",

          authorsGrid: "grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 max-w-[1200px] mx-auto max-[480px]:grid-cols-2 max-[480px]:gap-4",

          authorCard: "block bg-white border border-[rgba(20,49,92,0.08)] rounded-2xl overflow-hidden no-underline shadow-[0_6px_16px_rgba(20,49,92,0.06)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(20,49,92,0.14)]",
          authorImageWrap: "relative w-full aspect-[4/3] bg-[#E4E8F0] overflow-hidden",
          authorPhoto: "w-full h-full object-cover object-top block",
          authorPhotoFallback: "w-full h-full flex items-center justify-center text-[46px] text-[#14315C] bg-[#E4E8F0]",
          authorTag: "absolute left-0 bottom-0 bg-[rgba(20,49,92,0.82)] text-white text-[12px] font-[Noto_Sans_Armenian,Poppins,sans-serif] font-medium px-3 py-[6px] max-w-full truncate",
          authorNameWrap: "px-3.5 py-3",
          authorName: "font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[16px] font-bold text-[#14315C] leading-[1.3] max-[480px]:text-[14px]",

          // --- AuthorDetail.jsx (մանրամասն) ---
          backLink: "inline-block mb-10 text-[#14315C] no-underline font-semibold font-[Noto_Sans_Armenian,Poppins,sans-serif] hover:text-[#d35400] max-[480px]:mb-[25px]",
          detailHeader: "flex flex-col items-center text-center max-w-[640px] mx-auto mb-14 max-[700px]:mb-10",
          detailPhoto: "w-[160px] h-[160px] rounded-full object-cover border-4 border-white shadow-[0_0_0_4px_#14315C] mb-5 max-[480px]:w-[120px] max-[480px]:h-[120px]",
          detailPhotoFallback: "w-[160px] h-[160px] rounded-full bg-[#E4E8F0] border-4 border-white shadow-[0_0_0_4px_#14315C] flex items-center justify-center text-[56px] text-[#14315C] mb-5 max-[480px]:w-[120px] max-[480px]:h-[120px]",
          detailName: "font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[30px] font-bold text-[#14315C] mb-3 leading-[1.25] max-[700px]:text-[24px]",
          detailBio: "font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[15px] text-[#525252] leading-[1.8] whitespace-pre-wrap",
          detailQuotesCount: "inline-block mt-4 text-xs font-bold text-[#6B3245] bg-[rgba(107,50,69,0.08)] px-3 py-1 rounded-full",

          quotesGrid: "flex flex-col gap-[30px] max-w-[900px] mx-auto",
          quoteCard: "relative bg-[#E4E8F0] rounded-3xl px-[6%] py-8 box-border transition-[0.3s] hover:shadow-[0_16px_32px_rgba(20,49,92,0.08)]",
          quoteMark: "font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[46px] leading-[0] text-[#d35400] block mb-1.5",
          quoteText: "font-['Playfair_Display','Noto_Serif_Armenian',serif] italic font-semibold text-lg text-[#14315C] leading-[1.55] max-[700px]:text-[16px]",
};

export default styles;