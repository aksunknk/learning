# -*- coding: utf-8 -*-
"""ServiceNow & CSA Chapter Content Generator"""
import re
from _sn_lib import esc, code, concept, explain, warn, tips, table, lesson, separator, quiz_block, puzzle_block, fill_block, mission_block

TAB1_ID, TAB1_LABEL, TAB1_ICON = "servicenow", "ServiceNow 基礎", "⚙️"
lessons1 = [
    lesson(TAB1_ID, 1, "ServiceNowの正体 — なぜ「クラウド上の巨大Django Admin」なのか",
        concept("🎯 ServiceNowの本質は「PaaS型の超巨大RDB + ワークフロー基盤」", "<p>ServiceNow（SN）は、単なるITヘルプデスクのSaaSではありません。Python（Django/FastAPI）などでWebアプリを自作した経験があるなら、SNを<b>「超高機能なDjango Admin画面が最初から乗っている、単一の巨大リレーショナルデータベース（MariaDBベース）」</b>と考えると最も実態に近いです。</p><p>通常のSaaSがテナント間でDBを共有するのに対し、SNは<b>「マルチインスタンス」</b>アーキテクチャを採用しています。顧客ごとに独立したDBとアプリケーションノードが割り当てられるため、他の顧客の負荷に引きずられず、極めてセキュアで高度なカスタマイズが可能です。</p>"),
        explain("📊 既存のWeb開発との対応表", table(["概念", "一般的なWeb開発", "ServiceNowでの呼称 / 機能"], [
            ["DBテーブル", "RDB Table / ORM Model", "<b>Table</b> (<code>sys_db_object</code>)"],
            ["レコード/行", "Row", "<b>Record</b>"],
            ["カラム/列", "Column / Field", "<b>Field</b>"],
            ["CRUD画面", "React/Vue + API + HTML/CSS", "<b>List</b> (一覧) / <b>Form</b> (詳細) / <b>Workspace</b>"],
            ["DBトリガー", "RDB Trigger / ORM Post-save", "<b>Business Rule</b> (サーバーサイドスクリプト)"],
            ["フロントエンドJS", "React useEffect / Event Listener", "<b>Client Script</b> (ブラウザ側スクリプト)"],
            ["API/バッチ連携", "Celery / REST API", "<b>Integration Hub</b> / <b>Scripted REST API</b>"]
        ])),
        tips("ServiceNowの開発は「ゼロからコードを書く」のではなく、<b>「すでに完成している巨大なERP/CRMシステムの振る舞いを、設定とスクリプト（JavaScript）で上書き（Override）していく」</b>作業です。そのため、既存のアーキテクチャ（テーブルや標準スクリプト）に逆らってフルスクラッチのUIを作ろうとすると、アップデート時の保守コストが跳ね上がり破綻します。<b>「プラットフォームのレールに乗る（Stay Out-of-the-Box）」</b>ことがシニアSNエンジニアの鉄則です。")
    ),
    lesson(TAB1_ID, 2, "データ層：テーブルと継承モデル（Task と Incident）",
        concept("🎯 ServiceNowの心臓部は「Task [task]」テーブル", "<p>ServiceNowの最も強力な機能の一つが<b>「テーブルの継承（Table Extension）」</b>です。RDBにおいて、共通の属性（「アサイン先」「ステータス」「作成日」など）を持つテーブルを設計する際、SNでは基底テーブルである <code>Task [task]</code> テーブルを継承して新しいテーブルを作成します。</p>"),
        code("SQL vs ServiceNowのテーブル関係", "-- もしゼロからSQLでIncidentテーブルを作るなら：\nCREATE TABLE incident (\n    id VARCHAR(32) PRIMARY KEY, -- ServiceNowでは sys_id (32桁のGUID)\n    short_description VARCHAR(255),\n    state INT,\n    assigned_to VARCHAR(32) REFERENCES sys_user(id)\n    -- ...\n);\n\n/* ServiceNowの継承モデルの概念：\n * Incident (インシデント), Problem (問題), Change Request (変更要求) は\n * 全て Task (task) テーブルを「継承」している。\n * \n * [task] テーブル (親)\n *   ├── state, assigned_to, short_description, sys_created_on などを保持\n *   │\n *   ├── [incident] テーブル (子)\n *   │     └── caller_id (起票者) など、インシデント特有のフィールドを追加\n *   │\n *   └── [change_request] テーブル (子)\n *         └── risk (リスクレベル) など、変更要求特有のフィールドを追加\n */"),
        explain("🔑 sys_id と カスタムプレフィックス", "<p>ServiceNow内の<b>すべてのレコードは、必ず <code>sys_id</code> という32文字のグローバル一意識別子（GUID）</b>を持ちます。これは絶対に一意であり、外部キー（Reference）として他のテーブルから参照される際のキーになります。</p><p>また、開発者が独自に追加したテーブルやフィールドには、必ず <code>u_</code> (グローバルスコープ) または <code>x_</code> (Scoped App) というプレフィックスが自動付与されます（例：<code>u_custom_table</code>）。これにより、将来のシステムアップデートで同名の標準テーブルが追加されても衝突しません。</p>"),
        tips("実務では「Incident一覧を出して」と言われたら <code>incident</code> テーブルをクエリしますが、「自分にアサインされている全ての作業（IncidentもTaskもChangeも）を出して」と言われたら、親である <b><code>task</code> テーブルに対してクエリ（<code>assigned_to=自分のsys_id</code>）を投げます</b>。継承の概念を理解していないと、テーブルごとに個別クエリを投げる非効率な設計になってしまいます。")
    ),
    lesson(TAB1_ID, 3, "CMDBと構成アイテム（CI）",
        concept("🎯 CMDBは「ITインフラの設計図（デジタルツイン）」", "<p>CMDB（Configuration Management Database：構成管理データベース）は、企業内のサーバー、PC、ソフトウェア、ネットワーク機器、さらには「メールサービス」といった無形のサービスまで、IT資産のすべてを<b>構成アイテム（CI：Configuration Item）</b>として格納する巨大なツリー構造のテーブル群です。</p>"),
        explain("🌲 cmdb_ci のクラス階層", "<p>CMDBも強力な継承モデルを持っています。頂点にあるのが <code>cmdb_ci</code> テーブルです。</p><ul><li><code>cmdb_ci</code> (すべてのCIの親)<ul><li><code>cmdb_ci_hardware</code> (ハードウェア)<ul><li><code>cmdb_ci_computer</code> (コンピュータ) <ul><li><code>cmdb_ci_server</code> (サーバー / Windows, Linux等)</li></ul></li></ul></li><li><code>cmdb_ci_appl</code> (アプリケーション)</li></ul></li></ul><p>さらに、これらのCI間には<b>関係性（Relationship）</b>が定義されます。（例：「Linux Server A」は「Oracle DB B」を <i>Runs on（上で動かしている）</i>）。</p>"),
        tips("Incident（障害）が発生した際、影響範囲を特定するために「どのCIで障害が起きたのか」をレコードに紐づけます（<code>incident.cmdb_ci</code> フィールド）。CMDBの関係性を辿る（Dependency Views）ことで、「このDBサーバーが落ちたら、上のWebサービス、ひいては社内の稟議システム全体が停止する」という影響を瞬時に可視化できるのが、SNを単なるチケット管理ツールから「エンタープライズIT基盤」に押し上げている最大の理由です。")
    ),
    lesson(TAB1_ID, 4, "画面層：List・Form・Viewの仕組み",
        concept("🎯 スキーマ駆動のUI自動生成", "<p>ReactやVueで画面を作る場合、HTML/CSSとデータバインディングを自作しますが、SNの基本UI（UI16 / Next Experience）では、<b>テーブルのスキーマ（カラム定義）を作成した瞬間に、List（一覧画面）とForm（詳細・編集画面）が自動生成</b>されます。</p>"),
        explain("🎨 View（ビュー）による画面の切り替え", "<p>同じ <code>incident</code> テーブルのデータでも、「一般ユーザーが見る画面」と「システム管理者が調査する画面」では、表示すべきフィールドが異なります。SNではこれを<b>View（ビュー）</b>という概念で解決します。</p><ul><li><b>Default View</b>: 担当者向けのフル機能フォーム。</li><li><b>Self Service View (ess)</b>: エンドユーザー向けのシンプルなフォーム（専門用語や内部ステータスを隠す）。</li><li><b>Mobile View</b>: モバイルアプリ用のコンパクトな表示。</li></ul>"),
        tips("「このフィールドを画面の右上に配置して、背景を赤くして…」といったピクセルパーフェクトなUI要件は、標準のForm/Listでは実現困難（あるいは多大なDOMハックが必要で負債になる）です。そうしたBtoCのような柔軟なUIが必要な場合は、標準画面をいじるのではなく、<b>Service Portal (AngularJSベース)</b> や <b>UI Builder (Next Experience)</b> を用いて専用のポータル画面を構築するのがアーキテクチャの正解です。")
    ),
    lesson(TAB1_ID, 5, "クライアントサイド制御：Client Script と UI Policy",
        concept("🎯 ブラウザ側で動くJS ＋ ノーコード制御", "<p>ユーザーがForm画面を開いた時や、入力フィールドの値を変更した瞬間に「動的」に画面を制御（フィールドを隠す、必須入力にする、アラートを出す等）するための仕組みがクライアントサイド制御です。</p>"),
        code("Client Script (JavaScript) の例", "// onChange Client Script\n// 「Category」フィールドが \"Software\" に変更された時だけ動くスクリプト\n\nfunction onChange(control, oldValue, newValue, isLoading, isTemplate) {\n    if (isLoading || newValue === '') {\n        return;\n    }\n\n    if (newValue == 'software') {\n        g_form.setDisplay('subcategory', true);\n        g_form.setMandatory('subcategory', true);\n        g_form.addInfoMessage('ソフトウェアの問題ですね。OSの種類を忘れずに記載してください。');\n    } else {\n        g_form.setMandatory('subcategory', false);\n        g_form.setDisplay('subcategory', false);\n    }\n}"),
        explain("⚖️ UI Policy vs Client Script", "<p>上記のJSと全く同じこと（フィールドの表示/非表示、必須化、読取専用化）は、コードを書かずに<b>UI Policy</b>（ノーコード設定）でも実現可能です。</p><p><b>ルール：</b> 「UI Policyで実現できることは、絶対にClient Scriptで書かない」</p><p>UI Policyはブラウザ上で高速に評価され、保守も容易（一覧で条件が見える）です。Client Scriptは、UI Policyでは不可能な複雑な計算、外部API(GlideAjax)の呼び出し、ダイアログ(GlideDialogWindow)の表示などに限定して使用します。</p>"),
        warn("実行順序の罠", "画面ロード時の実行順序は <b>Client Script (onLoad) → UI Policy</b> の順です。Client Scriptで一生懸命フィールドを表示させても、その直後にUI Policyの条件に合致して非表示に上書きされる、というバグが初学者の「あるある」です。")
    ),
    lesson(TAB1_ID, 6, "サーバーサイド制御①：Business Rule",
        concept("🎯 データベースのTriggerに相当するサーバー処理", "<p>レコードがデータベースに保存される「直前（Before）」や「直後（After）」に発火するサーバースクリプトが<b>Business Rule (BR)</b>です。ユーザーが画面から保存ボタンを押した時だけでなく、外部からのREST API経由の更新や、インポート処理など、<b>すべてのDB更新ルートで確実に実行される</b>ため、データ整合性を担保する最強の番人となります。</p>"),
        code("Before Update Business Rule の例", "(function executeRule(current, previous /*null when async*/) {\n    if (current.close_notes.nil()) {\n        gs.addErrorMessage('インシデントを解決済みとするには、解決手順(Close Notes)の入力が必須です。');\n        current.setAbortAction(true);\n    }\n})(current, previous);"),
        explain("⏱️ Business Rule の 4つの実行タイミング", "<ul><li><b>Before</b>: DBに書き込まれる直前。バリデーション（データチェック）や、フィールドの自動計算（例：A+Bの値をCにセットして保存）に最適。</li><li><b>After</b>: DBに書き込まれた直後。他テーブルのレコードを連動して更新する場合（例：Incidentが作られたら、紐づくProblemの件数をカウントアップする）に使用。</li><li><b>Async</b>: Afterと同じくDB保存後だが、非同期（バックグラウンドワーカー）で実行。ユーザーの画面応答を待たせないため、外部API連携など時間のかかる処理に必須。</li><li><b>Display</b>: ユーザーがフォームを「開いた時（DBからReadした直後）」。Client Script（ブラウザ）にサーバー側の事前データを渡す（<code>g_scratchpad</code>変数）ために使う特殊なBR。</li></ul>"),
        tips("Before BRの中で <code>current.update()</code> を呼ぶのは<b>最悪のアンチパターン（無限ループの引き金）</b>です。Beforeは「これから自動でDBにUpdateされる直前のオブジェクトを操作している」状態なので、変数に値を代入する（<code>current.u_my_field = 'x';</code>）だけで、その後の自動Update処理で勝手にDBに保存されます。")
    ),
    lesson(TAB1_ID, 7, "サーバーサイド制御②：GlideRecord と Script Include",
        concept("🎯 ServiceNow専用のORM：GlideRecord", "<p>ServiceNowでデータベースにクエリを投げたりCRUD操作を行うためのコアAPIが<b>GlideRecord</b>です。SQLを直接書くことは許されておらず、すべてこのオブジェクト指向ラッパーを経由します。</p>"),
        code("GlideRecordによるクエリと更新", "var grInc = new GlideRecord('incident');\ngrInc.addQuery('priority', 1);\ngrInc.addQuery('active', true);\ngrInc.query();\n\nwhile (grInc.next()) {\n    gs.info('Critical Incident Found: ' + grInc.number);\n    grInc.work_notes = 'システム管理者による一斉パトロールチェック済み';\n    grInc.update();\n}"),
        explain("🧩 Script Include（共通クラスライブラリ）", "<p>Business Ruleの中に長々としたビジネスロジックを書くと、他のルールから再利用できずスパゲティ化します。そこで、<b>再利用可能な関数群やクラス定義を「Script Include」として切り出し</b>、Business Ruleからはそれを呼び出す設計にするのがベストプラクティスです。</p>"),
        tips("GlideRecordで <code>next()</code> ループを回しながら <code>update()</code> や <code>deleteRecord()</code> を連続で叩くと、巨大なテーブルではパフォーマンスが死にます。条件に合致するものを一括更新したい場合は、<code>updateMultiple()</code> を使いましょう。SQLの <code>UPDATE table SET x=y WHERE z</code> に相当し、RDBレイヤーで一括処理されるため劇的に高速です。")
    ),
    lesson(TAB1_ID, 8, "クライアント・サーバー非同期通信：GlideAjax",
        concept("🎯 画面を固めずにサーバー処理を呼び出す", "<p>「画面（Client Script）でユーザーが入力したIDをもとに、サーバー（DB）を参照してユーザーの部署名を取得し、画面に自動セットしたい」── こうしたフロント⇔バックエンド通信の王道が<b>GlideAjax</b>です。</p>"),
        code("GlideAjaxの実装パターン（Client → Script Include）", "// ==============================================\n// 1. サーバー側: Script Include (必ず \"Client callable\" にチェックを入れる)\n// ==============================================\nvar UserAjaxUtils = Class.create();\nUserAjaxUtils.prototype = Object.extendsObject(AbstractAjaxProcessor, {\n    getDepartment: function() {\n        var userId = this.getParameter('sysparm_user_id');\n        var gr = new GlideRecord('sys_user');\n        if (gr.get(userId)) {\n            return gr.department.getDisplayValue();\n        }\n        return '';\n    },\n    type: 'UserAjaxUtils'\n});\n\n// ==============================================\n// 2. クライアント側: Client Script (onChange等)\n// ==============================================\nfunction onChange(control, oldValue, newValue, isLoading, isTemplate) {\n    if (isLoading || newValue === '') return;\n    var ga = new GlideAjax('UserAjaxUtils');\n    ga.addParam('sysparm_name', 'getDepartment');\n    ga.addParam('sysparm_user_id', newValue);\n    \n    ga.getXMLAnswer(function(answer) {\n        if (answer) {\n            g_form.setValue('u_department_name', answer);\n        }\n    });\n}"),
        warn("getReference()の罠", "クライアントスクリプトには <code>g_form.getReference('caller_id')</code> という、指定した参照先のレコード情報を丸ごと取ってくる便利関数があります。しかし、これは<b>バックグラウンドで不要なカラム（数十〜数百個）まで全てDBから引っ張ってくる（SELECT * 状態）ため、通信量が肥大化しパフォーマンス劣化の温床</b>になります。必要な1〜2カラムだけを <code>GlideAjax</code> でピンポイントに取得するのがシニアエンジニアの流儀です。")
    ),
    lesson(TAB1_ID, 9, "自動化層：Flow Designer",
        concept("🎯 スクリプトから「ノーコード・ワークフロー」へのパラダイムシフト", "<p>従来、複雑な承認プロセスやタスクの自動生成はBusiness Rule等でJavaScriptを書き殴って実装されていました。これを<b>可視化されたノーコードGUIで定義できるようにした最新エンジンが Flow Designer</b> です。</p>"),
        explain("🔄 Flow Designer の基本構造", "<ul><li><b>Trigger (トリガー)</b>: フローが発火する条件。（例：「IncidentテーブルにレコードがInsertされた時」）</li><li><b>Action (アクション)</b>: 実行する処理。（例：「レコードを作成」「承認要求（Ask for Approval）」「メール送信」）</li><li><b>Data Pill (データピル)</b>: 画面右側のペインから、前段のアクションで取得したデータをドラッグ＆ドロップで後段のアクションの引数として渡す仕組み。</li></ul>"),
        tips("Flow Designerを使う最大のメリットは<b>「状態（State）の待機」</b>が極めて簡単に書けることです。例えば「上長の承認を待つ」というActionを配置すると、フローはそこで一旦スリープ状態になり、誰かが承認ボタンを押した瞬間に再開します。これをスクリプト（BR等）で実装しようとすると、状態をDBフラグで管理してバッチで監視する…といった非常に泥臭くバグの出やすい実装になります。<b>「待機・承認・通知」が絡むロジックは迷わずFlow Designer</b>を選択しましょう。")
    ),
    lesson(TAB1_ID, 10, "外部連携層：Integration Hub と REST API",
        concept("🎯 ServiceNowを「Hub」として企業システムを連結する", "<p>ServiceNowは単体で完結せず、企業のあらゆるSaaS（Slack, Teams, Salesforce, SAP, AWS, ADなど）のオーケストレーターとして機能します。これをノーコードで実現する強力な拡張機能が <b>Integration Hub (IH)</b> です。</p>"),
        code("Scripted REST API ── 外部からSNを叩かせる独自エンドポイント", "(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {\n    var body = request.body.data;\n    var slackMsg = body.text;\n    var slackUser = body.user_name;\n    \n    var grInc = new GlideRecord('incident');\n    grInc.initialize();\n    grInc.short_description = 'Slack発: ' + slackMsg;\n    grInc.caller_id.setDisplayValue(slackUser);\n    var newSysId = grInc.insert();\n    \n    response.setStatus(201);\n    response.setBody({\n        \"status\": \"success\",\n        \"incident_number\": grInc.number,\n        \"sys_id\": newSysId\n    });\n})(request, response);"),
        explain("🔌 Inbound と Outbound の使い分け", "<ul><li><b>Outbound (SN → 外部へ)</b>:<br>SNのレコードが更新されたらSlackに通知する等。Flow Designer + Integration Hubの「Spoke (各SaaS用プラグイン)」を使うのがモダンなアプローチ。</li><li><b>Inbound (外部 → SNへ)</b>:<br>外部システムがSNのデータを作成・取得する。標準の Table APIがデフォルトで開いているため基本はそちらを利用。標準APIで要件を満たせない場合のみ <b>Scripted REST API</b> を作成する。</li></ul>"),
        tips("外部連携の実装で最も危険なのは「同期処理で外部APIを叩く」ことです。Business Rule (Before/After) の中で外部APIを呼ぶと、外部の応答が遅い（タイムアウト）場合に、ユーザーの画面（Saveボタンを押した直後）も数秒〜数十秒フリーズします。<b>外部通信は必ず「Async Business Rule」や「Flow Designer」の非同期ワーカーに投げさせる</b>のがアーキテクチャの絶対条件です。")
    )
]

TAB2_ID, TAB2_LABEL, TAB2_ICON = "servicenow-csa", "SN CSA試験対策", "🎖️"
lessons2 = [
    lesson(TAB2_ID, 1, "CSA試験の構造と学習戦略",
        concept("🎯 CSA（Certified System Administrator）の現在地", "<p>CSAは、ServiceNowプラットフォーム全体の構造・ナビゲーション・テーブル管理・セキュリティ・自動化の基礎知識を問う、すべてのSN資格の登竜門（必須前提資格）です。</p>"),
        explain("📊 試験の基本スペックと出題傾向", "<ul><li><b>形式:</b> 60問 (90分間)。単一選択、または複数選択（チェックボックス）。</li><li><b>出題範囲:</b><ul><li>ユーザーインターフェース＆ナビゲーション (約20%)</li><li>コラボレーション (Task, 通知, レポート) (約20%)</li><li>データベース管理 (Table, Field, Import Set, CMDB) (約30%) ★最重要</li><li>セルフサービス＆プロセスの自動化 (Catalog, Flow Designer) (約20%)</li><li>開発入門 (Update Set, スクリプト基本原則) (約10%)</li></ul></li></ul>"),
        tips("CSA試験は「開発者」ではなく「システム管理者」の視点が問われます。そのため、複雑なJavaScriptのコードを書かせる問題は出ません。その代わり、<b>「UI PolicyとData Policyの違い」「TableとViewの構成権限」「ACLの評価順序」</b>など、プラットフォームの根幹となる『仕様と用語の厳密な定義』が徹底的に問われます。PDI（個人開発環境）を触りながら、英語のメニュー名とセットで暗記するのが最速の学習法です。")
    ),
    lesson(TAB2_ID, 2, "UIナビゲーションと画面カスタマイズの鉄則",
        concept("🎯 「Personalize」と「Configure」の決定的違い", "<p>CSA試験で確実に出題されるのが、ユーザー自身のための画面設定（パーソナライズ）と、システム全体への設定変更（コンフィギュレーション）の境界線です。</p>"),
        explain("⚙️ List (一覧画面) のカスタマイズ権限", "<p>インシデント一覧画面（List）の左上にある「歯車アイコン（Personalize List）」と、ヘッダー右クリックメニューにある「Configure > List Layout」。この2つの違いを明確に説明できなければなりません。</p>" + table(["操作名称", "アイコン/メニュー", "影響範囲", "必要なRole"], [
            ["<b>Personalize List</b><br>(リストの個人設定)", "歯車アイコン⚙️", "<b>自分(ログインユーザー)だけ</b>の表示カラム変更。システムには影響しない。", "なし (全ユーザー可能)"],
            ["<b>Configure > List Layout</b><br>(リストレイアウトの構成)", "列見出しのハンバーガーメニュー等", "<b>システム全体（全ユーザー）</b>のデフォルトの表示カラム変更。", "admin または personalize_list 等の権限"]
        ])),
        tips("試験のひっかけ問題パターン：「あるユーザーが、歯車アイコンから『ステータス』列を非表示にしました。直後にAdminがList Layoutから『ステータス』列を追加しました。このユーザーの画面に『ステータス』列は表示されますか？」<br><b>正解：表示されません。</b> Personalize（個人設定）はシステム全体のConfigureを常に上書き（優先）します。")
    ),
    lesson(TAB2_ID, 3, "ユーザー・グループ・ロール管理のベストプラクティス",
        concept("🎯 「Roleは絶対にユーザーへ直接付与してはいけない」", "<p>ServiceNowの権限モデルは <b>User(ユーザー)</b>、<b>Group(グループ)</b>、<b>Role(ロール：権限の塊)</b> の3要素で構成されます。</p>"),
        explain("🛡️ 権限付与の黄金律（Best Practice）", "<p>SNの公式ベストプラクティスであり、CSA試験で最も重要な原則は以下です。</p><div style='background:rgba(255,255,255,0.05); padding:1rem; border-left:3px solid var(--accent);'><b>ユーザー（個人）に対して直接Roleを付与してはならない。Roleは必ずGroupに付与し、ユーザーをそのGroupに所属させることで間接的にRoleを継承させる。</b></div><p>なぜか？ 企業において異動や退職は日常茶飯事です。Aさんに直接ロールを付けてしまうと、異動時に剥奪を忘れ、セキュリティインシデントに直結します。『Service Desk』グループにロールを付与しておけば、人事DBとの連携でAさんをグループから外すだけで全ての関連権限が即座に無効化されます。</p>"),
        tips("もう一つの試験頻出ポイントが<b>「Base system roles (標準ロール)」</b>の階層です。<br>・<b>admin</b>: 神。すべての機能にアクセス可能。<br>・<b>itil</b>: 一般的なヘルプデスク要員。インシデントや変更管理のチケットを操作可能。<br>・<b>ess (Employee Self Service)</b>: ロールを持たない一般ユーザー。Service Portalから自分のチケットやカタログを見るだけ。")
    ),
    lesson(TAB2_ID, 4, "ACL（アクセス制御リスト）の評価アルゴリズム",
        concept("🎯 誰が、どのテーブルの、どのフィールドを読める/書けるか", "<p>ACL（Access Control List）は、ServiceNowのセキュリティの心臓部です。画面のUI Policy等でフィールドを隠しても、API経由でアクセスされれば筒抜けです。<b>真のアクセス制御はデータベースレイヤーに直結したACLで行われます。</b></p>"),
        explain("🔐 ACL通過の3つの関門（AND条件）", "<p>あるACLルールが許可（Grant）されるためには、設定された以下の3つの条件<b>すべて（AND）</b>を満たすか、空(評価スキップ)である必要があります。</p><ul><li><b>Role (ロール):</b> ユーザーが指定されたRoleを持っているか？</li><li><b>Condition (条件):</b> レコードの特定条件を満たしているか？</li><li><b>Script (スクリプト):</b> 高度な評価JS。最終的に変数 <code>answer = true;</code> を返すか？</li></ul>"),
        code("ACLの評価順序（Table → Field）", "// 1. [Table-level] incident テーブル全体の Write 権限はあるか？\n//    → YES (突破)\n//    → NO  (拒否: フィールドレベルの評価は行われずアクセス不可)\n// \n// 2. [Field-level] incident テーブルの \"comments\" フィールドの Write 権限はあるか？\n//    → YES (突破！ここで初めて書き込み成功)\n//    → NO  (拒否: コメント欄だけは読取専用になる)"),
        tips("CSA試験では、「ACLが評価される順序」を選ぶ問題が定番です。正解は<b>「Table-level (most specific) → Table-level (wildcard) → Field-level (most specific) → Field-level (wildcard)」</b>の順番です。特定指定が先、*指定が後と暗記してください。")
    ),
    lesson(TAB2_ID, 5, "ITSMコアプロセス（Incident / Problem / Change）",
        concept("🎯 ITSMの3本柱の「目的」を切り分ける", "<p>ITILに準拠するSNでは、この3つの違いを業務要件レベルで理解しているかが問われます。</p>"),
        explain("🔄 Incident・Problem・Change の役割分担", table(["プロセス", "目的・ゴール", "ServiceNow上での振る舞い・キーワード"], [
            ["<b>Incident</b><br>(インシデント管理)", "<b>「いち早く通常のサービス状態に復旧させること」</b>", "システムダウン等。根本原因が不明でも、サーバー再起動で直るならまずは復旧(Resolve)を優先。SLAが厳しく計測される。"],
            ["<b>Problem</b><br>(問題管理)", "<b>「根本原因（Root Cause）の特定と恒久対策」</b>", "複数の類似Incidentから1つのProblemを起票。原因調査を行い、回避策(Workaround)を見つける。"],
            ["<b>Change</b><br>(変更管理)", "<b>「リスクを最小限に抑えながらシステムを変更すること」</b>", "承認(Approval)プロセスが重厚。CAB(変更諮問委員会)のレビューを経る。"]
        ])),
        tips("試験頻出のキーワード紐付け：「Workaround (回避策)」と来たら→ <b>Problem</b>。「CAB (Change Advisory Board)」と来たら→ <b>Change</b>。「SLA」によるエスカレーション（警告タイマー）と来たら→ <b>Incident (またはTask全般)</b>。このキーワード反射神経を鍛えてください。")
    ),
    lesson(TAB2_ID, 6, "CMDBとCSDM（共通サービスデータモデル）",
        concept("🎯 CMDBの関係性を可視化する機能", "<p>CMDBのデータを「どうやって見るか・管理するか」の機能名称が問われます。</p>"),
        explain("🔍 CMDB関連の主要ツール（試験頻出）", "<ul><li><b>Dependency Views (依存関係ビュー)</b>:<br>あるCIを中心にして、それが依存しているDBサーバーや影響を与える提供サービスなどを<b>グラフィカルなネットワーク図（マップ）</b>で表示する機能。障害時の影響調査で使用。</li><li><b>Schema Map (スキーママップ)</b>:<br>CIの「データ」の関係ではなく、テーブルそのものの<b>「テーブル間リレーション（参照先）や継承関係」</b>をグラフィカルに表示する開発者向け機能。</li><li><b>CI Class Manager</b>:<br>CMDBの複雑なクラス階層をツリー形式で俯瞰し、各クラスの属性や識別ルールを一元的に設定・管理するための管理者向けインターフェース。</li></ul>"),
        tips("「データの依存関係を見たい」→ Dependency Views。「テーブル構造の親戚関係を見たい」→ Schema Map。問題文に「グラフィカルに(graphically)」という単語が出たら、このどちらかを聞かれている確率が高いです。")
    ),
    lesson(TAB2_ID, 7, "サービスカタログ（Service Catalog）と要求管理",
        concept("🎯 Amazonのような社内向けショッピングカート", "<p>Service Catalogは、PCの支給申請など、社内の様々な「リクエスト」をメニュー化して提供する機能です。</p>"),
        explain("🛒 カタログアイテムと生成される3階層のレコード", "<p>Catalog Itemをカートに入れて注文すると、裏側で以下の<b>3階層のレコード</b>が自動生成されます。</p><ul><li><b>Request [sc_request] (REQ...):</b> 注文の「全体」を束ねる親。Amazonでいう「注文番号123（合計金額）」に相当。</li><li><b>Requested Item [sc_req_item] (RITM...):</b> リクエスト内の「個別の品目」。PC本体と、追加マウスの2つを頼んだらRITMは2つ作られる。</li><li><b>Catalog Task [sc_task] (SCTASK...):</b> RITMを実現するための「作業タスク」。キッティング作業員への指示チケット等。</li></ul>"),
        warn("Record Producer（レコードプロデューサー）との違い", "見た目はCatalog Itemと全く同じフォームですが、カートの概念がなく、Submitした瞬間に<b>REQ/RITM/TASKではなく、直接IncidentやChange Requestのレコードを生成する</b>仕組みを <b>Record Producer</b> と呼びます。ヘルプデスクへの障害報告フォームなどで使われます。")
    ),
    lesson(TAB2_ID, 8, "データインポート（Import Sets）とTransform Map",
        concept("🎯 外部データ（Excel/CSV/DB）を安全に取り込むアーキテクチャ", "<p>SNに大量の外部データをロードする際、直接本番テーブルにINSERTするのは極めて危険です。SNでは、<b>一時領域のテーブルを噛ませて、マッピング（変換）ルールを通してから本番に書き込む「Import Sets」</b>という仕組みを必ず通ります。</p>"),
        explain("🛤️ データインポートの4ステップ", "<ol><li><b>Data Source (データソース):</b> 取り込み元を定義。</li><li><b>Import Set Table (ステージングテーブル):</b> 取り込んだ生データを「一旦そのまま」格納する一時テーブル。</li><li><b>Transform Map (変換マップ):</b> 一時テーブルから本番テーブルへのマッピングルール。</li><li><b>Target Table (ターゲットテーブル):</b> 最終的な書き込み先（<code>incident</code> 等）。</li></ol>"),
        tips("CSA試験の超・頻出キーワードが <b>Coalesce（コアレス：合体・癒着の意）</b> です。Transform Mapの設定で特定のフィールドに「Coalesce = true」をセットすると、それが<b>「一意キー（プライマリキー）」</b>として扱われます。インポート時、Target Tableに同じキーが存在すれば<b>UPDATE（更新）</b>し、存在しなければ<b>INSERT（新規作成）</b>する、という「UPSERT」挙動になります。")
    ),
    lesson(TAB2_ID, 9, "移行管理（Update Sets）の境界線",
        concept("🎯 開発環境から本番環境への「変更のパッキング」", "<p>ServiceNowにはGitのようなソース管理の代わりに、<b>Update Set（<code>sys_update_set</code>）</b>という強力なXMLパッケージによる移行の仕組みがあります。</p>"),
        explain("📦 Update Setに『入るもの』と『入らないもの』の完全暗記", "<p>Update Setは「システムの構成変更・カスタマイズ」を記録します。逆に「日々の業務データ」は記録しません。</p>" + table(["Update Set に自動記録【される】もの<br>（Customization / Configuration）", "Update Set に【されない】もの<br>（Data / Instance specific）"], [
            ["・Tables, Fields (スキーマ変更)<br>・Business Rules, Client Scripts<br>・Views, List Layouts, Form Layouts<br>・UI Policies, Data Policies<br>・Workflows, Flow Designer", "・<b>レコードデータ</b> (Incident, User, Groupなど)<br>・<b>Schedules / Scheduled Jobs</b> (環境依存のため)<br>・<b>Homepages</b> (※Dashboardsは移行可能)<br>・<b>CI (Configuration Items)</b> データ"]
        ])),
        tips("本番環境への適用（Commit）手順も頻出です。<b>「Retrieve (開発環境からXMLを取得) → Preview (競合やエラーがないか確認) → Commit (本番へ実際に適用)」</b>の順番を必ず暗記してください。")
    ),
    lesson(TAB2_ID, 10, "CSA頻出シナリオ＆ひっかけ問題対策マトリクス",
        concept("🎯 試験会場で迷わないための「最終暗記リスト」", "<p>これまでの総まとめとして、試験で問われる「微妙な用語の使い分け」や「ベストプラクティスの判断」を整理します。</p>"),
        explain("🧠 判断チャート", table(["要件 / シナリオ", "選ぶべき答え / キーワード"], [
            ["フォームのフィールドを「必須」や「読取専用」にしたいが、<b>コードは書きたくない</b>。", "<b>UI Policy</b> または <b>Data Policy</b><br>※API経由の更新も防ぎたい場合は Data Policy を選ぶ。"],
            ["既存のテーブル（Task等）の機能を継承して、<b>新しい要件のテーブルを作りたい</b>。", "<b>Table Extension (継承)</b>"],
            ["ユーザーがチケットを起票したら、<b>自動的にメールで通知を送りたい</b>。", "<b>Notifications (通知)</b>"],
            ["ナレッジベースの記事を公開する前に、<b>マネージャーの承認プロセスを入れたい</b>。", "<b>Knowledge Workflows / Publish workflow</b>"],
            ["グラフや表を作って、<b>ダッシュボードに貼り付けたい</b>。", "<b>Reports (レポート)</b>"]
        ])),
        tips("CSA試験の最大のアドバイス：<b>「単語の英語名を覚えておくこと」</b>。日本語受験でも、翻訳が不自然だったり、バージョンによって訳語が変わることがあります。例えば「Coalesce(合体)」「Dictionary Override(辞書の上書き)」「Record Producer」など、コアな概念は英語の表記で即座に脳内変換できるようにしておくと、得点率が格段に安定します。Good Luck！")
    )
]

sn_quiz = """  "servicenow": [
    {"question": "ServiceNowのアーキテクチャの根幹であり、すべてのレコードを一意に識別するための32文字のGUIDを格納するフィールド名は何ですか？", "options": ["sys_id", "u_id", "primary_key", "record_id"], "correct": 0, "explanation": "すべてのレコードは必ず「sys_id」という32文字のグローバル一意識別子を持ちます。外部キー参照の際もこの値が使われます。"},
    {"question": "IncidentテーブルやProblemテーブルの「親」にあたり、基本的なステータスやアサイン先のフィールドを定義している基底テーブルはどれですか？", "options": ["cmdb_ci", "sys_user", "task", "service_catalog"], "correct": 2, "explanation": "SNの強力な継承モデルにおいて、作業やチケット系のほとんどのテーブルは Task [task] テーブルを継承しています。"},
    {"question": "ブラウザ上で動作し、フォームの特定のフィールド値が変更された瞬間に発火するJavaScriptスクリプトのタイプはどれですか？", "options": ["Business Rule", "Script Include", "UI Policy", "Client Script (onChange)"], "correct": 3, "explanation": "Client Scriptはブラウザ（クライアント）側で動作するスクリプトです。onChangeは特定のフィールド値が変更された時に発火します。UI Policyも画面制御を行いますがノーコード設定です。"},
    {"question": "DBに保存される直前（Before）または直後（After）に発火し、データ整合性を守るサーバーサイドスクリプトは何ですか？", "options": ["Client Script", "Business Rule", "UI Action", "GlideAjax"], "correct": 1, "explanation": "Business Ruleはデータベースのトリガーに相当し、APIやリスト画面など全ての更新経路で確実に実行される強力なサーバースクリプトです。"},
    {"question": "Client Scriptからサーバー側のScript Includeを非同期で呼び出し、画面をフリーズさせずにデータだけを取得するためのベストプラクティスAPIはどれですか？", "options": ["g_form.getReference()", "GlideRecord", "GlideAjax", "RESTMessageV2"], "correct": 2, "explanation": "非同期のフロント⇔サーバー間通信にはGlideAjaxを使用します。getReference()は不要な全カラムを取得してしまうためパフォーマンスの観点から非推奨です。"}
  ],
  "servicenow-csa": [
    {"question": "CSA試験において、ユーザーへ権限を付与する際のベストプラクティス（黄金律）はどれですか？", "options": ["ユーザーに直接Roleを付与する", "ユーザーをGroupに所属させ、Groupに対してRoleを付与する", "UserテーブルのRoleフィールドに手入力する", "すべてのユーザーにadminロールを付与する"], "correct": 1, "explanation": "人事異動時の権限剥奪漏れを防ぐため、「ユーザーに直接Roleは付与せず、Group経由で継承させる」のがSNの絶対的なベストプラクティスです。"},
    {"question": "リスト一覧画面で、自分（ログインユーザー自身）だけの表示カラムを変更する機能はどれですか？", "options": ["Configure > List Layout", "Personalize List (歯車アイコン)", "View Management", "UI Policy"], "correct": 1, "explanation": "歯車アイコンの「Personalize List」は個人設定であり、システム全体には影響しません。逆に「Configure > List Layout」はシステム全体のデフォルトレイアウトを変更します。"},
    {"question": "Service Catalogでアイテムを注文（Submit）した際、自動生成される3階層のレコードの正しい順番（親→子→孫）はどれですか？", "options": ["REQ (Request) → RITM (Requested Item) → SCTASK (Catalog Task)", "RITM → REQ → SCTASK", "SCTASK → REQ → RITM", "Incident → Problem → Change"], "correct": 0, "explanation": "全体の注文(REQ) → 個別の品目(RITM) → 実作業タスク(SCTASK) の3階層が自動生成されます。これは試験頻出ポイントです。"},
    {"question": "Import Setにおいて、Target Table内の既存レコードを「更新」するか、新しいレコードとして「挿入」するか（UPSERT挙動）を決定する一意キー設定を何と呼びますか？", "options": ["Primary Key", "Foreign Key", "Coalesce", "Transform Map"], "correct": 2, "explanation": "Transform Mapの設定で特定のフィールドに「Coalesce = true」を設定することで、それが一意キーとして扱われ、既存ならUPDATE、未存在ならINSERTされるようになります。"},
    {"question": "Update Set（sys_update_set）に「記録されない（移行対象外となる）」ものは次のうちどれですか？", "options": ["Business Rule", "Client Script", "Incident レコード等の業務データ", "Table と Field の定義"], "correct": 2, "explanation": "Update Setはシステムの「構成変更（カスタマイズ）」をキャプチャします。Incident、User、Groupなどの日々の業務データは記録されず移行対象外です。"}
  ],"""

sn_puzzle = """  "servicenow": {
    question: "GlideRecordを使って、Priorityが1（Critical）のActiveなIncidentを検索し、ステータスを更新するスクリプトを正しい順序に並べ替えてください。",
    pieces: [
      { id: "sn-p1", text: "var grInc = new GlideRecord('incident');" },
      { id: "sn-p2", text: "grInc.addQuery('priority', 1);" },
      { id: "sn-p3", text: "grInc.addQuery('active', true);" },
      { id: "sn-p4", text: "grInc.query();" },
      { id: "sn-p5", text: "while (grInc.next()) {" },
      { id: "sn-p6", text: "    grInc.work_notes = '一斉チェック済み';" },
      { id: "sn-p7", text: "    grInc.update();" },
      { id: "sn-p8", text: "}" }
    ],
    correctOrder: ["sn-p1", "sn-p2", "sn-p3", "sn-p4", "sn-p5", "sn-p6", "sn-p7", "sn-p8"],
    explanation: "GlideRecordの基本サイクルです：インスタンス化(new) → WHERE句組み立て(addQuery) → クエリ発行(query) → ループ(while next) → 値変更 → 保存(update) の順番になります。"
  },
  "servicenow-csa": {
    question: "Update Setを用いて、開発環境から本番環境へ構成変更を移行する際の正しい手順（ステータスの遷移）に並べ替えてください。",
    pieces: [
      { id: "csa-p1", text: "[開発環境] Update Setを作成し、状態を In progress にする" },
      { id: "csa-p2", text: "[開発環境] カスタマイズ作業を行い、状態を Complete にする" },
      { id: "csa-p3", text: "[本番環境] Update Source を設定し、Retrieve (取得) を実行する" },
      { id: "csa-p4", text: "[本番環境] Preview (プレビュー) を実行し、競合エラーがないか確認する" },
      { id: "csa-p5", text: "[本番環境] Commit (コミット) を実行し、本番へ適用する" }
    ],
    correctOrder: ["csa-p1", "csa-p2", "csa-p3", "csa-p4", "csa-p5"],
    explanation: "Update Set移行の王道フローです。開発側でCompleteにした後、本番側で Retrieve → Preview → Commit の3ステップを踏むことはCSA試験で必ず問われます。"
  },"""

def generate_sn_html():
    fill_sn = f'''
      <!-- servicenow Fill-in -->
      <div class="quiz-section fill-section" style="margin-top:2rem; border-top:1px solid var(--color-border); padding-top:2rem;">
        <div class="quiz-header"><h3>✍️ 穴埋め演習 (静的デモ)</h3></div>
        <p class="quiz-intro">1. インシデント等の親となるテーブルは <code>[ task ]</code> である。<br>2. 独自ORMである <code>[ GlideRecord ]</code> でクエリを発行する。<br>3. 構成管理データベースの頂点は <code>[ cmdb_ci ]</code> である。<br>4. レコードの一意識別子は <code>[ sys_id ]</code> (32桁) である。</p>
      </div>
      <!-- servicenow Mini Mission -->
      <div class="quiz-section mission-section" style="margin-top:2rem; border-top:1px solid var(--color-border); padding-top:2rem;">
        <div class="quiz-header"><h3>🎯 Mini Mission (静的デモ)</h3></div>
        <p class="quiz-intro"><b>初級:</b> PDIでIncident一覧を開き、Personalize Listを試す。<br><b>中級:</b> Business Ruleを作成し、ログを出力させる。<br><b>上級:</b> Client ScriptとScript Include(GlideAjax)を連携させる。</p>
      </div>'''
    fill_csa = f'''
      <!-- servicenow-csa Fill-in -->
      <div class="quiz-section fill-section" style="margin-top:2rem; border-top:1px solid var(--color-border); padding-top:2rem;">
        <div class="quiz-header"><h3>✍️ 穴埋め演習 (静的デモ)</h3></div>
        <p class="quiz-intro">1. Import Setで一意キーを決める設定は <code>[ Coalesce ]</code> である。<br>2. カタログから起票せず、Incident等を直接起票するフォームは <code>[ Record Producer ]</code> である。<br>3. 構成変更を移行するパッケージは <code>[ sys_update_set ]</code> である。<br>4. ユーザー権限はUserに直接付与せず、<code>[ Group ]</code> を経由する。</p>
      </div>'''
    html1 = f'    <!-- SERVICENOW TAB CONTENT -->\n    <div class="tab-content" id="content-{TAB1_ID}" role="tabpanel">\n      {"".join(lessons1)}\n      {quiz_block(TAB1_ID, "ServiceNow 基礎 理解度チェック", "ServiceNowのアーキテクチャとスクリプトの使い分けに関する知識をチェックします。")}\n      {puzzle_block(TAB1_ID)}\n      {fill_sn}\n    </div>\n'
    html2 = f'    <!-- SERVICENOW CSA TAB CONTENT -->\n    <div class="tab-content" id="content-{TAB2_ID}" role="tabpanel">\n      {"".join(lessons2)}\n      {quiz_block(TAB2_ID, "CSA認定試験 模擬チェック", "実際のCSA試験で頻出する「用語の定義」や「ベストプラクティス」のひっかけ問題形式です。")}\n      {puzzle_block(TAB2_ID)}\n      {fill_csa}\n    </div>\n'
    return html1 + html2

with open('index.html', 'r', encoding='utf-8') as f: html = f.read()
tab_btn1 = f'        <button class="tab-button" data-tab="{TAB1_ID}" role="tab" aria-selected="false" id="tab-{TAB1_ID}">\n          <span class="tab-icon">{TAB1_ICON}</span>\n          <span class="tab-label">{TAB1_LABEL}</span>\n        </button>'
tab_btn2 = f'        <button class="tab-button" data-tab="{TAB2_ID}" role="tab" aria-selected="false" id="tab-{TAB2_ID}">\n          <span class="tab-icon">{TAB2_ICON}</span>\n          <span class="tab-label">{TAB2_LABEL}</span>\n        </button>'
tab_list_end = '</div>\n      <div class="tab-indicator" id="tab-indicator">'
html = html.replace(tab_list_end, tab_btn1 + '\n' + tab_btn2 + '\n      ' + tab_list_end)
prog_card1 = f'        <div class="progress-card {TAB1_ID}-card" data-lang="{TAB1_ID}">\n          <div class="progress-card-icon">{TAB1_ICON}</div>\n          <div class="progress-card-info">\n            <h3>{TAB1_LABEL}</h3>\n            <div class="mini-progress-bar">\n              <div class="mini-progress-fill" id="{TAB1_ID}-progress-bar"></div>\n            </div>\n            <span class="progress-percent" id="{TAB1_ID}-progress-text">0%</span>\n          </div>\n        </div>'
prog_card2 = f'        <div class="progress-card {TAB2_ID}-card" data-lang="{TAB2_ID}">\n          <div class="progress-card-icon">{TAB2_ICON}</div>\n          <div class="progress-card-info">\n            <h3>{TAB2_LABEL}</h3>\n            <div class="mini-progress-bar">\n              <div class="mini-progress-fill" id="{TAB2_ID}-progress-bar"></div>\n            </div>\n            <span class="progress-percent" id="{TAB2_ID}-progress-text">0%</span>\n          </div>\n        </div>'
prac_card_end = 'id="testing-progress-text">0%</span>\n          </div>\n        </div>\n      </div>'
html = html.replace(prac_card_end, 'id="testing-progress-text">0%</span>\n          </div>\n        </div>\n' + prog_card1 + '\n' + prog_card2 + '\n      </div>')
html = html.replace('  </main>', generate_sn_html() + '\n  </main>')
html = re.sub(r'(<span class="stat-number">)9(</span>\s*<span class="stat-label">)', r'\g<1>11\2', html, count=1)
html = re.sub(r'(<span class="stat-number">)134(</span>)', r'\g<1>154\2', html)
html = re.sub(r'(<span class="stat-number">)67(</span>)', r'\g<1>77\2', html)
html = re.sub(r'(<span class="stat-number">)9(</span>\s*<span class="stat-label">.*?パズル)', r'\g<1>11\2', html, flags=re.DOTALL)
with open('index.html', 'w', encoding='utf-8') as f: f.write(html)
print("index.html updated successfully.")

with open('app.js', 'r', encoding='utf-8') as f: js = f.read()
js = js.replace("'testing']", "'testing', 'servicenow', 'servicenow-csa']")
js = js.replace("'testing']", "'testing', 'servicenow', 'servicenow-csa']")
js = js.replace('"testing": [', sn_quiz + '\n  "testing": [')
js = js.replace('"testing": {', sn_puzzle + '\n  "testing": {')
with open('app.js', 'w', encoding='utf-8') as f: f.write(js)
print("app.js updated successfully.")
