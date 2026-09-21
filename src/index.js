import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import express from 'express'; // ⭕ インポート文を上部に整理
import { config } from "./config.js";
import { forwardMessage, isVoteFormMessage } from "./forward.js";

// ==========================================
// 1. Render用ダッシュボード（Webサーバー）の起動
// ==========================================
const app = express();
const PORT = process.env.PORT || 10000;

// Renderからの通信に「動いてるよ」と即座に応答するルート
app.get('/', (req, res) => {
  res.send('Senko-Vote Bot is running perfectly!');
});

// サーバーを指定ポートで起動
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Render] Webサーバーがポート ${PORT} で起動しました。`);
});

// ==========================================
// 2. Discord Bot（Discord.js）の処理
// ==========================================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.on("debug", (info) => console.log(`[Discord Debug] ${info}`));
client.on("error", (error) => console.error(`[Discord Error]`, error));

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Senko-Vote 起動完了: ${readyClient.user.tag}`);
  console.log(`監視チャンネル: ${config.sourceChannelId}`);
  console.log(`転送先チャンネル: ${config.destinationChannelId}`);

  readyClient.user.setActivity("投票転送中", { type: ActivityType.Watching });
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.channelId !== config.sourceChannelId) {
    return;
  }

  if (config.pollOnly && !isVoteFormMessage(message)) {
    return;
  }

  const destinationChannel = await client.channels.fetch(config.destinationChannelId);
  if (!destinationChannel?.isTextBased()) {
    console.error("転送先チャンネルが見つからないか、テキストチャンネルではありません");
    return;
  }

  try {
    await forwardMessage(message, destinationChannel);
    console.log(`転送成功: ${message.id}`);
  } catch (error) {
    console.error(`転送失敗 (${message.id}):`, error);
  }
});

// 最後にDiscordにログイン
client.login(config.token);
