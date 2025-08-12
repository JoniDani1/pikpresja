// ==========================
// BACKEND (server.js) using ChatGPT API (GPT-3.5 Turbo)
// ==========================
const express = require("express");

const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { OpenAI } = require("openai");

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });
const { diffWords } = require("diff");

const frontendPath = path.join(__dirname, "../docs");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(cors());
app.use(express.json());


app.get("/ping", (req, res) => {
    res.json({ status: "Server is running 🚀" });
});


app.post("/grammarcheck", async (req, res) => {
    const { text } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an assistant that only checks and corrects grammar or spelling mistakes in Albanian language . Do not comment, summarize, explain, translate, or do anything outside of correcting the text."
                },
                {
                    role: "user",
                    content: text
                }
            ],
            temperature: 0.2
        });

        const corrected = completion.choices[0].message.content.trim();

        const changes = diffWords(text, corrected);
        const suggestions = [];

        for (let i = 0; i < changes.length; i++) {
            const part = changes[i];

            if (part.removed) {
                const next = changes[i + 1];
                if (next && next.added) {
                    suggestions.push({
                        word: part.value.trim(),
                        suggestions: [next.value.trim()]
                    });
                    i++; 
                }
            }
        }

        res.json({ corrected, suggestions });

    } catch (error) {
        console.error("OpenAI Error:", error.message);
        res.status(500).json({ error: "Failed to process grammar check." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));