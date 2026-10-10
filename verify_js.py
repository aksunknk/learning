with open('C:/Users/aksak/Documents/antigravity/eager-tesla/app.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

print("Py get() present:", "get() メソッドを使うと" in js_content)
print("React useEffect present:", "初回マウント時のみ実行される" in js_content)
print("TS any present:", "事前エラー検知" in js_content)
