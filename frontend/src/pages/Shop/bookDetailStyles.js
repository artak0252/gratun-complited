// Tailwind class-string map replacing BookDetail.module.css
const styles = {
  detailContainer: "px-[8%] py-[70px] bg-[#f8fafc] min-h-screen max-[900px]:px-[6%] max-[900px]:py-[50px] max-[480px]:px-[5%] max-[480px]:py-[35px]",
  backBtn: "inline-block mb-10 text-[#8e44ad] no-underline font-semibold font-[Noto_Sans_Armenian,Poppins,sans-serif] max-[480px]:mb-[25px]",
  bookDetailCard: "flex flex-row items-start gap-[60px] max-w-[1200px] mx-auto bg-white rounded-3xl p-[50px] border border-[#edf2f7] shadow-[0_10px_30px_rgba(0,0,0,0.04)] max-[900px]:gap-[35px] max-[900px]:p-[35px] max-[700px]:flex-col max-[700px]:items-center max-[480px]:p-5 max-[480px]:rounded-2xl",
  bookDetailImg: "w-[360px] h-[500px] shrink-0 object-contain bg-[#f1f5f9] rounded-2xl p-5 box-border sticky top-[100px] max-[900px]:w-[260px] max-[900px]:h-[380px] max-[900px]:static max-[700px]:w-full max-[700px]:max-w-[280px] max-[700px]:h-[340px] max-[700px]:static",
  imageWrapper: "relative shrink-0",
  favBtn: "absolute top-[30px] right-[30px] w-[42px] h-[42px] rounded-full border-none bg-[rgba(255,255,255,0.9)] text-[#b0b7c3] text-xl flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[0.2s] hover:text-[#e74c3c] hover:scale-110",
  favBtnActive: "text-[#e74c3c]",
  bookDetailBody: "flex-1 min-w-0 max-[700px]:w-full",
  genreTag: "inline-block text-xs font-semibold text-[#8e44ad] bg-[#f3e8f8] px-2.5 py-1 rounded-full mb-[15px]",
  bookDetailTitle: "font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[40px] font-semibold text-[#1a1a1a] mb-2.5 leading-[1.25] max-[900px]:text-[30px] max-[480px]:text-2xl max-[480px]:my-3 max-[480px]:mb-2",
  bookDetailAuthor: "font-[Noto_Sans_Armenian,Poppins,sans-serif] text-lg text-[#718096] mb-[30px]",
  bookDetailDescription: "font-[Noto_Sans_Armenian,Poppins,sans-serif] text-base leading-[1.8] text-[#333] text-left mb-10 max-[480px]:text-[15px]",
  bookDetailFooter: "flex items-center gap-[25px] flex-wrap",
  bookDetailPrice: "font-bold text-2xl text-[#8e44ad]",
  buyBtn: "bg-[#1a1a1a] text-white border-none px-[30px] py-4 rounded-xl font-semibold text-[15px] cursor-pointer transition-[0.3s] hover:bg-[#8e44ad]",
  loading: "text-center py-[100px] font-['Playfair_Display','Noto_Serif_Armenian',serif] text-2xl",
};

export default styles;
