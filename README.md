# VibeCat

> A cat pops up every half hour, holds up a sign that sends positive vibes, and leaves before you
> can argue with it.

VibeCat lives in your system tray. Every 30 minutes a small orange cat slides up from the bottom-right
corner holding a hand-lettered sign with a positive affirmation on it. Ten seconds later it slides
back down and leaves you alone.

That's it. That's the app.

Have a **pawsome** day :3

## Install + run

```bash
npm install -g vibecat
vibecat
```

Or don't commit to anything:

```bash
npx vibecat
```

Node.js 18+. Windows tested. macOS and Linux "should work (tm)".

## Run from source

```bash
git clone https://github.com/joeinvents/VibeCat.git vibecat
cd vibecat
npm install
npm start
```

## Controls

- **Right-click the tray icon** — show one now, pause, quit.
- **Double-click the tray icon** — summon a cat on demand, for when you need it early.
- **Everything else still works.** The overlay sets `setIgnoreMouseEvents(true, { forward: true })`,
  so your clicks pass straight through the cat to whatever's behind it. You cannot accidentally
  close the window you were working in because a cat was in the way.

## Tuning

Constants at the top of [`src/main.js`](src/main.js):

| Constant | What it does |
| --- | --- |
| `INTERVAL_MS` | How often the cat visits (default 30m) |
| `VISIBLE_MS` | How long it stays (default 10s) |
| `SLIDE_MS` | Animation duration — keep in sync with the CSS transition |
| `WIDTH` / `HEIGHT` | Overlay size |
| `MARGIN` | Gap from the screen corner |

## License

[MIT](LICENSE). It's a cat with a sign.