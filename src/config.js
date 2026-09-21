import "dotenv/config";

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`環境変数 ${name} が設定されていません`);
  }
  return value;
}

export const config = {
  token: requireEnv("DISCORD_TOKEN"),
  sourceChannelId: requireEnv("SOURCE_CHANNEL_ID"),
  destinationChannelId: requireEnv("DESTINATION_CHANNEL_ID"),
  pollOnly: process.env.FORWARD_POLL_ONLY === "true",
};
