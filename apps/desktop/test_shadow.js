const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM(\<!DOCTYPE html><div id="host"></div>\);
const host = dom.window.document.getElementById('host');
const shadow = host.attachShadow({mode: 'open'});
try {
    dom.window.getComputedStyle(shadow);
    console.log('SUCCESS');
} catch(e) {
    console.log('ERROR: ' + e.message);
}
