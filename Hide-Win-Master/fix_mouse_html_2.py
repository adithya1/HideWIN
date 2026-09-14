import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "<!-- Mouse Toggle (Centered with pointer-events fix and fixed width) -->"
end_marker = "<!-- Start/Active Buttons -->"

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    new_mouse_html = '''<!-- Mouse Toggle -->
                    <div class="mouse-toggle-wrapper stealth-tooltip" data-tooltip="Stealth Mode" @click= style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 8px; cursor: pointer;">
                        <span style="font-size: 13px; font-weight: 600; color: var(--text-primary); white-space: nowrap;">
                            
                        </span>
                        <div style="width: 42px; height: 22px; border-radius: 6px; background: ; border: 1px solid var(--border); position: relative; transition: all 0.3s ease; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1); flex-shrink: 0;">
                            <div style="width: 18px; height: 18px; border-radius: 4px; background: #ffffff; position: absolute; top: 1px; left: ; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
                                <div style="width: 10px; height: 10px; border-radius: 2px; background: ; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                                    <div style="width: 5px; height: 1.5px; background: #ffffff; border-radius: 1px; transform: rotate(-45deg);"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    '''
    
    content = content[:start_idx] + new_mouse_html + content[end_idx:]

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated HTML for Mouse Toggle precisely.")
