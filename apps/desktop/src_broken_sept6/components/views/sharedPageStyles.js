import { css } from '../../assets/lit-core-2.7.4.min.js';

export const unifiedPageStyles = css`

/* POSH LEAN SCROLLBAR */
::-webkit-scrollbar { width: 6px !important; height: 6px !important; background-color: transparent !important; }
::-webkit-scrollbar-track { background: transparent !important; }
::-webkit-scrollbar-thumb { background-color: #d4d4d8 !important; border-radius: 10px !important; }
::-webkit-scrollbar-thumb:hover { background-color: #a1a1aa !important; }
::-webkit-scrollbar-button:single-button:vertical:decrement { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a1a1aa'><path d='M7 14l5-5 5 5z'/></svg>") !important; background-size: 8px !important; background-position: center !important; background-repeat: no-repeat !important; height: 12px !important; display: block !important; }
::-webkit-scrollbar-button:single-button:vertical:increment { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a1a1aa'><path d='M7 10l5 5 5-5z'/></svg>") !important; background-size: 8px !important; background-position: center !important; background-repeat: no-repeat !important; height: 12px !important; display: block !important; }

        `;
