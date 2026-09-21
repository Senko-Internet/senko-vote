import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import { config } from "./config.js";
import { forwardMessage, isVoteFormMessage } from "./forward.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

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

client.login(config.token);
