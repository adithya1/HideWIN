with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\db_models\__init__.py', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('"Meeting", "MeetingParticipant",', '"Meeting", "MeetingParticipant",\n    "EmailTemplate",')
with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\db_models\__init__.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added EmailTemplate to __all__")
