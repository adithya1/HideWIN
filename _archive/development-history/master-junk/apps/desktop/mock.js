global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    require: () => ({ ipcRenderer: { invoke: () => {} } }),
    hideWin: { storage: { getNotes: async () => [] } }
};
global.document = {
    addEventListener: () => {},
    removeEventListener: () => {}
};
global.customElements = {
    define: () => {}
};
global.HTMLElement = class HTMLElement {};
import('./src/components/views/MainView.js').then(() => console.log('OK')).catch(e => console.error('Caught:', e));
