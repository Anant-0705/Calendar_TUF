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
import { useCalendarStore } from "@/lib/calendar-store";

type PolaroidScene = {
  id: string;
  caption: string;
  gradient: string;
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const sceneSet = (monthLabel: string): PolaroidScene[] => [
  {
    id: "sunset",
    caption: "Golden Hour",
    gradient: "bg-[linear-gradient(180deg,#2c2a2a_0%,#676161_28%,#a39a8f_60%,#dfd2c4_100%)]"
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
  const monthTitle = format(monthDate, "MMMM");
  const yearTitle = format(monthDate, "yyyy");

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

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 md:flex-row md:items-start md:justify-center">
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
        className="w-full max-w-[580px] rounded-2xl border border-[#dedede] bg-white/80 p-6 shadow-card backdrop-blur"
      >
        <div className="mb-6 flex items-center justify-between border-b border-[#ececec] pb-4">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentMonth}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
              className="text-3xl font-semibold tracking-tight text-[#141414]"
            >
              {monthTitle} <span className="font-light text-[#666666]">{yearTitle}</span>
            </motion.h1>
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="rounded-xl border border-[#dfdfdf] p-2 text-[#222222] transition hover:-translate-y-[1px] hover:bg-[#f7f7f7]"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="rounded-xl border border-[#202020] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#202020] transition hover:bg-[#202020] hover:text-white"
            >
              Today
            </button>
            <button
              type="button"
              onClick={goToNextMonth}
              className="rounded-xl border border-[#dfdfdf] p-2 text-[#222222] transition hover:-translate-y-[1px] hover:bg-[#f7f7f7]"
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
    </section>
  );
}
