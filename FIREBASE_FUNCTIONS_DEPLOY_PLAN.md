# Firebase Cloud Functions デプロイ用実行計画書

## 📋 プロジェクト概要

- **プロジェクト名**: barbecue-trio
- **Functions 構造**: エンドポイント分割アーキテクチャ（4 つのエンドポイント）
- **使用技術**: TypeScript, Firebase Functions v2, Biome（Linter/Formatter）
- **環境変数**: GEMINI_API_KEY, BUCKET

## ✅ Phase 1 完了済み

- functions/package.json の修正（ESLint → Biome 移行、Node.js 22 対応）
- 依存関係のインストール完了
- Biome 動作確認済み

---

## 🔧 Phase 2: Functions 用 Biome 設定

### 2.1 functions/biome.json の作成

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": false,
    "clientKind": "git",
    "useIgnoreFile": false
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": ["lib/**", "node_modules/**", "tsconfig*.json", "**/*.js.map"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "warn"
      },
      "style": {
        "noVar": "error",
        "useConst": "error"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "asNeeded",
      "trailingCommas": "es5"
    }
  }
}
```

### 2.2 実行手順

```bash
# 1. Biome設定ファイル作成後の動作確認
cd functions
npm run lint

# 2. ソースコードのフォーマット修正
npm run lint:fix

# 3. 最終確認
npm run build
npm run lint
```

### 2.3 期待される結果

- lib ディレクトリ（ビルド成果物）が lint 対象から除外される
- TypeScript ソースコードのフォーマットエラーが修正される
- lint エラーが大幅に減少する

---

## 🚀 Phase 3: GitHub Actions ワークフロー作成

### 3.1 Functions 専用デプロイワークフロー

**ファイル**: `.github/workflows/deploy-functions.yml`

```yaml
name: Deploy Firebase Cloud Functions

on:
  push:
    branches:
      - main
    paths:
      - "functions/**"
      - ".github/workflows/deploy-functions.yml"
  pull_request:
    branches:
      - main
    paths:
      - "functions/**"

jobs:
  deploy:
    runs-on: ubuntu-latest

    environment:
      name: FIREBASE

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
          cache-dependency-path: "functions/package-lock.json"

      - name: Install dependencies
        run: |
          cd functions
          npm ci

      - name: Lint code
        run: |
          cd functions
          npm run lint

      - name: Format check
        run: |
          cd functions
          npm run format

      - name: Build functions
        run: |
          cd functions
          npm run build

      - name: Verify secrets
        if: github.ref == 'refs/heads/main'
        run: |
          echo "Checking if required secrets exist..."
          if [ -z "${{ secrets.FIREBASE_SERVICE_ACCOUNT_KEY }}" ]; then
            echo "ERROR: FIREBASE_SERVICE_ACCOUNT_KEY is not set"
            exit 1
          fi
          if [ -z "${{ secrets.GEMINI_API_KEY }}" ]; then
            echo "ERROR: GEMINI_API_KEY is not set"
            exit 1
          fi
          if [ -z "${{ secrets.BUCKET }}" ]; then
            echo "ERROR: BUCKET is not set"
            exit 1
          fi
          echo "All required secrets are configured"
        env:
          FIREBASE_SERVICE_ACCOUNT_KEY: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_KEY }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          BUCKET: ${{ secrets.BUCKET }}

      - name: Setup Firebase CLI and authenticate
        if: github.ref == 'refs/heads/main'
        run: |
          npm install -g firebase-tools
          echo '${{ secrets.FIREBASE_SERVICE_ACCOUNT_KEY }}' > firebase-service-account.json
        env:
          GOOGLE_APPLICATION_CREDENTIALS: firebase-service-account.json

      - name: Deploy to Firebase
        if: github.ref == 'refs/heads/main'
        run: |
          firebase deploy --only functions --project barbecue-trio
        env:
          GOOGLE_APPLICATION_CREDENTIALS: firebase-service-account.json

      - name: Cleanup sensitive files
        if: always() && github.ref == 'refs/heads/main'
        run: |
          rm -f firebase-service-account.json
          echo "Sensitive files cleaned up"
```

### 3.2 Functions 専用 CI ワークフロー

**ファイル**: `.github/workflows/functions-ci.yml`

```yaml
name: Functions CI

on:
  pull_request:
    branches:
      - main
      - develop
    paths:
      - "functions/**"
      - ".github/workflows/functions-ci.yml"
  push:
    branches:
      - develop
    paths:
      - "functions/**"

jobs:
  lint-and-build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
          cache-dependency-path: "functions/package-lock.json"

      - name: Install dependencies
        run: |
          cd functions
          npm ci

      - name: Lint check
        run: |
          cd functions
          npm run lint

      - name: Format check
        run: |
          cd functions
          npm run format

      - name: Build check
        run: |
          cd functions
          npm run build

      - name: Check for build artifacts
        run: |
          cd functions
          if [ ! -d "lib" ]; then
            echo "ERROR: Build artifacts not found in lib directory"
            exit 1
          fi
          echo "Build artifacts verified successfully"

      - name: Verify TypeScript compilation
        run: |
          cd functions
          if [ ! -f "lib/index.js" ]; then
            echo "ERROR: Main entry point lib/index.js not found"
            exit 1
          fi
          echo "TypeScript compilation verified successfully"
```

---

## 🔧 Phase 4: Firebase 設定の最適化

### 4.1 firebase.json の更新

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs22",
    "ignore": ["node_modules/.cache"]
  }
}
```

### 4.2 実行手順

```bash
# 1. firebase.json の更新確認
cat firebase.json

# 2. Firebase CLI でローカルテスト
cd functions
npm run serve

# 3. エンドポイント動作確認
# http://localhost:5001/barbecue-trio/asia-northeast1/processMenuImage
# http://localhost:5001/barbecue-trio/asia-northeast1/generateFoodCulture
# http://localhost:5001/barbecue-trio/asia-northeast1/generateCategories
# http://localhost:5001/barbecue-trio/asia-northeast1/testProcessMenuImage
```

---

## 🔐 Phase 5: GitHub Secrets 設定

### 5.1 必要な Secrets

| Secret 名                      | 説明                                    | 取得方法                                                 |
| ------------------------------ | --------------------------------------- | -------------------------------------------------------- |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase サービスアカウントキー（JSON） | Firebase Console → プロジェクト設定 → サービスアカウント |
| `GEMINI_API_KEY`               | Google Gemini API キー                  | Google AI Studio                                         |
| `BUCKET`                       | Firebase Storage バケット名             | Firebase Console → Storage                               |

### 5.2 設定手順

```bash
# 1. GitHub リポジトリ → Settings → Secrets and variables → Actions

# 2. New repository secret で以下を追加:
# - FIREBASE_SERVICE_ACCOUNT_KEY: {"type": "service_account", ...}
# - GEMINI_API_KEY: AIza...
# - BUCKET: barbecue-trio.appspot.com

# 3. Environment設定
# - Environment名: FIREBASE
# - Required reviewers: (必要に応じて)
```

### 5.3 サービスアカウントキー取得

```bash
# Firebase CLI でサービスアカウントキー生成
firebase projects:list
firebase use barbecue-trio

# または Firebase Console から手動ダウンロード
# プロジェクト設定 → サービスアカウント → 新しい秘密鍵の生成
```

---

## 🧪 Phase 6: ローカルテスト・検証

### 6.1 ローカル開発環境セットアップ

```bash
# 1. Firebase Emulator スイートのインストール
npm install -g firebase-tools

# 2. プロジェクト初期化確認
firebase use barbecue-trio

# 3. エミュレーター起動
cd functions
npm run serve

# 4. 別ターミナルでテスト実行
curl -X POST http://localhost:5001/barbecue-trio/asia-northeast1/testProcessMenuImage \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### 6.2 ビルド・デプロイテスト

```bash
# 1. ローカルビルドテスト
cd functions
npm run build
npm run lint

# 2. Firebase Functions デプロイテスト（dry-run相当）
firebase deploy --only functions --project barbecue-trio --debug

# 3. エンドポイント動作確認
# - processMenuImage
# - generateFoodCulture
# - generateCategories
# - testProcessMenuImage
```

---

## 📊 Phase 7: 本番デプロイ・監視

### 7.1 段階的デプロイ戦略

```bash
# 1. 開発環境デプロイ
git checkout develop
git push origin develop
# → functions-ci.yml が実行される

# 2. 本番環境デプロイ
git checkout main
git merge develop
git push origin main
# → deploy-functions.yml が実行される

# 3. デプロイ確認
firebase functions:log --project barbecue-trio
```

### 7.2 監視・ログ確認

```bash
# 1. Firebase Console でのモニタリング
# - Functions → 各エンドポイントの実行状況
# - Logs → エラーログ確認

# 2. CLI でのログ確認
firebase functions:log --project barbecue-trio --only processMenuImage
firebase functions:log --project barbecue-trio --only generateFoodCulture

# 3. パフォーマンス監視
# - 実行時間
# - メモリ使用量
# - エラー率
```

### 7.3 ロールバック手順

```bash
# 1. 問題発生時の緊急ロールバック
firebase functions:delete processMenuImage --project barbecue-trio
firebase deploy --only functions --project barbecue-trio

# 2. GitHub Actions でのロールバック
# - 前のコミットに戻してpush
# - または手動でFirebase Console から無効化
```

---

## 🔄 Phase 8: 継続的改善

### 8.1 開発ワークフロー最適化

```yaml
# 将来的な改善案:
# 1. テスト自動化
#    - Jest によるユニットテスト
#    - Firebase Emulator でのインテグレーションテスト

# 2. セキュリティ強化
#    - Dependabot によるセキュリティアップデート
#    - SAST (Static Application Security Testing)

# 3. パフォーマンス最適化
#    - Bundle サイズ監視
#    - Cold start 時間の最適化
```

### 8.2 監視・アラート設定

```bash
# 1. Firebase Alerts 設定
# - 関数エラー率 > 5%
# - 実行時間 > 30秒
# - メモリ使用率 > 80%

# 2. GitHub Actions 通知
# - Slack integration
# - Email notifications
```

---

## 📋 チェックリスト

### Phase 2 完了チェック

- [ ] functions/biome.json 作成
- [ ] npm run lint エラー解消
- [ ] npm run build 成功確認

### Phase 3 完了チェック

- [ ] .github/workflows/deploy-functions.yml 作成
- [ ] .github/workflows/functions-ci.yml 作成
- [ ] ワークフロー構文チェック

### Phase 4 完了チェック

- [ ] firebase.json 更新
- [ ] ローカルエミュレーター動作確認

### Phase 5 完了チェック

- [ ] GitHub Secrets 設定完了
- [ ] Environment 設定完了

### Phase 6 完了チェック

- [ ] ローカルテスト成功
- [ ] 全エンドポイント動作確認

### Phase 7 完了チェック

- [ ] 本番デプロイ成功
- [ ] ログ・監視確認

---

## 🚨 トラブルシューティング

### よくある問題と解決策

1. **Biome lint エラー**

   ```bash
   # libディレクトリを削除してリビルド
   rm -rf functions/lib
   cd functions && npm run build
   ```

2. **GitHub Actions 権限エラー**

   ```bash
   # Environment設定とSecrets設定を再確認
   # FIREBASE_SERVICE_ACCOUNT_KEY の JSON形式を確認
   ```

3. **Firebase デプロイエラー**

   ```bash
   # プロジェクト設定確認
   firebase use --list
   firebase use barbecue-trio
   ```

4. **Node.js バージョンエラー**
   ```bash
   # package.json の engines.node が "22" になっているか確認
   # GitHub Actions の node-version が "22" になっているか確認
   ```

---

## 📞 サポート・参考資料

- [Firebase Functions ドキュメント](https://firebase.google.com/docs/functions)
- [Biome 公式ドキュメント](https://biomejs.dev/)
- [GitHub Actions ドキュメント](https://docs.github.com/en/actions)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/)

---

**作成日**: 2024 年 12 月 24 日  
**バージョン**: 1.0  
**対象プロジェクト**: barbecue-trio/hackathon-app
