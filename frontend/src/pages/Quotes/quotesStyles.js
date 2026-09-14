// Tailwind class-string map for the Quotes բաժինը - այժմ «հեղինակների բոքսեր» ցանց,
// սեղմելիս բացվում է տվյալ հեղինակի մանրամասն էջը (տես AuthorDetail.jsx)
const styles = {
  quotesPage: "px-[8%] py-[60px] bg-[#fdfdfd] min-h-screen box-border max-[700px]:px-[6%] max-[700px]:py-10",
  loading: "py-[100px] text-center text-lg text-[#6b7280]",
  pageHeader: "text-center max-w-[700px] mx-auto mb-10",
  pageHeaderH1: "font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[34px] text-[#14315C] mb-2.5 max-[700px]:text-[26px]",
  pageHeaderP: "font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[15px] text-[#6b7280] m-0",

  // --- Admin ֆորմ (նոր մեջբերում/հեղինակ ավելացնել կամ խմբագրել) ---
  adminSection: "max-w-[900px] mx-auto mb-[30px]",
  publishBtn: "bg-[#14315C] text-white border-none px-[30px] py-[15px] rounded-xl font-semibold cursor-pointer transition-all duration-300 w-fit mb-5 hover:bg-[#d35400] hover:scale-[1.02]",
  cancelBtn: "bg-none border border-[#e2e8f0] text-[#6b7280] px-6 py-[15px] rounded-xl cursor-pointer ml-2.5",
  adminFormContainer: "bg-white p-10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-10 border border-[#f0f0f0] max-[700px]:p-6",
  adminFormContainerH3: "mt-0 font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[#14315C]",
  form: "flex flex-col gap-[15px]",
  formRow: "flex gap-[15px] max-[600px]:flex-col",
  formInput: "flex-1 p-[15px] border border-[#eee] rounded-xl text-base font-[inherit] min-w-0",
  formTextarea: "p-[15px] border border-[#eee] rounded-xl text-base font-[inherit] resize-none h-[110px]",
  fileInput: "hidden",
  fileLabel: "p-[15px] bg-[#f8f9fa] border border-dashed border-[#d1d5db] rounded-xl cursor-pointer text-center text-[#6b7280] text-sm transition-all duration-300 block hover:border-[#14315C] hover:text-[#14315C] hover:bg-[#f4f7fb]",

  // --- Որոնում ---
  searchContainer: "relative mx-auto mb-[50px] max-w-[600px] flex items-center justify-center",
  searchIcon: "absolute left-[22px] text-[#9ca3af] text-lg pointer-events-none",
  searchInput: "w-full px-[50px] py-[15px] rounded-full border border-[#e2e8f0] text-base outline-none transition-[0.3s] shadow-[0_4px_6px_rgba(0,0,0,0.05)] box-border focus:border-[#14315C] focus:shadow-[0_0_0_3px_rgba(20,49,92,0.1)]",
  clearSearchBtn: "absolute right-[22px] bg-none border-none text-[#9ca3af] cursor-pointer text-lg flex hover:text-[#d35400]",
  resultsCount: "absolute -bottom-[26px] text-[13px] text-[#9ca3af]",
  noResults: "text-center text-[#9ca3af] text-base py-[60px]",

  // --- Հեղինակների բոքսերի ցանց (հիմնական տեսք /quotes էջում) ---
  authorsGrid: "grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 max-w-[1200px] mx-auto max-[480px]:grid-cols-2 max-[480px]:gap-4",
  authorCard: "relative block bg-white border border-[rgba(20,49,92,0.08)] rounded-2xl overflow-hidden no-underline shadow-[0_6px_16px_rgba(20,49,92,0.06)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(20,49,92,0.14)]",
  authorImageWrap: "relative w-full aspect-[4/3] bg-[#E4E8F0] overflow-hidden",
  authorPhoto: "w-full h-full object-cover object-top block",
  authorPhotoFallback: "w-full h-full flex items-center justify-center text-[46px] text-[#14315C] bg-[#E4E8F0]",
  authorTag: "absolute left-0 bottom-0 bg-[rgba(20,49,92,0.82)] text-white text-[12px] font-[Noto_Sans_Armenian,Poppins,sans-serif] font-medium px-3 py-[6px] max-w-full truncate",
  authorNameWrap: "px-3.5 py-3",
  authorName: "font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[16px] font-bold text-[#14315C] leading-[1.3] max-[480px]:text-[14px]",
  authorMeta: "font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[12px] text-[#9ca3af] mt-1 truncate",
  adminQuoteActions: "absolute top-3 right-3 flex gap-2 z-[2]",
  editDeleteQuoteBtn: "bg-[rgba(255,255,255,0.9)] border-none rounded-lg cursor-pointer text-lg px-2 py-1 transition-transform duration-200 hover:scale-110",

  // --- Հեղինակի մանրամասն էջ (AuthorDetail.jsx) ---
  backLink: "inline-block mb-10 text-[#14315C] no-underline font-semibold font-[Noto_Sans_Armenian,Poppins,sans-serif] hover:text-[#d35400] max-[480px]:mb-[25px]",
  detailHeader: "flex flex-col items-center text-center max-w-[640px] mx-auto mb-14 max-[700px]:mb-10",
  detailPhoto: "w-[160px] h-[160px] rounded-full object-cover border-4 border-white shadow-[0_0_0_4px_#14315C] mb-5 max-[480px]:w-[120px] max-[480px]:h-[120px]",
  detailPhotoFallback: "w-[160px] h-[160px] rounded-full bg-[#E4E8F0] border-4 border-white shadow-[0_0_0_4px_#14315C] flex items-center justify-center text-[56px] text-[#14315C] mb-5 max-[480px]:w-[120px] max-[480px]:h-[120px]",
  detailName: "font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[30px] font-bold text-[#14315C] mb-2 leading-[1.25] max-[700px]:text-[24px]",
  detailMetaRow: "flex flex-wrap items-center justify-center gap-2 mb-3.5",
  detailMetaBadge: "inline-block text-[12px] font-[Noto_Sans_Armenian,Poppins,sans-serif] font-semibold text-[#14315C] bg-[rgba(20,49,92,0.08)] px-3 py-1 rounded-full",
  detailBio: "font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[15px] text-[#525252] leading-[1.8] whitespace-pre-wrap",
  detailQuotesCount: "inline-block mt-4 text-xs font-bold text-[#6B3245] bg-[rgba(107,50,69,0.08)] px-3 py-1 rounded-full",

  detailQuotesGrid: "flex flex-col gap-[30px] max-w-[900px] mx-auto",
  quoteCard: "relative bg-[#E4E8F0] rounded-3xl px-[6%] py-8 box-border transition-[0.3s] hover:shadow-[0_16px_32px_rgba(20,49,92,0.08)]",
  quoteMark: "font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[46px] leading-[0] text-[#d35400] block mb-1.5",
  quoteText: "font-['Playfair_Display','Noto_Serif_Armenian',serif] italic font-semibold text-lg text-[#14315C] leading-[1.55] max-[700px]:text-[16px]",
  highlight: "bg-[#ffe6b3] text-inherit rounded-[3px] px-0.5",
};

export default styles;