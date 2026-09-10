import React, { useState, useEffect, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext.jsx';
import { FiX, FiZoomIn } from 'react-icons/fi';

const DailyDigest = () => {
          const { isAdmin } = useContext(AuthContext);
          const [digest, setDigest] = useState(null);
          const [loaded, setLoaded] = useState(false);
          const [lightbox, setLightbox] = useState(null); // 'left' | 'right' | null

          const [formOpen, setFormOpen] = useState(false);
          const [formDate, setFormDate] = useState('');
          const [leftFile, setLeftFile] = useState(null);
          const [rightFile, setRightFile] = useState(null);
          const [leftPreview, setLeftPreview] = useState('');
          const [rightPreview, setRightPreview] = useState('');
          const [saving, setSaving] = useState(false);

          useEffect(() => {
                    let isMounted = true;
                    const fetchDigest = async () => {
                              try {
                                        const res = await api.get('/daily-digest');
                                        if (isMounted) setDigest(res.data || null);
                              } catch (err) {
                                        if (isMounted) setDigest(null);
                              } finally {
                                        if (isMounted) setLoaded(true);
                              }
                    };
                    fetchDigest();
                    return () => { isMounted = false; };
          }, []);

          // Lightbox-ը փակվում է Escape-ով, և page scroll-ը արգելափակվում է, քանի դեռ բաց է
          const closeLightbox = useCallback(() => setLightbox(null), []);
          useEffect(() => {
                    if (!lightbox) return;
                    document.body.style.overflow = 'hidden';
                    const onKeyDown = (e) => { if (e.key === 'Escape') closeLightbox(); };
                    window.addEventListener('keydown', onKeyDown);
                    return () => {
                              document.body.style.overflow = '';
                              window.removeEventListener('keydown', onKeyDown);
                    };
          }, [lightbox, closeLightbox]);

          const handleFileChange = (side, file) => {
                    if (!file) return;
                    if (side === 'left') {
                              setLeftFile(file);
                              setLeftPreview(URL.createObjectURL(file));
                    } else {
                              setRightFile(file);
                              setRightPreview(URL.createObjectURL(file));
                    }
          };

          const openForm = () => {
                    setFormDate(digest?.date || '');
                    setLeftFile(null);
                    setRightFile(null);
                    setLeftPreview('');
                    setRightPreview('');
                    setFormOpen(true);
          };

          const handleSubmit = async (e) => {
                    e.preventDefault();
                    if (!leftFile || !rightFile) {
                              toast.error('Վերբեռնիր երկու նկարն էլ (ձախ և աջ)');
                              return;
                    }

                    const data = new FormData();
                    data.append('date', formDate);
                    data.append('left', leftFile);
                    data.append('right', rightFile);

                    setSaving(true);
                    try {
                              const res = await api.post('/daily-digest', data);
                              setDigest(res.data);
                              setFormOpen(false);
                              toast.success('Օրվա էջը հրապարակվեց');
                    } catch (err) {
                              toast.error('Սխալ՝ միայն ադմինները կարող են հրապարակել');
                    } finally {
                              setSaving(false);
                    }
          };

          const handleDelete = async () => {
                    if (!window.confirm('Ջնջե՞լ ընթացիկ օրվա էջը')) return;
                    try {
                              await api.delete('/daily-digest');
                              setDigest(null);
                              toast.success('Օրվա էջը ջնջվեց');
                    } catch (err) {
                              toast.error('Մուտքը մերժված է');
                    }
          };

          // Հասարակ այցելուի համար՝ քանի դեռ ոչինչ չի հրապարակվել, բլոկը ամբողջովին
          // թաքցված է (ոչ մի դատարկ տարածք AnnouncementBar-ի և մեջբերման արանքում)
          if (!loaded) return null;
          if (!digest && !isAdmin) return null;

          return (
                    <section
                              className="bg-[#E4E8F0] border-b-[5px] border-white px-[8%] py-[60px] box-border max-[700px]:px-[6%] max-[700px]:py-10"
                              aria-label="Օրը մեկ էջում"
                    >
                              <div className="max-w-[1400px] mx-auto">
                                        {digest && (
                                                  <div className="text-center mb-9 max-[700px]:mb-6">
                                                            <h2 className="font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[2rem] text-[#14315C] font-bold m-0 mb-2 max-[600px]:text-[1.5rem]">
                                                                      Օրը մեկ էջում
                                                            </h2>
                                                            {digest.date && (
                                                                      <p className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.9rem] text-[#6B3245] font-semibold tracking-[0.3px] m-0">
                                                                                {digest.date}
                                                                      </p>
                                                            )}
                                                  </div>
                                        )}

                                        {digest && (
                                                  <div className="flex justify-center items-start gap-8 max-[700px]:flex-col max-[700px]:items-center max-[700px]:gap-6">
                                                            {[
                                                                      { side: 'left', src: digest.leftImage, label: 'Ձախ էջ' },
                                                                      { side: 'right', src: digest.rightImage, label: 'Աջ էջ' },
                                                            ].map(({ side, src, label }) => (
                                                                      <button
                                                                                key={side}
                                                                                type="button"
                                                                                onClick={() => setLightbox(side)}
                                                                                aria-label={`${label} — սեղմիր մեծացնելու համար`}
                                                                                className="group relative flex-1 max-w-[680px] bg-white p-4 rounded-[16px] border-none cursor-zoom-in shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1.5 hover:shadow-[0_18px_36px_rgba(107,50,69,0.18)] max-[700px]:w-full max-[700px]:max-w-[560px]"
                                                                      >
                                                                                <span className="block overflow-hidden rounded-[10px] aspect-[210/219] bg-[#f2f0ec]">
                                                                                          <img
                                                                                                    src={src}
                                                                                                    alt={label}
                                                                                                    loading="lazy"
                                                                                                    className="w-full h-full object-cover rounded-[10px] transition-transform duration-[400ms] group-hover:scale-[1.04]"
                                                                                          />
                                                                                </span>
                                                                                <span className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#14315C]/90 text-white flex items-center justify-center text-[1.1rem] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                                          <FiZoomIn />
                                                                                </span>
                                                                      </button>
                                                            ))}
                                                  </div>
                                        )}

                                        {!digest && isAdmin && (
                                                  <p className="text-center font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.95rem] text-[#5f5750] mb-6">
                                                            Դեռ ոչինչ չի հրապարակվել այս բլոկի համար։
                                                  </p>
                                        )}

                                        {isAdmin && (
                                                  <div className="mt-9 max-w-[560px] mx-auto">
                                                            <div className="flex justify-center gap-3 flex-wrap">
                                                                      <button
                                                                                onClick={() => (formOpen ? setFormOpen(false) : openForm())}
                                                                                className="bg-[#14315C] text-white font-[Poppins,Noto_Sans_Armenian,sans-serif] font-semibold text-[0.9rem] px-6 py-2.5 rounded-full border-none cursor-pointer transition-opacity duration-200 hover:opacity-85"
                                                                      >
                                                                                {formOpen ? 'Փակել ֆորման' : digest ? 'Թարմացնել օրվա էջը' : '+ Հրապարակել օրվա էջը'}
                                                                      </button>
                                                                      {digest && (
                                                                                <button
                                                                                          onClick={handleDelete}
                                                                                          className="bg-white text-[#6B3245] font-[Poppins,Noto_Sans_Armenian,sans-serif] font-semibold text-[0.9rem] px-6 py-2.5 rounded-full border border-[#6B3245] cursor-pointer transition-opacity duration-200 hover:opacity-70"
                                                                                >
                                                                                          Ջնջել
                                                                                </button>
                                                                      )}
                                                            </div>

                                                            {formOpen && (
                                                                      <form
                                                                                onSubmit={handleSubmit}
                                                                                className="bg-white rounded-[18px] p-6 mt-6 shadow-[0_10px_25px_rgba(0,0,0,0.06)]"
                                                                      >
                                                                                <label className="block font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.85rem] font-semibold text-[#14315C] mb-1.5">
                                                                                          Ամսաթիվ / վերնագիր (ընտրովի, օր.՝ Սեպտեմբեր 10, 2026)
                                                                                </label>
                                                                                <input
                                                                                          type="text"
                                                                                          value={formDate}
                                                                                          onChange={(e) => setFormDate(e.target.value)}
                                                                                          className="w-full box-border border border-[#cfd3da] rounded-[10px] px-3.5 py-2.5 mb-5 font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.9rem] text-[#14315C] outline-none focus:border-[#14315C]"
                                                                                />

                                                                                <div className="flex gap-4 max-[500px]:flex-col">
                                                                                          {[
                                                                                                    { side: 'left', label: 'Ձախ նկարը', preview: leftPreview },
                                                                                                    { side: 'right', label: 'Աջ նկարը', preview: rightPreview },
                                                                                          ].map(({ side, label, preview }) => (
                                                                                                    <div key={side} className="flex-1">
                                                                                                              <label className="block font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.85rem] font-semibold text-[#14315C] mb-1.5">
                                                                                                                        {label}
                                                                                                              </label>
                                                                                                              <label
                                                                                                                        htmlFor={`digest-${side}`}
                                                                                                                        className="flex flex-col items-center justify-center aspect-[210/297] rounded-[10px] border-2 border-dashed border-[#cfd3da] cursor-pointer overflow-hidden bg-[#f7f7f5] hover:border-[#14315C] transition-colors duration-200"
                                                                                                              >
                                                                                                                        {preview ? (
                                                                                                                                  <img src={preview} alt={`${label} preview`} className="w-full h-full object-cover" />
                                                                                                                        ) : (
                                                                                                                                  <span className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.8rem] text-[#8a8378] px-2 text-center">
                                                                                                                                            Ընտրել նկար
                                                                                                                                  </span>
                                                                                                                        )}
                                                                                                              </label>
                                                                                                              <input
                                                                                                                        id={`digest-${side}`}
                                                                                                                        type="file"
                                                                                                                        accept="image/*"
                                                                                                                        className="hidden"
                                                                                                                        onChange={(e) => handleFileChange(side, e.target.files[0])}
                                                                                                              />
                                                                                                    </div>
                                                                                          ))}
                                                                                </div>

                                                                                <button
                                                                                          type="submit"
                                                                                          disabled={saving}
                                                                                          className="mt-6 w-full bg-[#d35400] text-white font-[Poppins,Noto_Sans_Armenian,sans-serif] font-semibold text-[0.95rem] px-6 py-3 rounded-full border-none cursor-pointer transition-opacity duration-200 hover:opacity-90 disabled:opacity-60"
                                                                                >
                                                                                          {saving ? 'Հրապարակվում է...' : 'Հրապարակել այսօրվա էջը'}
                                                                                </button>
                                                                      </form>
                                                            )}
                                                  </div>
                                        )}
                              </div>

                              {lightbox && digest && (
                                        <div
                                                  role="dialog"
                                                  aria-modal="true"
                                                  onClick={closeLightbox}
                                                  className="fixed inset-0 z-[999] bg-black/85 flex items-center justify-center p-6 cursor-zoom-out"
                                        >
                                                  <button
                                                            type="button"
                                                            onClick={closeLightbox}
                                                            aria-label="Փակել"
                                                            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center text-[1.4rem] border-none cursor-pointer hover:bg-white/20 transition-colors duration-200"
                                                  >
                                                            <FiX />
                                                  </button>
                                                  <img
                                                            src={lightbox === 'left' ? digest.leftImage : digest.rightImage}
                                                            alt="Օրը մեկ էջում — մեծացված"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="max-w-[90vw] max-h-[90vh] object-contain rounded-[8px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] cursor-default"
                                                  />
                                        </div>
                              )}
                    </section>
          );
};

export default DailyDigest;