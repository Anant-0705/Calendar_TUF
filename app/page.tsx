import { CalendarWall } from "@/components/calendar-wall";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#f5f5f5,transparent_45%),radial-gradient(circle_at_80%_0%,#e1e1e1,transparent_40%),linear-gradient(160deg,#f8f8f8_0%,#ececec_55%,#dfdfdf_100%)] px-4 py-8 sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22 viewBox=%220%200%20120%20120%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23979797%22 fill-opacity=%220.08%22%3E%3Cpath d=%22M36 34h8v8h-8zM72 58h10v10H72zM8 82h6v6H8zM98 10h7v7h-7z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      <CalendarWall />
    </main>
  );
}
