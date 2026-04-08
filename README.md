# Wall Calendar (Next.js)

A modern wall-style calendar recreated with a production-friendly React stack.

## Why This Stack

- **Next.js (App Router):** Fast React baseline with good routing and build performance out of the box.
- **TypeScript:** Keeps calendar and date-range state predictable and safer to refactor.
- **Tailwind CSS:** Makes custom geometric styling and responsive layout quick to build.
- **Framer Motion:** Powers the polaroid fan-out and smooth month transition animations.
- **Lucide React:** Clean icon set for navigation and notes UI.
- **date-fns:** Reliable month-grid and date-range calculations.
- **Zustand:** Lightweight state store with local persistence for notes.

## Features

- Month navigation (previous, next, today)
- Date-range selection (`start` and `end`)
- In-range highlighting for dates between start and end
- Notes per date with local persistence
- Animated polaroid stack and month transitions
- Responsive layout for desktop and mobile

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Open in browser:

- `http://localhost:3000`

## Production Checks

```bash
npm run lint
npm run build
npm run start
```
