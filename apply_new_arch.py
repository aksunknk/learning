import re
import sys
import os

# 1. We will extract sn_quiz and sn_puzzle from gen_sn_content.py since they are defined there
with open('gen_sn_content.py', 'r', encoding='utf-8') as f:
    gen_content = f.read()

namespace = {}
cut_idx = gen_content.find("def generate_sn_html():")
if cut_idx != -1:
    exec_content = gen_content[:cut_idx]
    exec(exec_content, namespace)

lessons1 = namespace['lessons1']
lessons2 = namespace['lessons2']
sn_quiz = namespace['sn_quiz']
sn_puzzle = namespace['sn_puzzle']

html1 = "".join(lessons1)
html2 = "".join(lessons2)

with open('content/servicenow.html', 'w', encoding='utf-8') as f:
    f.write(html1)
with open('content/servicenow-csa.html', 'w', encoding='utf-8') as f:
    f.write(html2)
print("content HTML files generated.")

# Update app.js TABS
with open('app.js', 'r', encoding='utf-8') as f: js = f.read()
tabs_injection = """  servicenow:    { label: "ServiceNow",       short: "SN",     icon: "⚙️", group: "backend",   lessons: 10, accent: "#293e40",                glow: "rgba(41,62,64,0.35)" },
  "servicenow-csa": { label: "SN-CSA",  short: "CSA",    icon: "📜", group: "practice",  lessons: 10, accent: "#81b5a1",                glow: "rgba(129,181,161,0.35)" },"""
if 'servicenow:' not in js:
    js = js.replace('  capstone:      {', tabs_injection + '\n  capstone:      {')
    with open('app.js', 'w', encoding='utf-8') as f: f.write(js)
    print("app.js updated.")

# Update data/quizzes.js
with open('data/quizzes.js', 'r', encoding='utf-8') as f: qjs = f.read()
if '"servicenow":' not in qjs:
    # replace the last "];" or "};"
    qjs = re.sub(r'\]\r?\n\};', '],\n' + sn_quiz + '\n};', qjs, count=1)
    with open('data/quizzes.js', 'w', encoding='utf-8') as f: f.write(qjs)
    print("data/quizzes.js updated.")

# Update data/puzzles.js
with open('data/puzzles.js', 'r', encoding='utf-8') as f: pjs = f.read()
if '"servicenow":' not in pjs:
    pjs = re.sub(r'\}\r?\n\};', '},\n' + sn_puzzle + '\n};', pjs, count=1)
    with open('data/puzzles.js', 'w', encoding='utf-8') as f: f.write(pjs)
    print("data/puzzles.js updated.")

fill_data = """
  "servicenow": [
    {
      "text": "インシデント等の親となるテーブルは [?] である。",
      "answers": ["task", "Task", "task [task]"]
    },
    {
      "text": "独自ORMである [?] でクエリを発行する。",
      "answers": ["GlideRecord", "gliderecord"]
    },
    {
      "text": "構成管理データベースの頂点は [?] である。",
      "answers": ["cmdb_ci", "cmdb"]
    },
    {
      "text": "レコードの一意識別子は [?] (32桁) である。",
      "answers": ["sys_id", "sys id"]
    }
  ],
  "servicenow-csa": [
    {
      "text": "Import Setで一意キーを決める設定は [?] である。",
      "answers": ["Coalesce", "coalesce"]
    },
    {
      "text": "カタログから起票せず、Incident等を直接起票するフォームは [?] である。",
      "answers": ["Record Producer", "record producer"]
    },
    {
      "text": "構成変更を移行するパッケージは [?] である。",
      "answers": ["sys_update_set", "Update Set", "update set"]
    },
    {
      "text": "ユーザー権限はUserに直接付与せず、[?] を経由する。",
      "answers": ["Group", "group"]
    }
  ]"""
with open('data/fillblanks.js', 'r', encoding='utf-8') as f: fjs = f.read()
if '"servicenow":' not in fjs:
    fjs = re.sub(r'\]\r?\n\};', '],\n' + fill_data + '\n};', fjs, count=1)
    with open('data/fillblanks.js', 'w', encoding='utf-8') as f: f.write(fjs)
    print("data/fillblanks.js updated.")

mission_data = """
  "servicenow": {
    "title": "ServiceNow Architecture Mission",
    "description": "Business Rule と Client Script の使い分けを設計する",
    "tasks": [
      "初級：PDIでIncident一覧を開き、Personalize Listを試す",
      "中級：Business Ruleを作成し、ログを出力させる",
      "上級：Client ScriptとScript Include(GlideAjax)を連携させる"
    ]
  },
  "servicenow-csa": {
    "title": "ServiceNow CSA Mission",
    "description": "CSA試験のコア概念の復習",
    "tasks": [
      "初級：Service Catalogの3階層（REQ -> RITM -> SCTASK）を図解する",
      "中級：ACLの評価順序（Role -> Condition -> Script）をまとめる",
      "上級：Import SetのCoalesce挙動をテストする"
    ]
  }"""
with open('data/missions.js', 'r', encoding='utf-8') as f: mjs = f.read()
if '"servicenow":' not in mjs:
    mjs = re.sub(r'\}\r?\n\};', '},\n' + mission_data + '\n};', mjs, count=1)
    with open('data/missions.js', 'w', encoding='utf-8') as f: f.write(mjs)
    print("data/missions.js updated.")
