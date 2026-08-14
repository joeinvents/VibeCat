const { app, BrowserWindow, Tray, Menu, screen, nativeImage } = require('electron');
const path = require('path');
const affirmations = require('./affirmations');

const WIDTH = 340;
const HEIGHT = 320;
const MARGIN = 16;
const INTERVAL_MS = 1_800_000; //30 minutes
const VISIBLE_MS = 10_000; //10 seconds
const SLIDE_MS = 650;

let win = null;
let tray = null;
let cycleTimer = null;
let hideTimer = null;
let settleTimer = null;
let paused = false;
let lastIndex = -1;

if (!app.requestSingleInstanceLock()) app.quit();

function pick() {
  let i = lastIndex;
  while (i === lastIndex) i = Math.floor(Math.random() * affirmations.length);
  lastIndex = i;
  return affirmations[i];
}

function positionWindow() {
  const { workArea } = screen.getPrimaryDisplay();
  win.setBounds({
    x: workArea.x + workArea.width - WIDTH - MARGIN,
    y: workArea.y + workArea.height - HEIGHT - MARGIN,
    width: WIDTH,
    height: HEIGHT
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    focusable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });

  win.setAlwaysOnTop(true, 'floating');
  // Clicks fall through to whatever is underneath, so it never interrupts work.
  win.setIgnoreMouseEvents(true, { forward: true });
  win.loadFile(path.join(__dirname, 'overlay.html'));
}

function showAffirmation() {
  clearTimeout(hideTimer);
  clearTimeout(settleTimer);
  positionWindow();
  win.showInactive();
  win.webContents.send('show', pick());

  hideTimer = setTimeout(() => {
    win.webContents.send('hide');
    settleTimer = setTimeout(() => win.hide(), SLIDE_MS);
  }, VISIBLE_MS);
}

function startCycle() {
  clearInterval(cycleTimer);
  cycleTimer = setInterval(() => {
    if (!paused) showAffirmation();
  }, INTERVAL_MS);
}

function buildMenu() {
  return Menu.buildFromTemplate([
    { label: 'Show one now', click: () => showAffirmation() },
    {
      label: paused ? 'Resume' : 'Pause',
      click: () => {
        paused = !paused;
        if (paused) {
          clearTimeout(hideTimer);
          win.hide();
        }
        tray.setContextMenu(buildMenu());
      }
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
}

app.whenReady().then(() => {
  createWindow();

  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, '..', 'assets', 'tray.png')));
  tray.setToolTip('VibeCat');
  tray.setContextMenu(buildMenu());
  tray.on('double-click', () => showAffirmation());

  win.webContents.once('did-finish-load', () => {
    showAffirmation();
    startCycle();
  });
});

app.on('window-all-closed', (e) => e.preventDefault());
