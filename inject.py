import re

with open('C:/Users/aksak/Documents/antigravity/eager-tesla/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

def inject_html(lang, html_content, snippet):
    # Find the start of the language tab
    tab_start = html_content.find(f'id="content-{lang}"')
    if tab_start == -1:
        print(f"Tab {lang} not found")
        return html_content
    
    # Find the quiz section within this tab
    quiz_start = html_content.find('      <!-- Quiz Section -->', tab_start)
    if quiz_start == -1:
        print(f"Quiz {lang} not found")
        return html_content
        
    return html_content[:quiz_start] + snippet + '\n' + html_content[quiz_start:]

with open('python_ext.html', 'r', encoding='utf-8') as f:
    python_ext = f.read()
with open('react_ext.html', 'r', encoding='utf-8') as f:
    react_ext = f.read()
with open('ts_ext.html', 'r', encoding='utf-8') as f:
    ts_ext = f.read()

html = inject_html('python', html, python_ext)
html = inject_html('react', html, react_ext)
html = inject_html('typescript', html, ts_ext)

with open('C:/Users/aksak/Documents/antigravity/eager-tesla/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Injected extensions into index.html")
