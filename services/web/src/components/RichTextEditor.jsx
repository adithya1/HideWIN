import React, { useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: '4px', padding: '8px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <button type="button" onClick={() => execCommand('bold')} className="btn-icon" title="Bold"><Bold size={16} /></button>
        <button type="button" onClick={() => execCommand('italic')} className="btn-icon" title="Italic"><Italic size={16} /></button>
        <button type="button" onClick={() => execCommand('underline')} className="btn-icon" title="Underline"><Underline size={16} /></button>
        <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="btn-icon" title="Bullet List"><List size={16} /></button>
        <button type="button" onClick={() => execCommand('insertOrderedList')} className="btn-icon" title="Numbered List"><ListOrdered size={16} /></button>
        <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
        <button type="button" onClick={() => execCommand('justifyLeft')} className="btn-icon"><AlignLeft size={16} /></button>
        <button type="button" onClick={() => execCommand('justifyCenter')} className="btn-icon"><AlignCenter size={16} /></button>
        <button type="button" onClick={() => execCommand('justifyRight')} className="btn-icon"><AlignRight size={16} /></button>
      </div>
      <div 
        ref={editorRef}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ padding: '16px', minHeight: '200px', outline: 'none', background: 'var(--background)' }}
      />
    </div>
  );
}
