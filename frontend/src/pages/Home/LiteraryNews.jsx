import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext.jsx';
import { FiTrash2, FiBookOpen } from 'react-icons/fi';

const NEWS_LIMIT = 4;

const MONTHS_SHORT = ['Հնվ', 'Փտր', 'Մար', 'Ապր', 'Մայ', 'Հնս', 'Հուլ', 'Օգս', 'Սեպ', 'Հոկ', 'Նոյ', 'Դեկ'];

const formatBadgeDate = (isoDate) => {
          if (!isoDate) return null;
          const d = new Date(isoDate);
          if (Number.isNaN(d.getTime())) return null;
          return { day: d.getDate(), month: MONTHS_SHORT[d.getMonth()] };
};

const LiteraryNews = () => {
          const { isAdmin } = useContext(AuthContext);
          const [newsList, setNewsList] = useState([]);
          const [loaded, setLoaded] = useState(false);

          const [formOpen, setFormOpen] = useState(false);
          const [title, setTitle] = useState('');
          const [content, setContent] = useState('');
          const [date, setDate] = useState('');
          const [imageFile, setImageFile] = useState(null);
          const [imagePreview, setImagePreview] = useState('');
          const [saving, setSaving] = useState(false);

          const fetchNews = async () => {
                    try {
                              const res = await api.get(`/literary-news?limit=${NEWS_LIMIT}`);
                              setNewsList(Array.isArray(res.data) ? res.data : []);
                    } catch (err) {
                              setNewsList([]);
                    } finally {
                              setLoaded(true);
                    }
          };

          useEffect(() => {
                    fetchNews();
          }, []);

          const resetForm = () => {
                    setTitle('');
                    setContent('');
                    setDate('');
                    setImageFile(null);
                    setImagePreview('');
          };

          const handleImageChange = (file) => {
                    if (!file) return;
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
          };

          const handleSubmit = async (e) => {
                    e.preventDefault();
                    if (!title.trim() || !content.trim()) {
                              toast.error('Վերնագիրը և տեքստը պարտադիր են');
                              return;
                    }

                    const data = new FormData();
                    data.append('title', title.trim());
                    data.append('content', content.trim());
                    data.append('date', date.trim());
                    if (imageFile) data.append('image', imageFile);

                    setSaving(true);
                    try {
                              await api.post('/literary-news', data);
                              toast.success('Նորությունը հրապարակվեց');
                              resetForm();
                              setFormOpen(false);
                              fetchNews();
                    } catch (err) {
                              toast.error('Սխալ՝ միայն ադմինները կարող են հրապարակել');
                    } finally {
                              setSaving(false);
                    }
          };

          const handleDelete = async (id) => {
                    if (!window.confirm('Ջնջե՞լ այս նորությունը')) return;
                    try {
                              await api.delete(`/literary-news/${id}`);
                              setNewsList((prev) => prev.filter((n) => n._id !== id));
                              toast.success('Նորությունը ջնջվեց');
                    } catch (err) {
                              toast.error('Մուտքը մերժված է');
                    }
          };

          if (!loaded) return null;
          if (newsList.length === 0 && !isAdmin) return null;

          return (
                    <section
                              className="bg-[#E4E8F0] border-b-[5px] border-white px-[8%] py-[60px] box-border max-[700px]:px-[6%] max-[700px]:py-10"
                              aria-label="Գրական նորություններ"
                    >
                              <div className="max-w-[1100px] mx-auto">
                                        <div className="text-center mb-9 max-[700px]:mb-6">
                                                  <h2 className="font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[2rem] text-[#14315C] font-bold m-0 mb-2 max-[600px]:text-[1.5rem]">
                                                            Գրական նորություններ
                                                  </h2>
                                                  <p className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.9rem] text-[#6B3245] font-semibold tracking-[0.3px] m-0">
                                                            Ինչ է կատարվում գրքերի աշխարհում
                                                  </p>
                                        </div>

                                        {newsList.length > 0 && (
                                                  <div className="flex flex-col gap-6">
                                                            {newsList.map((item) => {
                                                                      const badge = !item.date ? formatBadgeDate(item.createdAt) : null;
                                                                      return (
                                                                                <article
                                                                                          key={item._id}
                                                                                          className="group relative flex gap-6 bg-white rounded-[16px] p-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] max-[640px]:flex-col max-[640px]:gap-4"
                                                                                >
                                                                                          <div className="relative shrink-0 w-[220px] h-[220px] rounded-[12px] overflow-hidden bg-[#f2f0ec] max-[640px]:w-full max-[640px]:h-[200px]">
                                                                                                    {item.image ? (
                                                                                                              <img
                                                                                                                        src={item.image}
                                                                                                                        alt={item.title}
                                                                                                                        loading="lazy"
                                                                                                                        className="w-full h-full object-cover"
                                                                                                              />
                                                                                                    ) : (
                                                                                                              <div className="w-full h-full flex items-center justify-center text-[#8a8378] text-[2rem]">
                                                                                                                        <FiBookOpen />
                                                                                                              </div>
                                                                                                    )}

                                                                                                    {badge && (
                                                                                                              <div className="absolute top-3 left-3 bg-[#14315C] text-white rounded-[8px] px-2.5 py-1.5 text-center leading-none shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
                                                                                                                        <div className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[1.1rem] font-bold">{badge.day}</div>
                                                                                                                        <div className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.65rem] font-semibold tracking-[0.5px]">{badge.month}</div>
                                                                                                              </div>
                                                                                                    )}
                                                                                          </div>

                                                                                          <div className="flex-1 min-w-0 flex flex-col">
                                                                                                    {item.date && (
                                                                                                              <span className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.8rem] text-[#6B3245] font-semibold tracking-[0.3px] mb-1.5">
                                                                                                                        {item.date}
                                                                                                              </span>
                                                                                                    )}
                                                                                                    <h3 className="font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[1.3rem] text-[#14315C] font-bold m-0 mb-2 leading-[1.3] max-[600px]:text-[1.1rem]">
                                                                                                              {item.title}
                                                                                                    </h3>
                                                                                                    <p className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.92rem] text-[#3d3833] leading-[1.6] m-0 whitespace-pre-line">
                                                                                                              {item.content}
                                                                                                    </p>
                                                                                          </div>

                                                                                          {isAdmin && (
                                                                                                    <button
                                                                                                              type="button"
                                                                                                              onClick={() => handleDelete(item._id)}
                                                                                                              aria-label="Ջնջել նորությունը"
                                                                                                              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-[#6B3245] border border-[#e2d9cf] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#6B3245] hover:text-white"
                                                                                                    >
                                                                                                              <FiTrash2 />
                                                                                                    </button>
                                                                                          )}
                                                                                </article>
                                                                      );
                                                            })}
                                                  </div>
                                        )}

                                        {newsList.length === 0 && isAdmin && (
                                                  <p className="text-center font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.95rem] text-[#5f5750] mb-6">
                                                            Դեռ ոչ մի նորություն չի հրապարակվել այս բաժնում։
                                                  </p>
                                        )}

                                        {isAdmin && (
                                                  <div className="mt-9 max-w-[560px] mx-auto">
                                                            <div className="flex justify-center">
                                                                      <button
                                                                                onClick={() => (formOpen ? setFormOpen(false) : setFormOpen(true))}
                                                                                className="bg-[#14315C] text-white font-[Poppins,Noto_Sans_Armenian,sans-serif] font-semibold text-[0.9rem] px-6 py-2.5 rounded-full border-none cursor-pointer transition-opacity duration-200 hover:opacity-85"
                                                                      >
                                                                                {formOpen ? 'Փակել ֆորման' : '+ Հրապարակել նորություն'}
                                                                      </button>
                                                            </div>

                                                            {formOpen && (
                                                                      <form
                                                                                onSubmit={handleSubmit}
                                                                                className="bg-white rounded-[18px] p-6 mt-6 shadow-[0_10px_25px_rgba(0,0,0,0.06)]"
                                                                      >
                                                                                <label className="block font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.85rem] font-semibold text-[#14315C] mb-1.5">
                                                                                          Վերնագիր
                                                                                </label>
                                                                                <input
                                                                                          type="text"
                                                                                          value={title}
                                                                                          onChange={(e) => setTitle(e.target.value)}
                                                                                          placeholder="Օր.՝ Նոր հրատարակություն է հայտնվել խանութում"
                                                                                          className="w-full box-border border border-[#cfd3da] rounded-[10px] px-3.5 py-2.5 mb-4 font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.9rem] text-[#14315C] outline-none focus:border-[#14315C]"
                                                                                />

                                                                                <label className="block font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.85rem] font-semibold text-[#14315C] mb-1.5">
                                                                                          Ամսաթիվ (ընտրովի, օր.՝ Սեպտեմբեր 16, 2026)
                                                                                </label>
                                                                                <input
                                                                                          type="text"
                                                                                          value={date}
                                                                                          onChange={(e) => setDate(e.target.value)}
                                                                                          className="w-full box-border border border-[#cfd3da] rounded-[10px] px-3.5 py-2.5 mb-4 font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.9rem] text-[#14315C] outline-none focus:border-[#14315C]"
                                                                                />

                                                                                <label className="block font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.85rem] font-semibold text-[#14315C] mb-1.5">
                                                                                          Նորության տեքստ
                                                                                </label>
                                                                                <textarea
                                                                                          value={content}
                                                                                          onChange={(e) => setContent(e.target.value)}
                                                                                          rows={5}
                                                                                          placeholder="Գրիր նորության բովանդակությունը..."
                                                                                          className="w-full box-border border border-[#cfd3da] rounded-[10px] px-3.5 py-2.5 mb-4 font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.9rem] text-[#14315C] outline-none resize-y focus:border-[#14315C]"
                                                                                />

                                                                                <label className="block font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.85rem] font-semibold text-[#14315C] mb-1.5">
                                                                                          Ծածկող նկար (ընտրովի)
                                                                                </label>
                                                                                <label
                                                                                          htmlFor="news-image"
                                                                                          className="flex flex-col items-center justify-center h-[160px] rounded-[10px] border-2 border-dashed border-[#cfd3da] cursor-pointer overflow-hidden bg-[#f7f7f5] hover:border-[#14315C] transition-colors duration-200"
                                                                                >
                                                                                          {imagePreview ? (
                                                                                                    <img src={imagePreview} alt="Նախադիտում" className="w-full h-full object-cover" />
                                                                                          ) : (
                                                                                                    <span className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.8rem] text-[#8a8378] px-2 text-center">
                                                                                                              Ընտրել նկար (ոչ պարտադիր)
                                                                                                    </span>
                                                                                          )}
                                                                                </label>
                                                                                <input
                                                                                          id="news-image"
                                                                                          type="file"
                                                                                          accept="image/*"
                                                                                          className="hidden"
                                                                                          onChange={(e) => handleImageChange(e.target.files[0])}
                                                                                />

                                                                                <button
                                                                                          type="submit"
                                                                                          disabled={saving}
                                                                                          className="mt-6 w-full bg-[#d35400] text-white font-[Poppins,Noto_Sans_Armenian,sans-serif] font-semibold text-[0.95rem] px-6 py-3 rounded-full border-none cursor-pointer transition-opacity duration-200 hover:opacity-90 disabled:opacity-60"
                                                                                >
                                                                                          {saving ? 'Հրապարակվում է...' : 'Հրապարակել նորությունը'}
                                                                                </button>
                                                                      </form>
                                                            )}
                                                  </div>
                                        )}
                              </div>
                    </section>
          );
};

export default LiteraryNews;