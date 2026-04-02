import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check
app.get("/", (req, res) => {
  res.send("AI Conversation Tool is running");
});

// Main processor
app.post("/process", async (req, res) => {
  try {
    const { text, action } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    let systemPrompt = "";

    if (action === "summarize") {
      systemPrompt =
        "Summarize the following buyer/customer conversation clearly and professionally.";
    } else if (action === "respond") {
      systemPrompt =
        "Write a professional, polite customer service reply for this conversation. Keep it clear and helpful.";
    } else {
      systemPrompt =
        "Analyze the following text and provide helpful insights.";
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
    });

    res.json({
      result: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
