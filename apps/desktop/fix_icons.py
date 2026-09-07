import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    app_code = f.read()

# Hamburger icon
old_hamburger = """<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">"""
new_hamburger = """<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">"""
app_code = app_code.replace(old_hamburger, new_hamburger)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(app_code)


with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    main_code = f.read()

# Close button icon in sheets
old_close = """<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">"""
new_close = """<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">"""
main_code = main_code.replace(old_close, new_close)

# Chevron icon in list rows
old_chevron = """<svg class="mobile-field-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">"""
new_chevron = """<svg class="mobile-field-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">"""
main_code = main_code.replace(old_chevron, new_chevron)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(main_code)

print("Standardized SVG icon properties.")
