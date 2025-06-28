// プロンプト定義ファイル

/**
 * メニュー抽出用プロンプト
 * 居酒屋メニューの画像からメニュー名を英日両言語で抽出
 */
export const MENU_EXTRACTION_PROMPT = `
この画像は居酒屋のメニューです。以下の条件でメニュー名を抽出してください：
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
    "name": "英語でのメニュー名",
    "name_jp": "日本語でのメニュー名"
  }
]

英語名は一般的な英語表記を使用し、日本語名は元のメニュー表記をそのまま使用してください。
例：
- 焼き鳥 → {"name": "Yakitori", "name_jp": "焼き鳥"}
- 刺身盛り合わせ → {"name": "Sashimi Platter", "name_jp": "刺身盛り合わせ"}
- 梅おにぎり → {"name": "Umeboshi Onigiri", "name_jp": "梅おにぎり"}
- 冷奴 → {"name": "Hiyayakko", "name_jp": "冷奴"}
- 枝豆 → {"name": "Edamame", "name_jp": "枝豆"}
- 厚焼き玉子 → {"name": "Tamagoyaki", "name_jp": "厚焼き玉子"}
- きゅうり一本漬け → {"name": "Cucumber Pickles", "name_jp": "きゅうり一本漬け"}
- キムチ → {"name": "Kimchi", "name_jp": "キムチ"}
- チャンジャ → {"name": "Jangjorim", "name_jp": "チャンジャ"}
- 鶏のからあげ → {"name": "Karaage Chicken", "name_jp": "鶏のからあげ"}
- フライドポテト → {"name": "French Fries", "name_jp": "フライドポテト"}
- 厚揚げ → {"name": "Agedashi Tofu", "name_jp": "厚揚げ"}
- メンチカツ → {"name": "Minchi Katsu", "name_jp": "メンチカツ"}
- なんこつのからあげ → {"name": "Karaage Cartilage", "name_jp": "なんこつのからあげ"}
- コロッケ → {"name": "Korokke", "name_jp": "コロッケ"}
- ひとくちぎょうざ → {"name": "Gyoza", "name_jp": "ひとくちぎょうざ"}
- 焼き明太子 → {"name": "Grilled Mentaiko", "name_jp": "焼き明太子"}
- ホッケ焼き → {"name": "Grilled Hokke", "name_jp": "ホッケ焼き"}
- チーズ春巻き → {"name": "Cheese Spring Rolls", "name_jp": "チーズ春巻き"}
- トマトとモッツァレラ → {"name": "Tomato and Mozzarella", "name_jp": "トマトとモッツァレラ"}
- シーザーサラダ → {"name": "Caesar Salad", "name_jp": "シーザーサラダ"}
- ポテトサラダ → {"name": "Potato Salad", "name_jp": "ポテトサラダ"}
- じゃこサラダ → {"name": "Chirimen Jako Salad", "name_jp": "じゃこサラダ"}
- 本日の刺し盛り → {"name": "Today"s Sashimi Platter", "name_jp": "本日の刺し盛り"}
- 鰹のたたき → {"name": "Tataki Bonito", "name_jp": "鰹のたたき"}
- ゴマ鯖 → {"name": "Sesame Mackerel", "name_jp": "ゴマ鯖"}
- ぶり → {"name": "Buri", "name_jp": "ぶり"}
- サーモン → {"name": "Salmon", "name_jp": "サーモン"}
- シャケおにぎり → {"name": "Salmon Onigiri", "name_jp": "シャケおにぎり"}
- 高菜おにぎり → {"name": "Takana Onigiri", "name_jp": "高菜おにぎり"}
- 明太おにぎり → {"name": "Mentaiko Onigiri", "name_jp": "明太おにぎり"}
- お茶漬け → {"name": "Ochazuke", "name_jp": "お茶漬け"}
- チャーハン → {"name": "Fried Rice", "name_jp": "チャーハン"}

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
