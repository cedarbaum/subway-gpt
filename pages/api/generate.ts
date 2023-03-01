import type { NextRequest } from "next/server";
import {
  OpenAIStream,
  OpenAIStreamPayload,
  Message,
} from "../../utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest): Promise<Response> => {
  const { startingPoint, destination, time } = (await req.json()) as {
    startingPoint?: string;
    destination?: string;
    time?: string;
  };

  if (!startingPoint || !destination) {
    return new Response("No startingPoint or destination in the request", {
      status: 400,
    });
  }

  const systemMessage: Message = {
    role: "system",
    content: `You are expert at navigating the New York City subway system. Your job is to give users directions from one location to another using the New York City subway.`,
  };

  const userMessage: Message = {
    role: "user",
    content: `Find directions from ${startingPoint} to ${destination}.

I will leave ${!time ? "now" : "approximately at time " + time}.

Create numbered directions and enclose each subway route letter or number in square brackets.`,
  };

  if (process.env.ECHO_PROMPT) {
    console.log(userMessage.content);
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [systemMessage, userMessage],
    stream: true,
    max_tokens: 200,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
