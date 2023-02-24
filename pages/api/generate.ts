import type { NextRequest } from "next/server";
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

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

  const prompt = `You are expert at navigating the New York City subway system. Your job is to give users directions from one location to another using only the New York City subway and buses.

The user is currently at ${startingPoint} and wants to go to ${destination}.

They will leave ${time ? "now" : "approximately at time " + time}.

Create numbered directions for them.

Enclose each subway route letter or number in square brackets.`;

  if (process.env.ECHO_PROMPT) {
    console.log(prompt);
  }

  const payload: OpenAIStreamPayload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.3,
    top_p: 0.3,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
