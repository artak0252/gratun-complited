import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext.jsx';
import { FiX, FiSettings } from 'react-icons/fi';

// «Անվճար դասընթաց» popup գովազդը։ Հայտնվում է կայք մուտք գործելուց
// (ամեն page load-ի ժամանակ, App.jsx-ի մակարդակում mount է լինում),
// ունի X կոճակ՝ փակելու համար։ Ադմինը կարող է խմբագրել նկարը,
// վերնագիրը, նպատակի տեքստը և գրանցման (Google Docs) հղումը։
const FreeCourseAd = () => {
          const { isAdmin } = useContext(AuthContext);
          const [ad, setAd] = useState(null);
          const [loaded, setLoaded] = useState(false);
          const [isOpen, setIsOpen] = useState(true);

          const [formOpen, setFormOpen] = useState(false);
          const [title, setTitle] = useState('');
          const [description, setDescription] = useState('');
          const [link, setLink] = useState('');
          const [imageFile, setImageFile] = useState(null);
          const [imagePreview, setImagePreview] = useState('');
          const [saving, setSaving] = useState(false);

          useEffect(() => {
                    let isMounted = true;
                    const fetchAd = async () => {
                              try {
                                        const res = await api.get('/free-course-ad');
                                        if (isMounted) setAd(res.data || null);
                              } catch (err) {
                                        if (isMounted) setAd(null);
                              } finally {
                                        if (isMounted) setLoaded(true);
                              }
                    };
                    fetchAd();
                    return () => { isMounted = false; };
          }, []);

          // Popup-ը բացված ժամանակ page scroll-ը արգելափակվում է, և Escape-ով փակվում է
          useEffect(() => {
                    if (!isOpen || !ad) return;
                    document.body.style.overflow = 'hidden';
                    const onKeyDown = (e) => { if (e.key === 'Escape') setIsOpen(false); };
                    window.addEventListener('keydown', onKeyDown);
                    return () => {
                              document.body.style.overflow = '';
                              window.removeEventListener('keydown', onKeyDown);
                    };
          }, [isOpen, ad]);

          const openForm = () => {
                    setTitle(ad?.title || '');
                    setDescription(ad?.description || '');
                    setLink(ad?.link || '');
                    setImageFile(null);
                    setImagePreview(ad?.image || '');
                    setFormOpen(true);
                    setIsOpen(true);
          };

          const handleFileChange = (file) => {
                    if (!file) return;
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
          };

          const handleSubmit = async (e) => {
                    e.preventDefault();
                    if (!link.trim()) {
                              toast.error('Լրացրու գրանցման հղումը (Google Docs)');
                              return;
                    }
                    if (!ad && !imageFile) {
                              toast.error('Վերբեռնիր նկարը');
                              return;
                    }

                    const data = new FormData();
                    data.append('title', title);
                    data.append('description', description);
                    data.append('link', link);
                    if (imageFile) data.append('image', imageFile);

                    setSaving(true);
                    try {
                              const res = await api.post('/free-course-ad', data);
                              setAd(res.data);
                              setFormOpen(false);
                              toast.success('Գովազդը հրապարակվեց');
                    } catch (err) {
                              toast.error('Սխալ՝ միայն ադմինները կարող են հրապարակել');
                    } finally {
                              setSaving(false);
                    }
          };

          const handleDelete = async () => {
                    if (!window.confirm('Ջնջե՞լ popup գովազդը')) return;
                    try {
                              await api.delete('/free-course-ad');
                              setAd(null);
                              setFormOpen(false);
                              toast.success('Գովազդը ջնջվեց');
                    } catch (err) {
                              toast.error('Մուտքը մերժված է');
                    }
          };

          if (!loaded) return null;
          // Հասարակ այցելուի համար՝ եթե ոչինչ չի հրապարակվել, ոչինչ չի ցուցադրվում
          if (!ad && !isAdmin) return null;

          // Ադմինի համար՝ եթե popup-ը փակված է, թողնում ենք մի փոքր լողացող
          // կոճակ, որպեսզի միշտ հնարավորություն ունենա կառավարելու գովազդը
          if (!isOpen && isAdmin) {
                    return (
                              <button
                                        onClick={openForm}
                                        aria-label="Խմբագրել գովազդը"
                                        className="fixed bottom-5 right-5 z-[998] flex items-center gap-2 bg-[#14315C] text-white font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.85rem] font-semibold px-4 py-2.5 rounded-full border-none cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:opacity-90 transition-opacity duration-200"
                              >
                                        <FiSettings /> Խմբագրել գովազդը
                              </button>
                    );
          }

          if (!isOpen) return null;

          return (
                    <div
                              role="dialog"
                              aria-modal="true"
                              aria-label="Անվճար դասընթաց"
                              onClick={() => !formOpen && setIsOpen(false)}
                              className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4"
                    >
                              <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="relative w-full max-w-[420px] bg-white rounded-[20px] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] font-[Poppins,Noto_Sans_Armenian,sans-serif] max-[480px]:p-5"
                              >
                                        <button
                                                  type="button"
                                                  onClick={() => setIsOpen(false)}
                                                  aria-label="Փակել"
                                                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f2f0ec] text-[#14315C] flex items-center justify-center text-[1.1rem] border-none cursor-pointer hover:bg-[#e4e2dd] transition-colors duration-200"
                                        >
                                                  <FiX />
                                        </button>

                                        {ad && !formOpen && (
                                                  <div className="text-center">
                                                            <img
                                                                      src={ad.image}
                                                                      alt={ad.title || 'Անվճար դասընթաց'}
                                                                      className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-[#E4E8F0]"
                                                            />
                                                            {ad.title && (
                                                                      <h3 className="font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[1.4rem] text-[#14315C] font-bold m-0 mb-3">
                                                                                {ad.title}
                                                                      </h3>
                                                            )}
                                                            {ad.description && (
                                                                      <p className="text-[0.95rem] text-[#5f5750] leading-[1.6] m-0 mb-6 whitespace-pre-line">
                                                                                {ad.description}
                                                                      </p>
                                                            )}

                                                          <a  href={ad.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-block w-full box-border bg-[#d35400] text-white font-semibold text-[0.95rem] px-6 py-3 rounded-full no-underline hover:opacity-90 transition-opacity duration-200"
                                                            >
                                                            Գրանցվել
                                                  </a>

                                                            {isAdmin && (
                                                  <div className="flex justify-center gap-3 mt-5">
                                                            <button
                                                                      onClick={openForm}
                                                                      className="text-[#14315C] text-[0.8rem] font-semibold underline bg-none border-none cursor-pointer"
                                                            >
                                                                      Խմբագրել
                                                            </button>
                                                            <button
                                                                      onClick={handleDelete}
                                                                      className="text-[#6B3245] text-[0.8rem] font-semibold underline bg-none border-none cursor-pointer"
                                                            >
                                                                      Ջնջել
                                                            </button>
                                                  </div>
                                        )}
                              </div>
                                        )}

                              {!ad && !formOpen && isAdmin && (
                                        <div className="text-center">
                                                  <p className="text-[0.95rem] text-[#5f5750] mb-5">
                                                            Դեռ ոչինչ չի հրապարակվել այս popup-ի համար։
                                                  </p>
                                                  <button
                                                            onClick={openForm}
                                                            className="bg-[#14315C] text-white font-semibold text-[0.9rem] px-6 py-2.5 rounded-full border-none cursor-pointer hover:opacity-85 transition-opacity duration-200"
                                                  >
                                                            + Հրապարակել գովազդը
                                                  </button>
                                        </div>
                              )}

                              {formOpen && isAdmin && (
                                        <form onSubmit={handleSubmit} className="text-left">
                                                  <h3 className="font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[1.2rem] text-[#14315C] font-bold m-0 mb-4">
                                                            Անվճար դասընթացի գովազդ
                                                  </h3>

                                                  <label className="block text-[0.85rem] font-semibold text-[#14315C] mb-1.5">
                                                            Նկար
                                                  </label>
                                                  <label
                                                            htmlFor="freecourse-image"
                                                            className="flex items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-[#cfd3da] cursor-pointer overflow-hidden bg-[#f7f7f5] hover:border-[#14315C] transition-colors duration-200 mb-4"
                                                  >
                                                            {imagePreview ? (
                                                                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                                                            ) : (
                                                                      <span className="text-[0.7rem] text-[#8a8378] text-center px-1">Ընտրել</span>
                                                            )}
                                                  </label>
                                                  <input
                                                            id="freecourse-image"
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleFileChange(e.target.files[0])}
                                                  />

                                                  <label className="block text-[0.85rem] font-semibold text-[#14315C] mb-1.5">
                                                            Վերնագիր
                                                  </label>
                                                  <input
                                                            type="text"
                                                            value={title}
                                                            onChange={(e) => setTitle(e.target.value)}
                                                            placeholder="Օր.՝ Անվճար դասընթաց երեխաների համար"
                                                            className="w-full box-border border border-[#cfd3da] rounded-[10px] px-3.5 py-2.5 mb-4 text-[0.9rem] text-[#14315C] outline-none focus:border-[#14315C]"
                                                  />

                                                  <label className="block text-[0.85rem] font-semibold text-[#14315C] mb-1.5">
                                                            Նպատակի նկարագրություն
                                                  </label>
                                                  <textarea
                                                            value={description}
                                                            onChange={(e) => setDescription(e.target.value)}
                                                            rows={4}
                                                            placeholder="Մի քանի նախադասությամբ նկարագրիր դասընթացի նպատակը"
                                                            className="w-full box-border border border-[#cfd3da] rounded-[10px] px-3.5 py-2.5 mb-4 text-[0.9rem] text-[#14315C] outline-none focus:border-[#14315C] resize-y"
                                                  />

                                                  <label className="block text-[0.85rem] font-semibold text-[#14315C] mb-1.5">
                                                            Գրանցման հղում (Google Docs/Forms)
                                                  </label>
                                                  <input
                                                            type="url"
                                                            value={link}
                                                            onChange={(e) => setLink(e.target.value)}
                                                            placeholder="https://docs.google.com/..."
                                                            className="w-full box-border border border-[#cfd3da] rounded-[10px] px-3.5 py-2.5 mb-5 text-[0.9rem] text-[#14315C] outline-none focus:border-[#14315C]"
                                                  />

                                                  <div className="flex gap-3">
                                                            <button
                                                                      type="submit"
                                                                      disabled={saving}
                                                                      className="flex-1 bg-[#d35400] text-white font-semibold text-[0.9rem] px-6 py-2.5 rounded-full border-none cursor-pointer hover:opacity-90 transition-opacity duration-200 disabled:opacity-60"
                                                            >
                                                                      {saving ? 'Հրապարակվում է...' : 'Պահպանել'}
                                                            </button>
                                                            <button
                                                                      type="button"
                                                                      onClick={() => setFormOpen(false)}
                                                                      className="bg-white text-[#14315C] font-semibold text-[0.9rem] px-6 py-2.5 rounded-full border border-[#14315C] cursor-pointer hover:opacity-70 transition-opacity duration-200"
                                                            >
                                                                      Չեղարկել
                                                            </button>
                                                  </div>
                                        </form>
                              )}
                    </div>
                    </div >
          );
};

export default FreeCourseAd;