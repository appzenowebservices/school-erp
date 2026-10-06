'use client';
import React, { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { getEvents } from '../../api/event';
import ChartLoadingSkeleton from '../ui/status/ChartLoadingSkeleton';
import { useRouter } from 'next/navigation';

// =============================
// DATA SOURCE: live API events + hardcoded showcase cards, always combined.
// Showcase cards keep their showcase styling; live API events render through
// the same card JSX + getTheme() so they look identical in style.
// =============================

// =============================
// Image handling:
// Assume incoming AI image url (ai_image_url / image_url / icon_url).
// Else fallback to /public/icons.
// =============================
const FALLBACK_ICON = '/icons/dashboard.png';

const getAiImageUrl = (event) => {
  if (!event) return null;
  return (
    event.ai_image_url ||
    event.image_url ||
    event.icon_url ||
    event.event_type?.icon_url ||
    null
  );
};

// =============================
// DATE BADGE backgrounds (behind FEB / 01 / Sun): date-* ONLY.
//   public/bg/date-winter-vacation.png  (+ date-winter-vaccation.png typo)
//   public/bg/date-summer-vacation.png  (+ date-summer-vaccation.png typo)
//   public/bg/date-holi.png
//   public/bg/date-second-saturday.png
//   public/bg/date-default.png
// Served as /bg/date-....png. event-* files are NEVER used here —
// those are reserved for the container (card wash) below.
// Per-event override (API): event.date_bg_url / date_bg_image.
// =============================
const DATE_BG_BY_THEME = {
  winter: '/bg/date-winter-vacation.png',
  summer: '/bg/date-summer-vacation.png',
  holiday: '/bg/date-holi.png',
  saturday: '/bg/date-second-saturday.png',
  default: '/bg/date-default.png',
};

// "vaccation" typo variant first, then old files already in public/bg.
// Tried AFTER the date-* names above, only so nothing breaks.
const DATE_BG_LEGACY = {
  winter: [
    '/bg/date-winter-vaccation.png',
    '/bg/winter-date.png',
    '/bg/date-winter.png',
  ],
  summer: [
    '/bg/date-summer-vaccation.png',
    '/bg/summer-date.png',
    '/bg/date-summer.png',
  ],
  holiday: [
    '/bg/date-holiday.png',
    '/bg/holiday-date.png',
    '/bg/holi-date.png',
  ],
  saturday: [
    '/bg/date-saturday.png',
    '/bg/saturday-date.png',
  ],
  default: [
    '/bg/default-date.png',
  ],
};

// =============================
// CONTAINER (card wash) artwork: event-* ONLY — reserved for this.
//   public/bg/event-winter-vacation.png (+ event-winter-vaccation.png typo)
//   public/bg/event-summer-vacation.png (+ event-summer-vaccation.png typo)
//   public/bg/event-holi.png
//   public/bg/event-second-saturday.png
//   public/bg/event-default.png
// Each event resolves its own file; theme file is last resort.
// date-* / *-date.png / /art/* / root entries at the END are legacy
// only until those files are moved into /bg/event-* names.
// =============================
const ARTWORK_BY_THEME = {
  holiday: '/bg/event-holi.png',
  winter: '/bg/event-winter-vacation.png',
  summer: '/bg/event-summer-vacation.png',
  saturday: '/bg/event-second-saturday.png',
  default: '/bg/event-default.png',
};

// BG-first candidates per theme (new names, then vaccation typo, then legacy).
const ARTWORK_CANDIDATES = {
  holiday: [
    '/bg/event-holi.png',
    '/bg/event-holiday.png',
    '/bg/holiday-date.png',
    '/bg/date-holiday.png',
    '/bg/holi-date.png',
    '/bg/date-holi.png',
    '/art/event-holiday.png',
    '/art/event-holi.png',
    '/event-holi.png',
    '/event-holiday.png',
  ],
  winter: [
    '/bg/event-winter-vacation.png',
    '/bg/event-winter-vaccation.png',
    '/bg/winter-date.png',
    '/bg/date-winter.png',
    '/art/event-winter.png',
    '/event-winter.png',
  ],
  summer: [
    '/bg/event-summer-vacation.png',
    '/bg/event-summer-vaccation.png',
    '/bg/summer-date.png',
    '/bg/date-summer.png',
    '/art/event-summer.png',
    '/event-summer.png',
  ],
  saturday: [
    '/bg/event-second-saturday.png',
    '/bg/event-saturday.png',
    '/bg/saturday-date.png',
    '/bg/date-saturday.png',
    '/art/event-saturday.png',
    '/event-saturday.png',
  ],
  default: [
    '/bg/event-default.png',
    '/bg/default-date.png',
    '/bg/date-default.png',
    '/art/event-default.png',
    '/event-default.png',
  ],
};

// Slug for per-event file lookup: "Winter Vacation" + "showcase-winter"
// -> ["showcase-winter", "winter-vacation"]
const getEventSlugs = (event) => {
  const out = [];
  if (event?.id) out.push(String(event.id).trim().toLowerCase());
  const titleSlug = (event?.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (titleSlug) out.push(titleSlug);
  return out.filter((s, i, a) => s && a.indexOf(s) === i);
};

// Per-event files first (BG ONLY), so each event can have its own artwork
// and we never force the same whole file on every card of a theme.
// Convention: public/bg/event-<id>.png, public/bg/event-<title-slug>.png
// Example: "Winter Vacation" -> /bg/event-winter-vacation.png
// (+ /bg/event-winter-vaccation.png typo variant covered in theme lists)
const getPerEventCandidates = (event) => {
  const slugs = getEventSlugs(event);
  const files = [];
  for (const slug of slugs) {
    files.push(
      `/bg/event-${slug}.png`,
      `/bg/${slug}.png`
    );
  }
  if (event?.artwork_file) files.unshift(event.artwork_file);
  return files.filter((u, i, a) => u && a.indexOf(u) === i);
};

const getArtworkCandidates = (event, theme) => {
  const explicit = [
    event?.artwork_url,
    event?.side_image_url,
    event?.ai_image_url,
    event?.image_url,
    event?.icon_url,
    event?.event_type?.icon_url,
  ].filter(Boolean);
  // Per-event files BEFORE theme files: each event gets its own art.
  // Theme list is only the last-resort fallback when the event has no file.
  const perEvent = getPerEventCandidates(event);
  const themed = [
    theme?.artwork,
    ...(theme?.key ? ARTWORK_CANDIDATES[theme.key] || [] : []),
  ].filter(Boolean);
  // de-dupe, keep order
  return [...explicit, ...perEvent, ...themed].filter((u, i, a) => a.indexOf(u) === i);
};

// =============================
// Theme per event_type (matches screenshot UI)
// Holi -> white box dark text | Winter FEB 01 Sun -> light blue-grey dark text
// Summer FEB 10 Tue -> solid orange white text | Second Saturday FEB 13 Fri -> solid blue white text
// =============================
const getTheme = (typeName) => {
  const t = (typeName || '').toUpperCase().trim();

  if (t.includes('WINTER')) {
    return {
      key: 'winter',
      accent: '#0284C7',
      card: 'bg-[#eaf4ff] border-sky-100 hover:border-sky-200 hover:shadow-[0_8px_24px_rgb(2,132,199,0.12)]',
      dateBox: 'bg-gradient-to-b from-[#f4f8fc] via-[#e2eaf5] to-[#d2dfee] border border-slate-300 text-slate-900',
      dateBg: DATE_BG_BY_THEME.winter,
      dateOverlay: 'bg-white/55',
      dateTextMon: 'text-slate-600',
      dateTextDay: 'text-slate-900',
      dateTextWeek: 'text-slate-600',
      pill: 'bg-sky-100/90 text-sky-700 border-sky-200',
      dot: '#0284C7',
      emoji: '❄️',
      badgePrefix: '',
      badgeSuffix: '❄️',
      fallbackIcon: '/icons/dashboard.png',
      artwork: ARTWORK_BY_THEME.winter,
      splash: false,
    };
  }

  if (t.includes('SUMMER')) {
    return {
      key: 'summer',
      accent: '#EA580C',
      card: 'bg-[#fff1e3] border-orange-100 hover:border-orange-200 hover:shadow-[0_8px_24px_rgb(234,88,12,0.12)]',
      dateBox: 'bg-gradient-to-b from-orange-400 to-orange-500 border border-orange-400 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]',
      dateBg: DATE_BG_BY_THEME.summer,
      dateOverlay: 'bg-orange-950/30',
      dateTextMon: 'text-white/90',
      dateTextDay: 'text-white',
      dateTextWeek: 'text-white/90',
      pill: 'bg-orange-100 text-orange-800 border-orange-200',
      dot: '#EA580C',
      emoji: '🌴',
      badgePrefix: '',
      badgeSuffix: '🌴',
      fallbackIcon: '/icons/online_fee.png',
      artwork: ARTWORK_BY_THEME.summer,
      splash: false,
    };
  }

  if (t.includes('HOLIDAY')) {
    return {
      key: 'holiday',
      accent: '#D97706',
      card: 'bg-white border-slate-100 hover:border-amber-200 hover:shadow-[0_8px_24px_rgb(217,119,6,0.12)]',
      dateBox: 'bg-[#fffdf4] border border-amber-200 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]',
      dateBg: DATE_BG_BY_THEME.holiday,
      dateOverlay: 'bg-white/55',
      dateTextMon: 'text-slate-600',
      dateTextDay: 'text-slate-900',
      dateTextWeek: 'text-slate-600',
      pill: 'bg-amber-100 text-amber-800 border-amber-200',
      dot: '#D97706',
      emoji: '🏖️',
      badgePrefix: '',
      badgeSuffix: '',
      fallbackIcon: '/icons/gallery.png',
      artwork: ARTWORK_BY_THEME.holiday,
      splash: true, // CSS Holi powder splash if no file found
    };
  }

  if (t.includes('SATURDAY') || t.includes('SECOND')) {
    return {
      key: 'saturday',
      accent: '#2563EB',
      card: 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-[0_8px_24px_rgb(37,99,235,0.12)]',
      dateBox: 'bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]',
      dateBg: DATE_BG_BY_THEME.saturday,
      dateOverlay: 'bg-blue-950/30',
      dateTextMon: 'text-white/90',
      dateTextDay: 'text-white',
      dateTextWeek: 'text-white/90',
      pill: 'bg-blue-50 text-blue-700 border-blue-100',
      dot: '#2563EB',
      emoji: '',
      badgePrefix: '',
      badgeSuffix: '',
      fallbackIcon: FALLBACK_ICON,
      artwork: ARTWORK_BY_THEME.saturday,
      splash: false,
    };
  }

  // default / general
  return {
    key: 'default',
    accent: '#4F46E5',
    card: 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-[0_8px_24px_rgb(79,70,229,0.10)]',
    dateBox: 'bg-indigo-50 border border-indigo-100 text-indigo-900',
    dateBg: DATE_BG_BY_THEME.default,
    dateOverlay: 'bg-white/55',
    dateTextMon: 'text-slate-600',
    dateTextDay: 'text-indigo-900',
    dateTextWeek: 'text-slate-600',
    pill: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    dot: '#4F46E5',
    emoji: '',
    badgePrefix: '',
    badgeSuffix: '',
    fallbackIcon: FALLBACK_ICON,
    artwork: ARTWORK_BY_THEME.default,
    splash: false,
  };
};

const getDateBgCandidates = (event, theme) => {
  const explicit = [
    event?.date_bg_url,
    event?.date_bg_image,
    event?.date_image_url,
  ].filter(Boolean);
  // date-* ONLY: /bg/date-<id>.png, /bg/date-<title-slug>.png
  // (+ vaccation typo variant). event-* files are never used here.
  const perEvent = [];
  for (const slug of getEventSlugs(event)) {
    perEvent.push(`/bg/date-${slug}.png`);
    if (slug.includes('vacation')) {
      perEvent.push(`/bg/date-${slug.replace(/vacation/g, 'vaccation')}.png`);
    }
  }
  if (event?.date_bg_file) perEvent.unshift(event.date_bg_file);
  const themed = [
    theme?.dateBg,
    ...(theme?.key ? DATE_BG_LEGACY[theme.key] || [] : []),
  ].filter(Boolean);
  return [...explicit, ...perEvent, ...themed].filter(
    (u, i, a) => a.indexOf(u) === i
  );
};

const DateBadge = ({ event, theme, dp }) => {
  const candidates = getDateBgCandidates(event, theme);
  const [idx, setIdx] = useState(0);

  // Keep in sync when event/theme changes (e.g. API loads after showcase).
  useEffect(() => {
    setIdx(0);
  }, [event?.id, theme?.key]);

  const src = candidates[idx] || null;
  const showImg = Boolean(src);

  const handleImgError = () => setIdx((i) => i + 1);

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-[56px] h-[66px] flex-shrink-0 rounded-xl overflow-hidden shadow-sm ring-1 ring-black/10 ${theme.dateBox}`}
    >
      {/* BG image behind the date text (FEB / 01 / Sun) — vivid but scrimmed */}
      {showImg ? (
        <>
          <img
            src={src}
            alt=""
            aria-hidden
            loading="lazy"
            onError={handleImgError}
            className="absolute inset-0 w-full h-full object-cover opacity-80 saturate-150 contrast-[1.08]"
          />
          {/* Strong readability scrim (per-theme: white for dark text, dark for white text) */}
          <div className={`absolute inset-0 ${theme.dateOverlay || 'bg-white/55'}`} />
          <div className="absolute inset-0 backdrop-blur-[1px] pointer-events-none" />
          {/* Bottom shade for depth + punch */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
        </>
      ) : (
        /* Subtle paper texture + top gloss so light boxes match the FEB 01 Sun chip */
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 55%)',
          }}
        />
      )}

      {/* Date text above the bg — extra-bold high-contrast + shadow */}
      <span className={`relative z-10 text-[11px] font-extrabold tracking-widest leading-none mt-1.5 drop-shadow ${theme.dateTextMon || ''}`}>
        {dp.mon}
      </span>
      <span className={`relative z-10 text-[22px] font-black leading-none my-0.5 drop-shadow ${theme.dateTextDay || ''}`}>
        {dp.day}
      </span>
      <span className={`relative z-10 text-[11px] font-bold leading-none mb-1.5 drop-shadow ${theme.dateTextWeek || ''}`}>
        {dp.weekday || ''}
      </span>
    </div>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getDayParts = (dateStr) => {
  if (!dateStr) return { day: '--', mon: '---', weekday: '' };
  const d = new Date(dateStr);
  if (isNaN(d)) return { day: '--', mon: '---', weekday: '' };
  return {
    day: d.toLocaleDateString('en-GB', { day: '2-digit' }),
    mon: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
    weekday: d.toLocaleDateString('en-GB', { weekday: 'short' }),
  };
};

const formatSingleTime = (t) => {
  if (!t) return '';
  const s = String(t).trim();
  // already like "12:34 PM"
  if (/[AP]M/i.test(s)) return s;
  // "12:34:00" / "12:34"
  const m = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!m) return s;
  let h = parseInt(m[1], 10);
  const min = m[2];
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${min} ${ampm}`;
};

const buildDisplayTime = (event) => {
  if (event?.display_time?.trim()) return event.display_time.trim();
  const st = formatSingleTime(event?.start_time);
  const et = formatSingleTime(event?.end_time);
  if (st && et) return `${st} - ${et}`;
  if (st) return st;
  return '10:00 AM - 12:00 PM';
};

const normalizeApiEvent = (event) => {
  const e = event || {};
  // Backend may send event_type as a string ("Holiday") or object ({name}).
  const eventType =
    typeof e.event_type === 'string'
      ? { name: e.event_type }
      : e.event_type || { name: 'General', color: '#6366F1' };
  return {
    id: e.id,
    title: e.title || e.name || 'Untitled Event',
    titleEmoji: e.titleEmoji || '',
    description: e.description || 'An engaging event with school participation.',
    event_type: eventType,
    start_date: e.start_date || e.from_date || e.date || null,
    end_date: e.end_date || e.to_date || e.start_date || e.from_date || e.date || null,
    start_time: e.start_time || e.from_time || '',
    end_time: e.end_time || e.to_time || '',
    display_time: buildDisplayTime(e),
    venue: e.venue || e.location || 'Main Campus Grounds',
    // future AI image fields – passed through, fallback handled in UI
    ai_image_url: e.ai_image_url || null,
    image_url: e.image_url || null,
    icon_url: e.icon_url || null,
    artwork_url: e.artwork_url || null,
    side_image_url: e.side_image_url || null,
    // per-event file override: public/bg/event-<id>.png (container wash)
    artwork_file: e.artwork_file || null,
    // date badge bg behind FEB / 01 / Sun – date-* ONLY, backend can send per-event image
    date_bg_url: e.date_bg_url || e.date_bg_image || e.date_image_url || null,
    date_bg_file: e.date_bg_file || null,
  };
};

// =============================
// Showcase dummy data (matches screenshot UI)
// Suppose backend data is not there – team demo only.
// =============================
const showcaseEvents = [
  {
    id: 'showcase-holi',
    title: 'Holi',
    titleEmoji: '🪔',
    description: 'Holi Celebration',
    event_type: { name: 'HOLIDAY', color: '#D97706' },
    start_date: '2026-02-23',
    end_date: '2026-02-23',
    display_time: '12:34 PM - 6:34 PM',
    venue: 'Main Campus Grounds',
    ai_image_url: null, // future: backend/AI will send image url here
    image_url: null,
    icon_url: null,
    artwork_file: '/bg/event-holi.png', // BG-only fallback (per-event file)
  },
  {
    id: 'showcase-winter',
    title: 'Winter Vacation',
    titleEmoji: '❄️',
    description: 'Test',
    event_type: { name: 'WINTER VACATION', color: '#0284C7' },
    start_date: '2026-02-01',
    end_date: '2026-02-13',
    display_time: '6:11 PM - 4:11 PM',
    venue: 'Main Campus Grounds',
    ai_image_url: null,
    image_url: null,
    icon_url: null,
    artwork_file: '/bg/event-winter-vacation.png', // BG-only fallback (per-event file)
  },
  {
    id: 'showcase-summer',
    title: 'Summer Vacation',
    titleEmoji: '🌴',
    description: 't',
    event_type: { name: 'SUMMER VACATION', color: '#EA580C' },
    start_date: '2026-02-10',
    end_date: '2026-02-13',
    display_time: '12:33 PM - 12:53 PM',
    venue: 'Main Campus Grounds',
    ai_image_url: null,
    image_url: null,
    icon_url: null,
    artwork_file: '/bg/event-summer-vacation.png', // BG-only fallback (per-event file)
  },
  {
    id: 'showcase-second-sat',
    title: 'Second saturday',
    titleEmoji: '',
    description: 'test',
    event_type: { name: 'SECOND SATURDAY', color: '#2563EB' },
    start_date: '2026-02-13',
    end_date: '2026-02-13',
    display_time: '12:39 PM - 6:39 PM',
    venue: 'Main Campus Grounds',
    ai_image_url: null,
    image_url: null,
    icon_url: null,
    artwork_file: '/bg/event-second-saturday.png', // BG-only fallback (per-event file)
  },
];

// =============================
// Subtle card BG: same artwork files, but soft background wash
// instead of a hard solid right-aligned box.
// =============================
const CardSubtleBg = ({ event, theme }) => {
  const candidates = getArtworkCandidates(event, theme);
  const [idx, setIdx] = useState(0);

  // Reset when event/theme changes (API loads after showcase, etc.)
  useEffect(() => {
    setIdx(0);
  }, [event?.id, theme?.key]);

  const src = candidates[idx] || null;

  // No file -> very soft theme tint wash (keeps cards airy, no hard box)
  if (!src) {
    if (theme?.splash) {
      return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-8 -top-10 w-44 h-44 rounded-full bg-cyan-300/30 blur-2xl" />
          <div className="absolute right-6 top-6 w-24 h-24 rounded-full bg-yellow-300/30 blur-xl" />
          <div className="absolute right-0 bottom-0 w-36 h-36 rounded-full bg-pink-400/25 blur-2xl" />
        </div>
      );
    }
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 100% at 100% 0%, ${theme?.accent || '#6366F1'}24 0%, transparent 55%)`,
        }}
      />
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* artwork wash with pop — wider, punchier, still faded at text edge */}
      <img
        key={src}
        src={src}
        alt=""
        loading="lazy"
        onError={() => setIdx((i) => i + 1)}
        className="absolute -right-4 top-0 h-full w-[60%] object-cover object-right opacity-[0.26] saturate-125 contrast-[1.05]"
        style={{
          maskImage: 'linear-gradient(to left, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to left, black 55%, transparent 100%)',
        }}
      />
      {/* veil keeps title / time / venue legible over the stronger wash */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-white/15" />
    </div>
  );
};

// =============================
// Component
// =============================
const UpcomingEvent = ({ context }) => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const profileId = context?.profileId;
  const session = context?.session;

  const fetchEvents = async () => {
    try {
      const resp = await getEvents(profileId, session);
      // Primary shape (same as /dashboard/calendar): data.results.events.
      // Fallbacks for API variations so live rows never silently vanish.
      const results = resp?.data?.results;
      const fetched =
        results?.events ||
        resp?.data?.events ||
        (Array.isArray(results) ? results : []);
      setEvents(Array.isArray(fetched) ? fetched : []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Context comes from session cache; skip + show showcase until ids exist,
    // then load live and re-run if ids change (same guard as calendar page).
    if (!profileId || !session) {
      setIsLoading(false);
      return;
    }
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId, session]);

  const apiEvents = events.map(normalizeApiEvent);

  // Always: ALL live API events + our hardcoded showcase cards, same styling.
  const displayEvents = [...apiEvents, ...showcaseEvents];

  // =============================
  // Render
  // =============================
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
      {/* Accent top bar */}
      <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />
      {/* Soft glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-indigo-100/60 blur-3xl" />

      <div className="p-5 sm:p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2.5">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20">
              <CalendarDays className="w-[18px] h-[18px]" />
            </span>
            <span>
              <span className="block text-[15px] font-bold text-slate-900 leading-tight tracking-tight">
                Upcoming Events
              </span>
              <span className="block text-[11px] font-medium text-slate-400">
                {isLoading ? 'Fetching schedule…' : `${displayEvents.length} scheduled`}
              </span>
            </span>
          </h2>
          <span className="inline-flex items-center text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse mr-1.5" />
            Live
          </span>
        </div>

        {isLoading ? (
          <ChartLoadingSkeleton count={4} />
        ) : displayEvents.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/60">
            <span className="mx-auto mb-3 grid place-items-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100">
              <CalendarDays className="w-6 h-6 text-slate-300" />
            </span>
            <p className="text-sm font-semibold text-slate-700">No upcoming events</p>
            <p className="text-xs text-slate-400 mt-1">New events will appear here once scheduled.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-0.5">
            {displayEvents.map((event, index) => {
              const dp = getDayParts(event.start_date);
              const theme = getTheme(event.event_type?.name);
              const emoji = event.titleEmoji || theme.emoji || '';
              const isMultiDay =
                event.end_date && event.start_date !== event.end_date;
              return (
                <motion.div
                  key={event.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                  whileHover={{ x: 2 }}
                  className={`group relative flex gap-3 p-3 rounded-2xl border overflow-hidden transition-all duration-200 cursor-default ${theme.card}`}
                >
                  {/* Subtle artwork wash behind the whole card */}
                  <CardSubtleBg event={event} theme={theme} />

                  {/* Date badge with bg image behind FEB / 01 / Sun */}
                  <div className="relative z-10 flex-shrink-0">
                    <DateBadge event={event} theme={theme} dp={dp} />
                  </div>

                  {/* Content — bold, high-contrast, lifted off the wash */}
                  <div
                    className="relative z-10 flex-1 min-w-0"
                    style={{ textShadow: '0 1px 2px rgba(255,255,255,0.9)' }}
                  >
                    <p className="text-[15px] font-extrabold tracking-tight text-slate-900 leading-snug truncate">
                      {event.title}{' '}
                      {emoji && <span className="ml-0.5">{emoji}</span>}
                    </p>

                    <span
                      className={`inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-extrabold uppercase tracking-wider px-2 py-[3px] rounded-md border shadow backdrop-blur-sm ${theme.pill}`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: theme.dot }}
                      />
                      {theme.badgePrefix && (
                        <span className="leading-none">{theme.badgePrefix}</span>
                      )}
                      <span className="leading-none">
                        {event.event_type?.name || 'GENERAL'}
                      </span>
                      {theme.badgeSuffix && (
                        <span className="leading-none">{theme.badgeSuffix}</span>
                      )}
                    </span>

                    {event.description && (
                      <p className="text-[12px] font-semibold text-slate-700 mt-1.5 line-clamp-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" strokeWidth={2.5} />
                        <span className="truncate">{event.description}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[12px] font-bold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2.5} />
                        {event.display_time}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[12px] font-bold text-slate-700 max-w-full">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" strokeWidth={2.5} />
                        <span className="truncate">
                          {event.venue || 'Main Campus Grounds'}
                        </span>
                      </span>
                    </div>

                    {isMultiDay && (
                      <p className="text-[11px] text-slate-600 mt-1 font-bold">
                        {formatDate(event.start_date)} →{' '}
                        {formatDate(event.end_date)}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => router.push(`/dashboard/calendar`)}
          className="group cursor-pointer w-full mt-5 inline-flex items-center justify-center gap-1.5 text-[13px] font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl py-2.5 shadow-md shadow-blue-600/20 hover:shadow-lg transition-all active:scale-[0.99]"
        >
          <CalendarDays className="w-4 h-4 opacity-80 group-hover:rotate-6 transition-transform" />
          View Full Calendar
          <span aria-hidden className="group-hover:translate-x-0.5 transition-transform">
            →
          </span>
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvent;
