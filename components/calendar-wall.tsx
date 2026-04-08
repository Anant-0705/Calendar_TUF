"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfMonth,
  startOfWeek
} from "date-fns";
import { ChevronLeft, ChevronRight, PencilLine } from "lucide-react";
import { useMemo, useState } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCalendarStore } from "@/lib/calendar-store";

type PolaroidScene = {
  id: string;
  caption: string;
  gradient: string;
};

type Season = "winter" | "spring" | "summer" | "autumn";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const seasonalImageMap: Record<Season, string> = {
  winter: "/Winter.png",
  spring: "/sakura.png",
  summer: "/Summer.png",
  autumn: "/Autumn.png"
};

const seasonByMonth: Season[] = [
  "winter",
  "winter",
  "spring",
  "spring",
  "spring",
  "summer",
  "summer",
  "summer",
  "autumn",
  "autumn",
  "autumn",
  "winter"
];

const sceneSet = (monthLabel: string): PolaroidScene[] => [
  {
    id: "sunset",
    caption: "Golden Hour",
    gradient: "bg-[linear-gradient(180deg,#d4734e_55%,#f0a85e_80%,#f5d498_100%)]"
  },
  {
    id: "forest",
    caption: "Pine Mist",
    gradient: "bg-[linear-gradient(180deg,#6f756d_0%,#8d9688_40%,#a9afa4_75%,#ced1c9_100%)]"
  },
  {
    id: "month",
    caption: monthLabel,
    gradient: "bg-[linear-gradient(180deg,#788090_0%,#9ea7b7_32%,#bab7b1_60%,#8b9082_100%)]"
  }
];

const fanout = [
  { rotate: -11, x: -22, y: 22, zIndex: 1 },
  { rotate: 5, x: 14, y: 10, zIndex: 2 },
  { rotate: -2, x: 4, y: -4, zIndex: 3 }
];

export function CalendarWall() {
  const {
    currentMonth,
    selection,
    activeDate,
    notes,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    pickDay,
    setNote
  } = useCalendarStore();

  const [saved, setSaved] = useState(false);

  const monthDate = useMemo(() => parse(currentMonth, "yyyy-MM", new Date()), [currentMonth]);
  const season = seasonByMonth[monthDate.getMonth()];
  const seasonImage = seasonalImageMap[season];
  const monthTitle = format(monthDate, "MMMM");
  const yearTitle = format(monthDate, "yyyy");

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const layerXFar = useSpring(useTransform(pointerX, [-1, 1], [-12, 12]), {
    stiffness: 120,
    damping: 25,
    mass: 0.5
  });
  const layerYFar = useSpring(useTransform(pointerY, [-1, 1], [-7, 7]), {
    stiffness: 120,
    damping: 25,
    mass: 0.5
  });

  const layerXMid = useSpring(useTransform(pointerX, [-1, 1], [-24, 24]), {
    stiffness: 110,
    damping: 22,
    mass: 0.52
  });
  const layerYMid = useSpring(useTransform(pointerY, [-1, 1], [-12, 12]), {
    stiffness: 110,
    damping: 22,
    mass: 0.52
  });

  const layerXNear = useSpring(useTransform(pointerX, [-1, 1], [-34, 34]), {
    stiffness: 100,
    damping: 20,
    mass: 0.55
  });
  const layerYNear = useSpring(useTransform(pointerY, [-1, 1], [-18, 18]), {
    stiffness: 100,
    damping: 20,
    mass: 0.55
  });

  const days = useMemo(() => {
    const first = startOfWeek(startOfMonth(monthDate));
    const last = endOfWeek(endOfMonth(monthDate));
    return eachDayOfInterval({ start: first, end: last });
  }, [monthDate]);

  const startDate = selection.start ? parseISO(selection.start) : null;
  const endDate = selection.end ? parseISO(selection.end) : null;

  const noteTarget = activeDate ?? selection.start;
  const noteValue = noteTarget ? notes[noteTarget] ?? "" : "";

  const onChangeNote = (value: string) => {
    if (!noteTarget) {
      return;
    }

    setNote(noteTarget, value);
    setSaved(true);
    window.clearTimeout((onChangeNote as typeof onChangeNote & { timer?: number }).timer);
    (onChangeNote as typeof onChangeNote & { timer?: number }).timer = window.setTimeout(() => {
      setSaved(false);
    }, 1200);
  };

  const scenes = sceneSet(`${monthTitle} ${yearTitle}`);

  const handleParallaxMove: React.MouseEventHandler<HTMLElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    pointerX.set(Math.max(-1, Math.min(1, x)));
    pointerY.set(Math.max(-1, Math.min(1, y)));
  };

  const resetParallax = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      onMouseMove={handleParallaxMove}
      onMouseLeave={resetParallax}
      className="relative isolate min-h-screen w-full"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={season}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.06)_50%,rgba(0,0,0,0.07)_100%)]" />

          <motion.div
            style={{ x: layerXFar, y: layerYFar }}
            className="absolute inset-x-[-18%] bottom-[28vh] h-[34vh] opacity-32 md:inset-x-[-14%] md:bottom-[26vh] md:h-[32vh] md:opacity-24"
          >
            <div
              className="h-full w-full bg-contain bg-bottom bg-repeat-x"
              style={{
                backgroundImage: `url(${seasonImage})`,
                backgroundSize: "clamp(260px, 34vw, 480px) auto",
                maskImage: "linear-gradient(to top, black 10%, transparent 98%)"
              }}
            />
          </motion.div>

          <motion.div
            style={{ x: layerXMid, y: layerYMid }}
            className="absolute inset-x-[-20%] bottom-[14vh] h-[40vh] opacity-44 md:inset-x-[-16%] md:bottom-[11vh] md:h-[38vh] md:opacity-34"
          >
            <div
              className="h-full w-full bg-contain bg-bottom bg-repeat-x"
              style={{
                backgroundImage: `url(${seasonImage})`,
                backgroundSize: "clamp(320px, 42vw, 620px) auto",
                maskImage: "linear-gradient(to top, black 20%, transparent 100%)"
              }}
            />
          </motion.div>

          <motion.div
            style={{ x: layerXNear, y: layerYNear }}
            className="absolute inset-x-[-24%] -bottom-[3vh] h-[48vh] opacity-62 md:inset-x-[-20%] md:-bottom-[2vh] md:h-[46vh] md:opacity-44"
          >
            <div
              className="h-full w-full bg-contain bg-bottom bg-repeat-x"
              style={{
                backgroundImage: `url(${seasonImage})`,
                backgroundSize: "clamp(420px, 54vw, 820px) auto",
                maskImage: "linear-gradient(to top, black 28%, transparent 100%)"
              }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 pb-16 pt-8 md:flex-row md:items-start md:justify-center md:px-8 md:pt-14">
        <div className="relative h-[330px] w-[250px] sm:h-[360px] sm:w-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMonth}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {scenes.map((scene, index) => (
              <motion.article
                key={scene.id}
                initial={{ rotate: 0, x: 0, y: 0, opacity: 0, scale: 0.92 }}
                animate={{
                  rotate: fanout[index].rotate,
                  x: fanout[index].x,
                  y: fanout[index].y,
                  opacity: 1,
                  scale: 1,
                  zIndex: fanout[index].zIndex
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.07,
                  type: "spring",
                  stiffness: 125,
                  damping: 14
                }}
                whileHover={{ rotate: 0, y: -8, scale: 1.05, zIndex: 20 }}
                className="absolute left-0 top-0 w-[238px] cursor-pointer rounded-[2px] bg-[#fcfcfb] px-3 pb-10 pt-3 shadow-polaroid"
              >
                <div className={`${scene.gradient} h-40 w-full rounded-[2px] [clip-path:polygon(0_0,100%_0,100%_88%,0_100%)]`}>
                  <div className="h-full w-full bg-[radial-gradient(circle_at_12%_16%,rgba(255,255,255,0.22),transparent_45%),radial-gradient(circle_at_82%_82%,rgba(0,0,0,0.18),transparent_42%)]" />
                </div>
                <p className="mt-3 text-center font-marker text-base tracking-wide text-[#202020]">{scene.caption}</p>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
        </div>

        <motion.div
          layout
          className="w-full max-w-[580px] rounded-2xl border border-[#dedede] bg-white/70 p-4 shadow-card backdrop-blur sm:p-6 md:bg-white/80"
        >
        <div className="mb-6 flex flex-col gap-3 border-b border-[#ececec] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentMonth}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
              className="text-3xl font-semibold leading-tight tracking-tight text-[#141414]"
            >
              {monthTitle} <span className="font-light text-[#666666]">{yearTitle}</span>
            </motion.h1>
          </AnimatePresence>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="rounded-xl border border-[#dfdfdf] p-1.5 text-[#222222] transition hover:-translate-y-[1px] hover:bg-[#f7f7f7] sm:p-2"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="whitespace-nowrap rounded-xl border border-[#202020] px-2.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#202020] transition hover:bg-[#202020] hover:text-white sm:px-3"
            >
              Today
            </button>
            <button
              type="button"
              onClick={goToNextMonth}
              className="rounded-xl border border-[#dfdfdf] p-1.5 text-[#222222] transition hover:-translate-y-[1px] hover:bg-[#f7f7f7] sm:p-2"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((name) => (
            <span
              key={name}
              className="pb-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#777777]"
            >
              {name}
            </span>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMonth}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-7 gap-1"
          >
            {days.map((day) => {
              const iso = format(day, "yyyy-MM-dd");
              const outside = !isSameMonth(day, monthDate);
              const activeEdge =
                (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate));
              const inRange =
                !!startDate && !!endDate && isAfter(day, startDate) && isBefore(day, endDate);
              const hasNote = !!notes[iso]?.trim();

              const base =
                "relative flex h-11 items-center justify-center rounded-xl text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f1f1f]/70";

              const tone = outside
                ? "text-[#c2c2c2]"
                : activeEdge
                  ? "bg-[#1f1f1f] text-white"
                  : inRange
                    ? "bg-[#ececec] text-[#111111]"
                    : isToday(day)
                      ? "border border-[#1f1f1f] text-[#111111]"
                      : "text-[#1d1d1d] hover:bg-[#f3f3f3]";

              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => pickDay(day)}
                  disabled={outside}
                  className={`${base} ${tone} ${outside ? "cursor-default" : "cursor-pointer"}`}
                >
                  {format(day, "d")}
                  {hasNote && (
                    <span
                      className={`absolute bottom-1 h-1 w-1 rounded-full ${
                        activeEdge ? "bg-white" : "bg-[#111111]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>

          <section className="mt-6 border-t border-[#ececec] pt-4">
          <header className="mb-2 flex items-center gap-2">
            <PencilLine size={16} className="text-[#666666]" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#666666]">Notes</h2>
            <span className="ml-auto text-xs text-[#2b2b2b]">
              {noteTarget ? format(parseISO(noteTarget), "MMM d, yyyy") : "Pick a day"}
            </span>
          </header>

          <textarea
            value={noteValue}
            onChange={(event) => onChangeNote(event.target.value)}
            disabled={!noteTarget}
            placeholder={noteTarget ? "Write something..." : "Select a day to write notes"}
            className="paper-line min-h-28 w-full resize-none rounded-lg border border-transparent bg-transparent px-1 py-1 font-note text-2xl leading-8 text-[#191919] outline-none placeholder:text-[#b0b0b0] disabled:cursor-not-allowed disabled:opacity-70"
          />

          <p
            className={`mt-1 text-right text-[11px] text-[#9b9b9b] transition-opacity ${
              saved ? "opacity-100" : "opacity-0"
            }`}
          >
            Saved locally
          </p>
          </section>
        </motion.div>
      </div>
    </section>
  );
}
