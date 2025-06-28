# Menu Scanner for International Visitors

日本食ガイド - 外国人観光客のための安全な日本料理体験アプリ

## 🎯 プロジェクト概要

AI 技術を活用して、アレルギーや宗教的制約を持つ外国人観光客が日本の飲食店で安心して食事を楽しめる Web アプリケーションです。

### 解決する課題

- **食の安全性の不安**: アレルギーや宗教的制約に関する言語の壁
- **メニュー理解の困難**: 日本語メニューの内容が分からない
- **文化的理解の不足**: 日本料理の食べ方や背景がわからない
- **コミュニケーション問題**: 店員との意思疎通が困難

## 🚀 主要機能

### ✅ 実装済み機能

1. **完全レスポンシブ UI** (Phase 1 完了)

   - Material UI v7 + Sass による美しいデザイン
   - Figma デザイン完全再現
   - 320px〜425px+ スマートフォン最適化
   - モバイルファースト UX

2. **Firebase Storage 統合** (Phase 2 基盤)

   - 画像アップロード機能
   - リアルタイム進捗表示
   - カメラ・ファイル選択対応
   - 完全なエラーハンドリング

3. **Firebase Functions アーキテクチャ** (Phase 2 基盤)
   - エンドポイント分割設計
   - AI 処理用最適化設定
   - TypeScript 完全対応

### 🔄 実装中機能

4. **OCR + AI 解析**: メニュー画像から食材情報を自動抽出
5. **食材安全チェック**: ユーザーの制約と照合して安全性を判定
6. **店員向け説明文生成**: 制約内容を伝える文章を自動生成
7. **文化ガイド**: 日本料理の食べ方と背景を紹介

## 🛠️ 技術スタック

### フロントエンド

- **React 19** + **TypeScript** + **Vite**
- **Material UI v7** + **Material UI Icons**
- **Sass/SCSS** プリプロセッサ
- **React Router DOM** ルーティング

### バックエンド

- **Firebase** (Authentication, Firestore, Hosting, Functions)
- **Firebase Storage** 画像管理
- **Firebase Functions** エンドポイント分割アーキテクチャ

### AI/ML

- **Google Cloud Vision API** (OCR)
- **Google Gemini LLM** (食材解析・文化情報生成)

### 開発・品質管理

- **Biome** (リンター・フォーマッター)
- **Playwright MCP** (自動ブラウザテスト)
- **TypeScript** 完全型安全性

## 📱 ページ構成

| ページ                   | 機能                             | 実装状況 |
| ------------------------ | -------------------------------- | -------- |
| **Home**                 | アプリ紹介・メインナビゲーション | ✅ 完了  |
| **Menu Scanner**         | カメラ・画像アップロード         | ✅ 完了  |
| **Menu Analysis**        | 解析結果・食材情報表示           | ✅ 完了  |
| **Menu Detail**          | 料理詳細・アレルゲン情報         | ✅ 完了  |
| **Dietary Restrictions** | 食事制限設定                     | ✅ 完了  |
| **Settings**             | アプリ設定                       | ✅ 完了  |

## 🏗️ プロジェクト構造

### フロントエンド (`src/`)

```
src/
├── components/          # 再利用可能コンポーネント
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Button.tsx
│   └── ...
├── pages/              # ページコンポーネント
│   ├── Home.tsx
│   ├── MenuScanner.tsx
│   └── ...
├── services/           # サービス層
│   └── imageUpload.ts
├── styles/             # Sass スタイル
│   └── variables.scss
└── assets/             # 静的リソース
```

### バックエンド (`functions/src/`)

```
functions/src/
├── endpoints/                    # エンドポイント別ディレクトリ
│   ├── process-menu-image/
│   │   └── index.ts             # メニュー画像処理
│   ├── generate-food-culture/
│   │   └── index.ts             # 食文化情報生成
│   ├── generate-categories/
│   │   └── index.ts             # カテゴリー分類
│   └── test-process-menu-image/
│       └── index.ts             # テスト用
├── handlers/                     # ビジネスロジック
├── services/                     # サービス層
├── config/                       # 設定
├── types/                        # 型定義
└── index.ts                      # メインエクスポート
```

## 🚀 セットアップ・開発

### 前提条件

- Node.js 20+
- npm または yarn
- Firebase CLI

### インストール

```bash
# リポジトリクローン
git clone https://github.com/barbecue-trio/hackathon-app.git
cd hackathon-app

# フロントエンド依存関係インストール
npm install

# Firebase Functions 依存関係インストール
cd functions
npm install
cd ..
```

### 開発サーバー起動

```bash
# フロントエンド開発サーバー
npm run dev

# Firebase Functions 開発サーバー（別ターミナル）
cd functions
npm run serve
```

### ビルド

```bash
# フロントエンド ビルド
npm run build

# Firebase Functions ビルド
cd functions
npm run build
```

## 🔧 Firebase Functions エンドポイント

### 実装済みエンドポイント

| エンドポイント         | 機能             | 設定                    |
| ---------------------- | ---------------- | ----------------------- |
| `processMenuImage`     | メニュー画像処理 | 512MiB, asia-northeast1 |
| `generateFoodCulture`  | 食文化情報生成   | 512MiB, asia-northeast1 |
| `generateCategories`   | カテゴリー分類   | 512MiB, asia-northeast1 |
| `testProcessMenuImage` | テスト用         | 512MiB, asia-northeast1 |

### 統一設定

- **CORS**: true（クロスオリジン対応）
- **Region**: asia-northeast1（東京リージョン）
- **Memory**: 512MiB（AI 処理に適したメモリ）

## 📋 開発進捗

### ✅ Phase 1: 基本 UI 構築と Material UI 導入（100% 完了）

- 全 6 ページの Figma デザイン実装完了
- 完全レスポンシブ対応 (320px-425px+ 対応)
- Material UI Icons 統合完了
- モバイルファースト UX 最適化完了

### ✅ Phase 2 基盤: Firebase 統合（完了）

- Firebase Storage 統合・画像アップロード機能
- Firebase Functions エンドポイント分割アーキテクチャ
- TypeScript 完全対応

### 🚀 Phase 2 実装中: AI 機能

- OCR 機能実装（Google Cloud Vision API）
- AI 解析機能（Gemini LLM API）
- 食材安全性判定ロジック

## 🌟 特徴・技術的ハイライト

### デザイン・UX

- **Figma デザイン 100% 再現**
- **425px 対応レスポンシブ範囲拡張**
- **Material UI Icons 完全統合**
- **アクセシビリティ WCAG 準拠**

### アーキテクチャ

- **エンドポイント分割設計** - 保守性・拡張性重視
- **TypeScript 完全型安全性**
- **Firebase Functions v2** 最新仕様対応
- **モジュラー設計** - 高い再利用性

### パフォーマンス

- **React 19** 最新最適化
- **Vite** 高速ビルド
- **Firebase Asia-Northeast1** 低レイテンシ
- **512MiB メモリ設定** AI 処理最適化

## 🤝 コントリビューション

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 👥 チーム

**Barbecue Trio** - ハッカソンチーム

---

**外国人観光客の日本での食体験を、AI の力でより安全で楽しいものに。**
