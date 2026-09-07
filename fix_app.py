def patch():
    with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
        text = f.read()

    # The corrupted string
    bad_str = '@minimize= @maximize= @close-notes'
    good_str = '@minimize=${() => this._handleMinimize()} @maximize=${() => this._handleMaximize()} @close-notes'

    if bad_str in text:
        text = text.replace(bad_str, good_str)
        with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
            f.write(text)
        print("Fixed HideWinApp.js")
    else:
        print("Bad string not found in HideWinApp.js")

patch()
