/**
 * 投票フォーム（Discord Poll / 埋め込み / 添付ファイル）を転送先へ送る
 */
export async function forwardMessage(message, destinationChannel) {
  if (typeof message.forward === "function") {
    try {
      await message.forward(destinationChannel);
      return;
    } catch (error) {
      console.warn("message.forward() に失敗。手動転送に切り替えます:", error.message);
    }
  }

  const options = {};

  if (message.content) {
    options.content = message.content;
  }

  if (message.embeds.length > 0) {
    options.embeds = message.embeds;
  }

  if (message.attachments.size > 0) {
    options.files = [...message.attachments.values()].map((attachment) => attachment.url);
  }

  if (message.poll) {
    options.poll = {
      question: { text: message.poll.question.text },
      answers: message.poll.answers.map((answer) => {
        const entry = { text: answer.text };
        if (answer.emoji) {
          entry.emoji = answer.emoji.id
            ? { id: answer.emoji.id }
            : { name: answer.emoji.name };
        }
        return entry;
      }),
      duration: message.poll.duration,
      allowMultiselect: message.poll.allowMultiselect,
    };
  }

  if (!options.content && !options.embeds && !options.files && !options.poll) {
    throw new Error("転送可能なコンテンツがありません");
  }

  await destinationChannel.send(options);
}

export function isVoteFormMessage(message) {
  if (message.poll) {
    return true;
  }

  if (message.embeds.length > 0) {
    return true;
  }

  const formPattern = /(forms\.gle|docs\.google\.com\/forms|typeform\.com|surveymonkey\.com)/i;
  return formPattern.test(message.content ?? "");
}
