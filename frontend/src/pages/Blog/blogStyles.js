// Tailwind class-string map replacing Blog.module.css + AdminFilter.module.css
const styles = {
  blogContainer: "px-[10%] py-[60px] bg-[#fdfdfd] min-h-screen max-[900px]:px-[6%] max-[900px]:py-[50px] max-[480px]:px-[5%] max-[480px]:py-[35px]",
  loading: "text-center py-[100px] font-['Playfair_Display','Noto_Serif_Armenian',serif] text-2xl",
  adminSection: "",
  adminFormContainer: "bg-white p-10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-[60px] border border-[#f0f0f0] max-[900px]:p-[25px]",
  adminFormContainerH3: "font-['Noto_Serif_Armenian','Playfair_Display',serif] text-[#1a1a1a] mt-0",
  form: "flex flex-col gap-[15px]",
  formInput: "p-[15px] border border-[#eee] rounded-xl text-base",
  formTextarea: "p-[15px] border border-[#eee] rounded-xl text-base resize-none h-[120px] font-[inherit]",
  adminSelect: "w-full px-4 py-3 mt-2.5 border-2 border-[#ddd] rounded-lg bg-white text-base text-[#333] cursor-pointer transition-colors duration-300 focus:border-[#8e44ad] focus:outline-none",
  fileInput: "hidden",
  fileLabel: "p-[15px] bg-[#f8f9fa] border border-dashed border-[#d1d5db] rounded-xl cursor-pointer text-center text-[#6b7280] text-sm transition-all duration-300 block hover:border-[#8e44ad] hover:text-[#8e44ad] hover:bg-[#fdf5ff]",
  publishBtn: "bg-[#1a1a1a] text-white border-none px-[30px] py-[15px] rounded-xl font-semibold cursor-pointer transition-all duration-300 w-fit mt-2.5 hover:bg-[#8e44ad] hover:scale-[1.02] max-[480px]:w-full max-[480px]:text-center",
  searchContainer: "mx-auto mb-10 max-w-[600px] flex justify-center",
  searchInput: "w-full px-[25px] py-[15px] rounded-[30px] border border-[#e2e8f0] text-base outline-none transition-[0.3s] shadow-[0_4px_6px_rgba(0,0,0,0.05)] focus:border-[#8e44ad] focus:shadow-[0_0_0_3px_rgba(142,68,173,0.1)] max-[480px]:px-5 max-[480px]:py-3 max-[480px]:text-sm",
  postsGrid: "grid grid-cols-1 gap-[30px] max-[900px]:gap-[25px] max-[480px]:gap-5",
  postCard: "relative bg-white p-5 rounded-3xl border border-[#f5f5f5] transition-[0.4s] flex flex-row items-start gap-[30px] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] max-[480px]:flex-col max-[480px]:p-[18px]",
  postImg: "w-[260px] h-[220px] shrink-0 object-cover rounded-2xl max-[900px]:w-[200px] max-[900px]:h-[180px] max-[480px]:w-full max-[480px]:h-[200px]",
  postContent: "flex flex-col flex-1 min-h-[220px] justify-center py-1.5",
  postContentH2: "font-['Noto_Serif_Armenian','Playfair_Display',serif] text-2xl font-semibold text-[#1a1a1a] mb-3 leading-[1.3]",
  postContentP: "font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[15px] leading-[1.7] text-[#6b7280] mb-[15px]",
  postContentLink: "font-[Noto_Sans_Armenian,Poppins,sans-serif] text-[#8e44ad] font-semibold no-underline",
  adminPostActions: "absolute top-5 right-5 flex gap-2 z-[2]",
  editDeletePostBtn: "bg-[rgba(255,255,255,0.9)] border-none rounded-lg cursor-pointer text-lg px-2 py-1 transition-transform duration-200 hover:scale-110",
};

export default styles;
