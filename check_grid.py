def check():
    with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
        text = f.read()

    start = text.find('${filteredNotes.length === 0 ? html`')
    end = text.find('`)}\n                        </div>\n                    </div>\n                </div>')
    
    if start != -1 and end != -1:
        end += 85
        print(f"Found block: {start} to {end}")
        print("Last chars:", text[end-50:end])
    else:
        print("Not found")

check()
