import { Voice } from "https://deno.land/x/grammy_types@v3.9.0/message.ts";
import { ProcessReturn } from "../types.ts";
import processText from "./process-text.ts";

export default async function processVoice(
  voice: Voice,
  user: Profile,
  path?: string,
): Promise<ProcessReturn> {
  const { duration, mime_type } = voice;

  if (duration > 30) {
    return {
      reply: "voice.too-long",
      operations: [],
      ids: [],
    };
  }

  try {
    const blob = await fetch(
      `https://api.telegram.org/file/bot${
        Deno.env.get("TELEGRAM_BOT_TOKEN")
      }/${path}`,
    ).then((res) => res.blob());

    const file = new File([blob], "audiofile", {
      type: mime_type,
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");
    formData.append("response_format", "text");
    formData.append("language", user.settings.language);

    const transcription = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get("OPENAI_API_TOKEN")!}`,
        },
        body: formData,
      },
    );

    if (!transcription.ok) {
      return {
        reply: "error",
        ids: [],
        operations: [],
      };
    }

    const textMessage = await transcription.text();
    return await processText(textMessage, user);
  } catch (err) {
    console.error(err);
    return {
      reply: "error",
      operations: [],
      ids: [],
    };
  }
}
