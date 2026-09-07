import os

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

broken_block = """        acceptParticipant(id) {
        this.participants = this.participants.map(p => 
            p.id === id ? { ...p, role: 'Participant', status: 'active' } : p
        );
        this.startScreenShare();
    } : p
        );
    }"""

fixed_block = """    acceptParticipant(id) {
        this.participants = this.participants.map(p => 
            p.id === id ? { ...p, role: 'Participant', status: 'active' } : p
        );
        this.startScreenShare();
    }"""

text = text.replace(broken_block, fixed_block)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Fixed syntax error in acceptParticipant!")
