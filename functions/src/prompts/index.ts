// プロンプト定義ファイル

/**
 * メニュー抽出用プロンプト
 * 飲食店メニューの画像からメニュー名を英日両言語で抽出
 */
export const MENU_EXTRACTION_PROMPT = `
この画像は飲食店のメニューです。以下の条件でメニュー名を抽出してください：
条件：
1. メニュー名のみを抽出（価格は除外）
2. カテゴリ名（「とりあえず」「おすすめメニュー」「揚げもの」「刺身」「焼きもの」など）は除外
3. 価格のみの行は除外
4. 複合メニューは必ず個別のメニューに分割
   - 「おにぎり 梅・シャケ・高菜」→「梅おにぎり」「シャケおにぎり」「高菜おにぎり」
   - 「刺身盛り合わせ マグロ・サーモン・ブリ」→「マグロ刺身」「サーモン刺身」「ブリ刺身」
   - 「焼き鳥 もも・ねぎま・つくね」→「もも焼き鳥」「ねぎま焼き鳥」「つくね焼き鳥」
5. メニュー名は具体的で分かりやすく
6. 重複は除外
7. 食材の種類が明確な場合は、その食材名を含める

必ず以下の形式でJSON配列で返してください：
[
  {
    "name": "英語名",
    "name_jp": "日本語名"
  }
]

英語名は一般的な英語表記を使用し、日本語名は元のメニュー表記をそのまま使用してください。
例：
- 焼き鳥 → {"name": "Yakitori", "name_jp": "焼き鳥"}

必ずJSON形式で返してください。説明文は不要です。
`

/**
 * 食文化生成用プロンプト
 * @param menuName メニュー名
 */
export const createFoodCulturePrompt = (menuName: string): string => `
Please provide a brief explanation of the food culture for "${menuName}":

- When and where it originated
- Why it was created
- Its current status and significance

Please answer in English, 50-100 characters, concise and informative.
`

/**
 * 一括カテゴリー判定用プロンプト
 * @param menuList メニューリスト文字列
 */
export const createCategoryBatchPrompt = (menuList: string): string => `
以下のメニューリストの各メニューに対して、最も適切なカテゴリーIDを選んでください：

メニューリスト：
${menuList}

カテゴリー分類：
1. 麺系 - ラーメン、うどん、そば、パスタ、スパゲッティなどの麺料理
2. 鍋系 - すき焼き、しゃぶしゃぶ、キムチ鍋、鍋物などの鍋料理
3. 刺身系 - 刺身、カルパッチョ、タルタル、生魚料理など
4. 寿司 - 握り寿司、巻き寿司、手巻き寿司などの寿司料理
5. その他 - 上記のカテゴリーに該当しない料理

必ず以下の形式でJSON配列で回答してください：
[1, 2, 3, 4, 5, ...]

各数字は対応するメニューのカテゴリーIDです。
例：
- ラーメン → 1
- すき焼き → 2
- 刺身盛り合わせ → 3
- 握り寿司 → 4
- 焼き鳥 → 5

説明は不要で、数字の配列のみで回答してください。
`

/**
 * 個別カテゴリー判定用プロンプト
 * @param name 英語メニュー名
 * @param nameJp 日本語メニュー名
 */
export const createCategoryIndividualPrompt = (name: string, nameJp: string): string => `
以下のメニュー名を分析して、最も適切なカテゴリーIDを選んでください：

メニュー名（英語）: ${name}
メニュー名（日本語）: ${nameJp}

カテゴリー分類：
1. 麺系 - ラーメン、うどん、そば、パスタ、スパゲッティなどの麺料理
2. 鍋系 - すき焼き、しゃぶしゃぶ、キムチ鍋、鍋物などの鍋料理
3. 刺身系 - 刺身、カルパッチョ、タルタル、生魚料理など
4. 寿司 - 握り寿司、巻き寿司、手巻き寿司などの寿司料理
5. その他 - 上記のカテゴリーに該当しない料理

必ず1から5の数字のみで回答してください。説明は不要です。
例：
- ラーメン → 1
- すき焼き → 2
- 刺身盛り合わせ → 3
- 握り寿司 → 4
- 焼き鳥 → 5
`

/**
 * メニュー画像生成用プロンプト
 * @param menuName メニュー名
 */
export const createMenuImagePrompt = (menuName: string): string => `
料理名：${menuName}の画像を生成してください。
生成する際には以下の条件に従ってください。

## 条件
- 画像のスタイル: 写実的で食品サンプルやディスプレイ用の料理写真
- 画像のテーマ: ${menuName}の料理が主役となるように、他の要素は一切含めない
- 画像の背景: シンプルで料理が引き立つように、背景は白または淡い色にしてください
- 画像の構図: 料理が中央に配置され、全体がよく見えるように、クローズアップで、余計なものが写り込まないようにしてください
- **文字、ロゴ、ブランド名、日付、透かし、その他のテキストは一切含めないでください。**
- **人間、手、食器の一部（料理を盛る皿以外）、その他の物体は含めないでください。**
- [ID: ${Date.now()}]
`

/**
 * 原材料リスト生成用プロンプト
 * @param menuName メニュー名
 */
export const createIngredientsPrompt = (menuName: string): string => `
${menuName}の一般的な原材料をリスト形式で教えて下さい。
以下の条件に必ず従ってください。

## 条件
- 一般的な原材料をリストアップしてください
- 原材料は英語の小文字で記載してください
- 各原材料は、「,」で区切ってください
- 各原材料は、**注釈や括弧書きを含めず、食材の名称のみ**を記載してください
- **部位名などの詳細は除き、素材カテゴリとして一般的な名称で記載してください（例：豚バラ肉 → 豚肉）**
- リストには、**主な原材料のみ**を含めてください
- 材料以外には何も記載しないでください
`

/**
 * アレルゲンチェック用プロンプト
 * @param ingredientListStr 原材料リスト
 * @param allergensListStr アレルゲンリスト
 */
export const createAllergenCheckPrompt = (
  ingredientListStr: string,
  allergensListStr: string
): string => `
  「原材料リスト」に「アレルゲン食材」が含まれているかをチェックしてください。
  「原材料リスト」と「アレルゲン食材」は以下のとおりです。

  ## 原材料リスト
  ${ingredientListStr}

  ## アレルゲン食材
  ${allergensListStr}

  ---

  以下の条件に必ず従ってください。

  ## 条件
  - 「原材料リスト」に「アレルゲン食材」が含まれている場合は、「アレルゲン食材」の文字列をそのまま「,」区切りで返してください。
  - 含まれていない場合は、「null」を返してください。
  `

/**
 * 宗教的制限チェック用プロンプト
 * @param ingredientListStr 原材料リスト
 * @param religiousRestrictionListStr 宗教的制限リスト
 */
export const createReligiousRestrictionCheckPrompt = (
  ingredientListStr: string,
  religiousRestrictionListStr: string
): string => `
「宗教的・信条的な食事制限」のある人が食べられない原材料が「原材料リスト」にあるかチェックしてください。
  「原材料リスト」と「宗教的・信条的な食事制限」は以下のとおりです。

  ## 原材料リスト
  ${ingredientListStr}

  ## 宗教的・信条的な食事制限
  ${religiousRestrictionListStr}

  ---

  以下の条件に必ず従ってください。

  ## 条件
  - 「宗教的・信条的な食事制限」で食べられない原材料が「原材料リスト」に含まれている場合は、「宗教的・信条的な食事制限」の文字列をそのまま「,」区切りで返してください。
  - 含まれていない場合は、「null」を返してください。
  `
