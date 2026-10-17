// Illustrative icons (user rule 2026-10-17): ANY thing that is said gets a graphic next to the
// words — a question gets a "?", a surprise gets a "!", an idea / light / lamp gets a bulb, a sound gets a
// volume icon, the sun gets a sun, the moon gets a moon, and so on. Line icons (lucide, MIT) in the Saya
// sky blue, files in public/assets/icons/lu-<name>.svg.
// `suggestIcons` scans the SRT and proposes sticker graphics; curate the result per video.
import {parseSrt} from "./srt";

export type IconRule = {icon: string; words: string[]};

/** Arabic stems (matched with "contains" on the word, diacritics stripped) and Latin words (whole word, lower case).
 *  First match wins, so put the specific rules first. */
export const ICON_RULES: IconRule[] = [
  {icon: "eye-off", words: ["تخبّي", "تخبي", "إخفاء", "اخفاء", "تخفي", "خفي", "مخفي"]},
  {icon: "eye", words: ["نشاط", "شفت", "تشوف", "مشاهدة", "شاف", "عين"]},
  {icon: "lightbulb", words: ["فكرة", "لمبة", "إضاءة", "اضاءة", "ضوء", "نور", "حيلة", "نصيحة", "نصائح"]},
  {icon: "circle-help", words: ["سؤال", "ليش", "لماذا", "كيف", "شو "]},
  {icon: "circle-alert", words: ["تفاجأ", "مفاجأة", "صدمة", "يا إلهي", "واو", "خطير", "انتبه"]},
  {icon: "volume-2", words: ["صوت", "فوليوم", "ارفع الصوت"]},
  {icon: "headphones", words: ["سماعة", "سماعات"]},
  {icon: "mic", words: ["ميكروفون", "تسجيل صوتي"]},
  {icon: "music", words: ["أغنية", "اغنية", "موسيقى"]},
  {icon: "sun", words: ["شمس", "نهار", "صباح"]},
  {icon: "moon", words: ["قمر", "ليل", "مساء", "نوم"]},
  {icon: "star", words: ["نجمة", "نجوم", "تقييم"]},
  {icon: "cloud-rain", words: ["مطر", "شتا"]},
  {icon: "cloud", words: ["سحابة", "غيم", "كلاود"]},
  {icon: "key-round", words: ["مفتاح", "كلمة سر", "كلمة المرور", "باسورد"]},
  {icon: "lock", words: ["قفل", "خصوصية", "أمان", "امان", "مقفل"]},
  {icon: "shield-check", words: ["حماية", "آمن", "محمي", "حظر"]},
  {icon: "bell", words: ["إشعار", "اشعار", "تنبيه", "رنة"]},
  {icon: "message-circle", words: ["رسالة", "رسائل", "رسايل", "راسل", "تراسل", "محادثة"]},
  {icon: "mail", words: ["إيميل", "ايميل", "بريد"]},
  {icon: "bookmark", words: ["احفظ", "حفظ", "الحفظ"]},
  {icon: "share-2", words: ["شارك", "مشاركة", "ابعت"]},
  {icon: "heart", words: ["لايك", "إعجاب", "اعجاب", "حب", "قلب"]},
  {icon: "thumbs-up", words: ["ممتاز", "حلو", "رائع"]},
  {icon: "search", words: ["بحث", "فتّش", "فتش", "دوّر", "دور على"]},
  {icon: "settings", words: ["إعدادات", "اعدادات", "إعداد", "خيار"]},
  {icon: "users", words: ["متابع", "تتابع", "أصدقاء", "اصدقاء", "الناس"]},
  {icon: "user", words: ["حساب", "ملف شخصي", "ملفك"]},
  {icon: "smartphone", words: ["جوال", "هاتف", "موبايل", "تلفون", "آيفون", "ايفون"]},
  {icon: "laptop", words: ["لابتوب", "كمبيوتر", "حاسوب"]},
  {icon: "tv", words: ["تلفزيون", "شاشة", "أبل تي في"]},
  {icon: "camera", words: ["كاميرا", "تصوير", "صورة"]},
  {icon: "video", words: ["فيديو", "ريل", "الريل", "مقطع"]},
  {icon: "play", words: ["شغّل", "شغل", "تشغيل"]},
  {icon: "wifi", words: ["إنترنت", "انترنت", "واي فاي", "أونلاين", "اونلاين", "متصل"]},
  {icon: "battery-charging", words: ["بطارية", "شحن"]},
  {icon: "zap", words: ["سرعة", "بسرعة", "أسرع", "اسرع", "طاقة"]},
  {icon: "clock", words: ["وقت", "ساعة", "دقيقة", "ثانية"]},
  {icon: "calendar", words: ["تاريخ", "أسبوع", "اسبوع", "شهر", "يوم"]},
  {icon: "globe", words: ["موقع", "عالم", "ويب"]},
  {icon: "map-pin", words: ["مكان", "الموقع الجغرافي", "خريطة"]},
  {icon: "download", words: ["تنزيل", "نزّل", "تحميل", "حمّل"]},
  {icon: "upload", words: ["رفع", "ارفع", "انشر", "نشر"]},
  {icon: "trash-2", words: ["حذف", "احذف", "مسح"]},
  {icon: "check", words: ["صح", "تمام", "نجح"]},
  {icon: "x", words: ["غلط", "خطأ", "ممنوع", "لا تستخدم"]},
  {icon: "flame", words: ["ترند", "رائج", "مشهور"]},
  {icon: "rocket", words: ["إطلاق", "اطلاق", "انطلق"]},
  {icon: "sparkles", words: ["الذكاء الاصطناعي", "ذكاء اصطناعي", "سحر"]},
  {icon: "brain", words: ["ذكاء", "تفكير", "عقل"]},
  {icon: "bot", words: ["روبوت", "بوت", "شات"]},
  {icon: "cpu", words: ["معالج", "شريحة", "تقنية"]},
  {icon: "gift", words: ["هدية", "مجاني", "مجانا", "مجاناً"]},
  {icon: "dollar-sign", words: ["سعر", "دولار", "مال", "ادفع", "تدفع", "اشتراك"]},
  {icon: "trending-up", words: ["نمو", "زيادة", "ارتفع"]},
  {icon: "chart-column", words: ["أرقام", "ارقام", "إحصائيات", "احصائيات"]},
  {icon: "party-popper", words: ["مبروك", "احتفال"]},
];

const strip = (s: string) => s.replace(/[ً-ٰٟ]/g, "");

/** The icon file for a phrase, or null. A "؟" in the phrase also means a question, "!" a surprise. */
export const iconFor = (text: string): string | null => {
  const t = strip(text).toLowerCase();
  for (const r of ICON_RULES) if (r.words.some((w) => t.includes(strip(w).toLowerCase()))) return `assets/icons/lu-${r.icon}.svg`;
  if (/[؟?]/.test(t)) return "assets/icons/lu-circle-help.svg";
  if (/!/.test(t)) return "assets/icons/lu-circle-alert.svg";
  return null;
};

type Range = [number, number];
export type IconSticker = {type: "sticker"; at: number; dur: number; src: string; x: number; y: number; size: number; glow: true; rot: number};

/** Proposes one sticker per cue that names something. Placement: beside the head (never on the face),
 *  alternating sides, one at a time (min gap `gap` frames), skipping `skip` ranges (phone card, labels, bookmark).
 *  Curate the result: delete the ones that add nothing, keep each icon ~1.2–1.5 s. */
export const suggestIcons = (srt: string, fps: number, opts: {skip?: Range[]; gap?: number} = {}): IconSticker[] => {
  const {skip = [], gap = 45} = opts;
  const out: IconSticker[] = [];
  let last = -1e9;
  let side = 0;
  for (const c of parseSrt(srt)) {
    const src = iconFor(c.text);
    if (!src) continue;
    const at = Math.round(c.start * fps);
    const dur = Math.min(44, Math.round((c.end - c.start) * fps));
    if (at - last < gap || skip.some(([a, b]) => at < b && at + dur > a)) continue;
    const x = side++ % 2 === 0 ? 175 : 930;
    out.push({type: "sticker", at, dur, src, x, y: 560, size: 190, glow: true, rot: side % 2 ? -6 : 6});
    last = at;
  }
  return out;
};
