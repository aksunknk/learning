def get_containers(tab_id, quiz_title="🧠 理解度チェック", quiz_intro="知識を確認しましょう。"):
    return f"""
      <div class="quiz-section" id="{tab_id}-quiz">
        <div class="quiz-header"><h3>{quiz_title}</h3></div>
        <p class="quiz-intro">{quiz_intro}</p>
        <div id="{tab_id}-quiz-container"></div>
        <div class="quiz-result" id="{tab_id}-quiz-result"></div>
      </div>

      <div class="puzzle-section" id="{tab_id}-puzzle-wrapper" style="margin-top: 2rem; border-top: 1px solid var(--color-border); padding-top: 2rem;">
        <div class="quiz-header"><h3>🧩 コード組み立てパズル</h3></div>
        <p class="quiz-intro">ドラッグ＆ドロップで正しい順序にコードを組み立ててください。</p>
        <div class="puzzle-question" id="{tab_id}-puzzle-question" style="font-weight:bold; margin-bottom: 1rem; color: var(--color-text-primary);"></div>
        <div class="puzzle-board">
          <div class="puzzle-source" id="{tab_id}-puzzle-source"></div>
          <div class="puzzle-dropzone" id="{tab_id}-puzzle-dropzone">
            <div class="dropzone-placeholder">ここにドロップしてコードを完成させる</div>
          </div>
        </div>
        <div class="puzzle-controls" style="margin-top: 1rem; display: flex; gap: 1rem;">
          <button class="check-btn" onclick="checkPuzzle('{tab_id}')" style="background: var(--color-primary); color: #fff; padding: 0.5rem 1rem; border-radius: 4px; border: none; cursor: pointer; font-weight:bold;">判定する</button>
          <button class="reset-btn" onclick="loadPuzzle('{tab_id}')" style="background: var(--color-surface); color: var(--color-text-primary); padding: 0.5rem 1rem; border-radius: 4px; border: 1px solid var(--color-border); cursor: pointer;">リセット</button>
        </div>
        <div class="quiz-result" id="{tab_id}-puzzle-result" style="margin-top: 1rem;"></div>
      </div>
"""

with open('content/servicenow.html', 'a', encoding='utf-8') as f:
    f.write(get_containers('servicenow', '🧠 理解度チェック', 'ServiceNow のアーキテクチャを確認しましょう。'))

with open('content/servicenow-csa.html', 'a', encoding='utf-8') as f:
    f.write(get_containers('servicenow-csa', '🧠 理解度チェック', 'CSA認定試験のコア知識を確認しましょう。'))

print("Appended containers.")
