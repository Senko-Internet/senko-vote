# Senko-Vote（投票転送Bot）

特定のDiscordチャンネルに投稿された投票フォームを、別のチャンネルへ自動転送するBotです。

## 機能

- 監視チャンネル（`SOURCE_CHANNEL_ID`）に新しいメッセージが投稿されると、転送先チャンネル（`DESTINATION_CHANNEL_ID`）へ転送
- Discordネイティブ投票（Poll）の転送に対応
- 埋め込み（Embed）や添付ファイル付きメッセージにも対応
- `FORWARD_POLL_ONLY=true` にすると、投票フォームと判定されたメッセージのみ転送

## 必要な権限（Discord Developer Portal）

Botに以下を付与してください。

- **Intents**
  - `MESSAGE CONTENT INTENT`（必須）
  - `SERVER MEMBERS INTENT`（不要）
- **Bot Permissions**
  - View Channels
  - Send Messages
  - Embed Links
  - Attach Files
  - Read Message History

## ローカル実行

```bash
npm install
cp .env.example .env
# .env を編集してトークンとチャンネルIDを設定
npm start
```

## Render へのデプロイ

1. このリポジトリを GitHub にプッシュ
2. [Render Dashboard](https://dashboard.render.com/) で **New > Blueprint** を選択
3. リポジトリを接続（`render.yaml` を自動検出）
4. 環境変数を設定
   - `DISCORD_TOKEN`
   - `SOURCE_CHANNEL_ID`
   - `DESTINATION_CHANNEL_ID`
   - （任意）`FORWARD_POLL_ONLY`
5. デプロイ

> Render では **Worker** サービスとして動作します（Webサーバー不要）。

## 環境変数

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `DISCORD_TOKEN` | ✅ | Botトークン |
| `SOURCE_CHANNEL_ID` | ✅ | 投票フォームが投稿されるチャンネルID |
| `DESTINATION_CHANNEL_ID` | ✅ | 転送先チャンネルID |
| `FORWARD_POLL_ONLY` | - | `true` で投票フォームのみ転送（デフォルト: `false`） |

## Bot名の設定

Discord Developer Portal の **Bot** タブで、ユーザー名を `Senko-Vote` に設定してください。
