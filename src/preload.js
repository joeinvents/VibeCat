const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('cat', {
  onShow: (fn) => ipcRenderer.on('show', (_e, text) => fn(text)),
  onHide: (fn) => ipcRenderer.on('hide', () => fn())
});
