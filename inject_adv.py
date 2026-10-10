import re

with open('C:/Users/aksak/Documents/antigravity/eager-tesla/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

def inject_html(lang, html_content, snippet):
    tab_start = html_content.find(f'id="content-{lang}"')
    if tab_start == -1:
        return html_content
    
    quiz_start = html_content.find('      <!-- Quiz Section -->', tab_start)
    if quiz_start == -1:
        return html_content
        
    return html_content[:quiz_start] + snippet + '\n' + html_content[quiz_start:]

with open('python_adv.html', 'r', encoding='utf-8') as f:
    python_ext = f.read()
with open('react_adv.html', 'r', encoding='utf-8') as f:
    react_ext = f.read()
with open('ts_adv.html', 'r', encoding='utf-8') as f:
    ts_ext = f.read()

html = inject_html('python', html, python_ext)
html = inject_html('react', html, react_ext)
html = inject_html('typescript', html, ts_ext)

# Update Stats
html = html.replace('<span class="stat-number">32</span>\\n          <span class="stat-label">レッスン</span>', '<span class="stat-number">38</span>\\n          <span class="stat-label">レッスン</span>')
html = html.replace('<span class="stat-number">36</span>\\n          <span class="stat-label">クイズ</span>', '<span class="stat-number">42</span>\\n          <span class="stat-label">クイズ</span>')

html = html.replace('<span class="progress-count" id="python-progress-count">0/9</span>', '<span class="progress-count" id="python-progress-count">0/11</span>')
html = html.replace('<span class="progress-count" id="react-progress-count">0/9</span>', '<span class="progress-count" id="react-progress-count">0/11</span>')
html = html.replace('<span class="progress-count" id="typescript-progress-count">0/9</span>', '<span class="progress-count" id="typescript-progress-count">0/11</span>')

with open('C:/Users/aksak/Documents/antigravity/eager-tesla/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Injected extensions and updated stats")
