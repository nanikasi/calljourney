import fastifyFormBody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";
import dotenv from "dotenv";
import Fastify from "fastify";
import * as fs from "node:fs";
import twilio from "twilio";
import WebSocket from "ws";

// Load environment variables from .env file
dotenv.config();

// Retrieve the OpenAI API key from environment variables. You must have OpenAI Realtime API access.
const {
  OPENAI_API_KEY,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} = process.env;

if (
  !OPENAI_API_KEY ||
  !TWILIO_ACCOUNT_SID ||
  !TWILIO_AUTH_TOKEN ||
  !TWILIO_PHONE_NUMBER
) {
  console.error(
    "Missing required environment variables. Please set them in the .env file.",
  );
  process.exit(1);
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Initialize Fastify
const fastify = Fastify();
fastify.register(fastifyFormBody);
fastify.register(fastifyWs);

// Constants
const SYSTEM_MESSAGE = fs.readFileSync("./prompt.txt", "utf8");
const VOICE = "alloy";
const PORT = process.env.PORT || 5050; // Allow dynamic port assignment
const HOST = "RENDER" in process.env ? "0.0.0.0" : "localhost";

// List of Event Types to log to the console. See OpenAI Realtime API Documentation. (session.updated is handled separately.)
const LOG_EVENT_TYPES = [
  "response.content.done",
  "rate_limits.updated",
  "response.done",
  "input_audio_buffer.committed",
  "input_audio_buffer.speech_stopped",
  "input_audio_buffer.speech_started",
  "session.created",
];

fastify.addHook("onRequest", async (request, reply) => {
  reply.header("ngrok-skip-browser-warning", "true");
});

// Root Route
fastify.get("/", async (request, reply) => {
  reply.send({ message: "Twilio Media Stream Server is running!" });
});

fastify.post("/call", async (request, reply) => {
  const { number, restaurant_number, name, reserve_date } = request.query;

  if (!number || !restaurant_number || !name || !reserve_date) {
    return reply.status(400).send({ error: "vars are required" });
  }

  try {
    // Make the call using Twilio
    const call = await client.calls.create({
      to: restaurant_number, // The number to call
      from: TWILIO_PHONE_NUMBER, // Your Twilio phone number
      url: `https://${request.headers.host}/incoming-call?number=${encodeURIComponent(number)}&name=${encodeURIComponent(name)}&reserve_date=${encodeURIComponent(reserve_date)}`, // The URL for TwiML instructions
    });

    reply.send({ message: `Calling ${number}`, callSid: call.sid });
  } catch (error) {
    console.error("Error making call:", error);
    reply.status(500).send({ error: "Failed to make the call" });
  }
});

// Route for Twilio to handle incoming and outgoing calls
// <Say> punctuation to improve text-to-speech translation
fastify.all("/incoming-call", async (request, reply) => {
  const { number, name, reserve_date } = request.query;
  const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
                          <Response>
                              <Say>O.K.</Say>
                              <Connect>
                                  <Stream url="wss://${request.headers.host}/media-stream?number=${encodeURIComponent(number)}&name=${encodeURIComponent(name)}&reserve_date=${encodeURIComponent(reserve_date)}" />
                              </Connect>
                          </Response>`;

  reply.type("text/xml").send(twimlResponse);
});

// WebSocket route for media-stream
fastify.register(async (fastify) => {
  fastify.get("/media-stream", { websocket: true }, (connection, req) => {
    console.log("Client connected");

    const openAiWs = new WebSocket(
      "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01",
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "realtime=v1",
        },
      },
    );

    let streamSid = null;

    const sendSessionUpdate = () => {
      const prompt = `${SYSTEM_MESSAGE}\n- 【予約時間】本日の18時\n- 【電話番号】080 1234 5678 \n- 【名前】なかにし なおと`;

      const sessionUpdate = {
        type: "session.update",
        session: {
          turn_detection: { type: "server_vad" },
          input_audio_format: "g711_ulaw",
          output_audio_format: "g711_ulaw",
          voice: VOICE,
          instructions: prompt,
          modalities: ["text", "audio"],
          temperature: 0.8,
        },
      };

      console.log("Sending session update:", JSON.stringify(sessionUpdate));
      openAiWs.send(JSON.stringify(sessionUpdate));
    };

    // Open event for OpenAI WebSocket
    openAiWs.on("open", () => {
      console.log("Connected to the OpenAI Realtime API");
      setTimeout(sendSessionUpdate, 250);
    });

    // Listen for messages from the OpenAI WebSocket (and send to Twilio if necessary)
    openAiWs.on("message", (data) => {
      try {
        const response = JSON.parse(data);

        if (LOG_EVENT_TYPES.includes(response.type)) {
          console.log(`Received event: ${response.type}`, response);
        }

        if (response.type === "session.updated") {
          console.log("Session updated successfully:", response);
        }

        if (response.type === "response.audio.delta" && response.delta) {
          const audioDelta = {
            event: "media",
            streamSid: streamSid,
            media: {
              payload: Buffer.from(response.delta, "base64").toString("base64"),
            },
          };
          connection.send(JSON.stringify(audioDelta));
        }
      } catch (error) {
        console.error(
          "Error processing OpenAI message:",
          error,
          "Raw message:",
          data,
        );
      }
    });

    // Handle incoming messages from Twilio
    connection.on("message", (message) => {
      try {
        const data = JSON.parse(message);

        switch (data.event) {
          case "media":
            if (openAiWs.readyState === WebSocket.OPEN) {
              const audioAppend = {
                type: "input_audio_buffer.append",
                audio: data.media.payload,
              };

              openAiWs.send(JSON.stringify(audioAppend));
            }
            break;
          case "start":
            streamSid = data.start.streamSid;
            console.log("Incoming stream has started", streamSid);
            break;
          default:
            console.log("Received non-media event:", data.event);
            break;
        }
      } catch (error) {
        console.error("Error parsing message:", error, "Message:", message);
      }
    });

    // Handle connection close
    connection.on("close", () => {
      if (openAiWs.readyState === WebSocket.OPEN) openAiWs.close();
      console.log("Client disconnected.");
    });

    // Handle WebSocket close and errors
    openAiWs.on("close", () => {
      console.log("Disconnected from the OpenAI Realtime API");
    });

    openAiWs.on("error", (error) => {
      console.error("Error in the OpenAI WebSocket:", error);
    });
  });
});

fastify.listen({ host: HOST, port: PORT }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is listening on port ${PORT}`);
});
