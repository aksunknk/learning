with open('C:/Users/aksak/Documents/antigravity/eager-tesla/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Update Header Stats
html = html.replace('<span class="stat-number">20</span>\\n          <span class="stat-label">レッスン</span>', '<span class="stat-number">32</span>\\n          <span class="stat-label">レッスン</span>')
html = html.replace('<span class="stat-number">24</span>\\n          <span class="stat-label">クイズ</span>', '<span class="stat-number">36</span>\\n          <span class="stat-label">クイズ</span>')

# Update hardcoded 0/5 to 0/9 in index.html for progress cards
html = html.replace('<span class="progress-count" id="python-progress-count">0/5</span>', '<span class="progress-count" id="python-progress-count">0/9</span>')
html = html.replace('<span class="progress-count" id="react-progress-count">0/5</span>', '<span class="progress-count" id="react-progress-count">0/9</span>')
html = html.replace('<span class="progress-count" id="typescript-progress-count">0/5</span>', '<span class="progress-count" id="typescript-progress-count">0/9</span>')

with open('C:/Users/aksak/Documents/antigravity/eager-tesla/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html stats and progress counts")
