import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext.jsx';
import {
          FaTheaterMasks,
          FaFilm,
          FaPalette,
          FaTshirt,
          FaRunning,
          FaStethoscope,
          FaMicroscope,
          FaGraduationCap,
          FaBook,
} from 'react-icons/fa';

// Ֆիքսված 9 բաժինները՝ հենց այն կարգով, ինչ կարգով պետք է հայտնվեն grid-ում
// (3 սյուն x 3 տող, ինչպես "Օրը մեկ էջում" PDF-ի սկզբնաղբյուրում)։ Ադմինը միայն
// լրացնում է title/text, category-ն ու icon-ը հաստատուն են՝ որ բլոկը
// ամեն օր պահի նույն, կանխատեսելի կառուցվածքը։
const CATEGORY_DEFS = [
          { key: 'culture', label: 'Մշակույթ', Icon: FaTheaterMasks },
          { key: 'cinema', label: 'Կինո', Icon: FaFilm },
          { key: 'art', label: 'Արվեստ', Icon: FaPalette },
          { key: 'fashion', label: 'Նորաձևություն', Icon: FaTshirt },
          { key: 'sport', label: 'Սպորտ', Icon: FaRunning },
          { key: 'medicine', label: 'Բժշկություն', Icon: FaStethoscope },
          { key: 'science', label: 'Գիտություն', Icon: FaMicroscope },
          { key: 'education', label: 'Կրթություն', Icon: FaGraduationCap },
          { key: 'literature', label: 'Գրականություն', Icon: FaBook },
];

const ICON_MAP = Object.fromEntries(CATEGORY_DEFS.map((c) => [c.key, c.Icon]));

const emptyFormItems = () =>
          Object.fromEntries(CATEGORY_DEFS.map((c) => [c.key, { title: '', text: '' }]));

const DailyDigest = () => {
          const { isAdmin } = useContext(AuthContext);
          const [digest, setDigest] = useState(null);
          const [loaded, setLoaded] = useState(false);
          const [formOpen, setFormOpen] = useState(false);
          const [formDate, setFormDate] = useState('');
          const [formItems, setFormItems] = useState(emptyFormItems());
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

          const openFormForEdit = () => {
                    if (digest) {
                              setFormDate(digest.date);
                              const next = emptyFormItems();
                              digest.items.forEach((item) => {
                                        const def = CATEGORY_DEFS.find((c) => c.label === item.category);
                                        if (def) next[def.key] = { title: item.title, text: item.text };
                              });
                              setFormItems(next);
                    } else {
                              setFormDate('');
                              setFormItems(emptyFormItems());
                    }
                    setFormOpen(true);
          };

          const handleFieldChange = (key, field, value) => {
                    setFormItems((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
          };

          const handleSubmit = async (e) => {
                    e.preventDefault();
                    if (!formDate.trim()) {
                              toast.error('Լրացրու ամսաթիվը');
                              return;
                    }

                    const items = CATEGORY_DEFS
                              .filter((def) => formItems[def.key].title.trim() && formItems[def.key].text.trim())
                              .map((def) => ({
                                        category: def.label,
                                        icon: def.key,
                                        title: formItems[def.key].title.trim(),
                                        text: formItems[def.key].text.trim(),
                              }));

                    if (items.length === 0) {
                              toast.error('Լրացրու առնվազն մեկ բաժին');
                              return;
                    }

                    setSaving(true);
                    try {
                              const res = await api.post('/daily-digest', { date: formDate.trim(), items });
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

          // Հասարակ այցելուի համար՝ քանի դեռ ոչինչ չի հրապարակվել, բլոկը ընդհանրապես
          // չի երևում (ոչ մի դատարկ տարածք AnnouncementBar-ի և մեջբերման արանքում)
          if (!loaded) return null;
          if (!digest && !isAdmin) return null;

          return (
                    <section
                              className="bg-[#E4E8F0] border-b-[5px] border-white px-[8%] py-[60px] box-border max-[700px]:px-[6%] max-[700px]:py-10"
                              aria-label="Օրը մեկ էջում"
                    >
                              <div className="max-w-[1100px] mx-auto">
                                        <div className="text-center mb-10 max-[700px]:mb-7">
                                                  <h2 className="font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[2rem] text-[#14315C] font-bold m-0 mb-2 max-[600px]:text-[1.5rem]">
                                                            Օրը մեկ էջում
                                                  </h2>
                                                  {digest && (
                                                            <p className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.9rem] text-[#6B3245] font-semibold tracking-[0.3px] m-0">
                                                                      {digest.date}
                                                            </p>
                                                  )}
                                        </div>

                                        {digest && (
                                                  <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
                                                            {digest.items.map((item) => {
                                                                      const Icon = ICON_MAP[item.icon] || FaBook;
                                                                      return (
                                                                                <article
                                                                                          key={item.category}
                                                                                          className="bg-white rounded-[18px] p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(107,50,69,0.12)]"
                                                                                >
                                                                                          <div className="flex items-center gap-3 mb-3">
                                                                                                    <span className="w-10 h-10 flex-none rounded-full bg-[#14315C] text-white flex items-center justify-center text-[1rem]">
                                                                                                              <Icon />
                                                                                                    </span>
                                                                                                    <h3 className="font-['Playfair_Display','Noto_Serif_Armenian',serif] text-[1.02rem] text-[#6B3245] font-bold m-0">
                                                                                                              {item.category}
                                                                                                    </h3>
                                                                                          </div>
                                                                                          <p className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.92rem] text-[#14315C] font-semibold leading-[1.4] mb-1.5">
                                                                                                    {item.title}
                                                                                          </p>
                                                                                          <p className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.87rem] text-[#5f5750] leading-[1.5] line-clamp-3 m-0">
                                                                                                    {item.text}
                                                                                          </p>
                                                                                </article>
                                                                      );
                                                            })}
                                                  </div>
                                        )}

                                        {!digest && isAdmin && (
                                                  <p className="text-center font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.95rem] text-[#5f5750] mb-6">
                                                            Դեռ ոչինչ չի հրապարակվել այս բլոկի համար։
                                                  </p>
                                        )}

                                        {isAdmin && (
                                                  <div className="mt-8 max-w-[800px] mx-auto">
                                                            <div className="flex justify-center gap-3 flex-wrap">
                                                                      <button
                                                                                onClick={() => (formOpen ? setFormOpen(false) : openFormForEdit())}
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
                                                                                          Ամսաթիվ (օր.՝ Սեպտեմբեր 10, 2026)
                                                                                </label>
                                                                                <input
                                                                                          type="text"
                                                                                          value={formDate}
                                                                                          onChange={(e) => setFormDate(e.target.value)}
                                                                                          required
                                                                                          className="w-full box-border border border-[#cfd3da] rounded-[10px] px-3.5 py-2.5 mb-5 font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.9rem] text-[#14315C] outline-none focus:border-[#14315C]"
                                                                                />

                                                                                <p className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.8rem] text-[#8a8378] mb-4">
                                                                                          Թողեք դատարկ այն բաժինները, որոնք այսօր չեք ուզում ցուցադրել։
                                                                                </p>

                                                                                <div className="flex flex-col gap-5">
                                                                                          {CATEGORY_DEFS.map(({ key, label, Icon }) => (
                                                                                                    <fieldset key={key} className="border-t border-[#eee] pt-4 first:border-t-0 first:pt-0">
                                                                                                              <legend className="flex items-center gap-2 font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.9rem] font-semibold text-[#6B3245] mb-2.5">
                                                                                                                        <Icon /> {label}
                                                                                                              </legend>
                                                                                                              <input
                                                                                                                        type="text"
                                                                                                                        placeholder="Վերնագիր"
                                                                                                                        value={formItems[key].title}
                                                                                                                        onChange={(e) => handleFieldChange(key, 'title', e.target.value)}
                                                                                                                        className="w-full box-border border border-[#cfd3da] rounded-[10px] px-3.5 py-2.5 mb-2 font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.88rem] text-[#14315C] outline-none focus:border-[#14315C]"
                                                                                                              />
                                                                                                              <textarea
                                                                                                                        placeholder="Կարճ նկարագրություն (1-2 նախադասություն)"
                                                                                                                        value={formItems[key].text}
                                                                                                                        onChange={(e) => handleFieldChange(key, 'text', e.target.value)}
                                                                                                                        rows={2}
                                                                                                                        className="w-full box-border border border-[#cfd3da] rounded-[10px] px-3.5 py-2.5 font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[0.88rem] text-[#14315C] outline-none resize-y focus:border-[#14315C]"
                                                                                                              />
                                                                                                    </fieldset>
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
                    </section>
          );
};

export default DailyDigest;