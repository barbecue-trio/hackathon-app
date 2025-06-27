# プロジェクトドキュメント

## データ構造

### カテゴリ定義 (`src/data/categorys.ts`)

このファイルでは、メニューアイテムのカテゴリ分類を定義しています。

#### カテゴリ一覧

| ID | カテゴリ名 | 説明 |
|---|---|---|
| 1 | 麺系 | ラーメン、うどん、そばなどの麺料理 |
| 2 | 鍋系 | すき焼き、しゃぶしゃぶ、キムチ鍋などの鍋料理 |
| 3 | 刺身系 | 刺身、カルパッチョなどの生魚料理 |
| 4 | 寿司 | 握り寿司、巻き寿司などの寿司料理 |
| 5 | その他 | 一致しないもの |

#### コード例

```typescript
import { CATEGORIES, categoryIdMap, categoryList } from '../data/categorys'

// カテゴリの取得
const noodleCategory = CATEGORIES.NOODLE // { id: 1, name: "麺系" }

// IDからカテゴリ名を取得
const categoryName = categoryIdMap[1] // "麺系"

// 全カテゴリのリスト
const allCategories = categoryList // [{ id: 1, name: "麺系" }, ...]
```

#### 型定義

- `CategoryKey`: カテゴリのキー型（'NOODLE' | 'HOTPOT' | 'SASHIMI' | 'SUSHI'）
- `Category`: カテゴリオブジェクトの型（`{ id: number, name: string }`）

#### 使用方法

AIがメニューを分析する際に、このカテゴリIDを使用して適切な分類を行います：

1. メニュー名や説明からカテゴリを判定
2. 対応するID（1-4）を割り当て
3. ユーザーの好みや制限に基づいてフィルタリング

#### 関連ファイル

- `src/data/allergens.ts` - アレルギー情報の定義
- `src/data/religiousRestrictions.ts` - 宗教的制限の定義 