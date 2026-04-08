import { addMonths, format, isBefore, isSameDay, parse, parseISO } from "date-fns";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Selection = {
  start: string | null;
  end: string | null;
};

type CalendarState = {
  currentMonth: string;
  selection: Selection;
  activeDate: string | null;
  notes: Record<string, string>;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
  pickDay: (day: Date) => void;
  setNote: (isoDate: string, value: string) => void;
};

const monthKey = (date: Date) => format(date, "yyyy-MM");
const monthFromKey = (key: string) => parse(key, "yyyy-MM", new Date());
const dayKey = (date: Date) => format(date, "yyyy-MM-dd");

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      currentMonth: monthKey(new Date()),
      selection: { start: null, end: null },
      activeDate: null,
      notes: {},
      goToPreviousMonth: () => {
        const prev = addMonths(monthFromKey(get().currentMonth), -1);
        set({ currentMonth: monthKey(prev), activeDate: null });
      },
      goToNextMonth: () => {
        const next = addMonths(monthFromKey(get().currentMonth), 1);
        set({ currentMonth: monthKey(next), activeDate: null });
      },
      goToToday: () => {
        const today = new Date();
        const todayIso = dayKey(today);
        set({
          currentMonth: monthKey(today),
          selection: { start: todayIso, end: null },
          activeDate: todayIso
        });
      },
      pickDay: (day: Date) => {
        const selected = dayKey(day);
        const { selection } = get();

        if (!selection.start || selection.end) {
          set({ selection: { start: selected, end: null }, activeDate: selected });
          return;
        }

        const startDate = parseISO(selection.start);
        if (isBefore(day, startDate)) {
          set({ selection: { start: selected, end: null }, activeDate: selected });
          return;
        }

        if (isSameDay(day, startDate)) {
          set({ selection: { start: selected, end: selected }, activeDate: selected });
          return;
        }

        set({ selection: { start: selection.start, end: selected }, activeDate: selected });
      },
      setNote: (isoDate, value) => {
        set((state) => ({ notes: { ...state.notes, [isoDate]: value } }));
      }
    }),
    {
      name: "wall-calendar-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ notes: state.notes })
    }
  )
);
