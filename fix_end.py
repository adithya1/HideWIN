def fix_end():
    with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
        text = f.read()
    
    # We want to replace everything from the end of the grid block to the end of the file
    # The grid block ends with the map function:
    #                             `)}
    #                         </div>
    #                     </div>
    #                 `}
    
    idx_map_end = text.rfind("`)}")
    if idx_map_end == -1:
        print("Could not find map end")
        return

    # Let's find the closing of the inner ternary after the map end
    idx_inner_ternary_end = text.find("`}", idx_map_end)
    if idx_inner_ternary_end == -1:
        print("Could not find inner ternary end")
        return

    # Now we slice off everything after idx_inner_ternary_end + 2
    # and replace it with the correct closing tags.
    # We need:
    # 1. To close the <div style="flex: 1; overflow-y: auto;">
    # 2. To close the OUTER ternary: `}
    # 3. To close the <div class="notes-container">
    # 4. To close the html` string: `;
    # 5. To close the render() method: }
    # 6. To close the class: }
    # 7. customElements.define(...)
    
    correct_end = """
                    </div>
                `}
            </div>
        `;
    }
}

customElements.define('notes-view', NotesView);
"""
    
    new_text = text[:idx_inner_ternary_end + 2] + correct_end

    with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
        f.write(new_text)
    
    print("Fixed end of file perfectly!")

fix_end()
