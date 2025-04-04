// ==========================
// BACKEND (server.js) using ChatGPT API (GPT-3.5 Turbo)
// ==========================
const express = require("express");
const fs = require("fs").promises;
const nspell = require("nspell");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const { OpenAI } = require("openai");

const app = express();
const openai = new OpenAI({
    apiKey: "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"
});

// ✅ Updated frontend path from "frontend" to "docs"
const frontendPath = path.join(__dirname, "docs");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(cors());
app.use(express.json());
app.use(fileUpload({ limits: { fileSize: 5 * 1024 * 1024 }, abortOnLimit: true, createParentPath: true }));

const uploadsDir = path.join(__dirname, "uploads");
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

const affPath = path.join(__dirname, "sq_AL_cleaned.aff");
const dicPath = path.join(__dirname, "sq_AL_cleaned.dic");

async function loadDictionary() {
    try {
        const aff = await fs.readFile(affPath, "utf8");
        const dic = await fs.readFile(dicPath, "utf8");
        return nspell(aff, dic);
    } catch (error) {
        console.error("Error loading dictionary:", error);
        process.exit(1);
    }
}

const spellCheckerPromise = loadDictionary();
const maxSuggestions = 3;
const isNumber = (word) => /^[0-9.,-]+$/.test(word);
const cleanWord = (word) => word.replace(/[.,!?]/g, "");

app.get("/ping", (req, res) => {
    res.json({ status: "Server is running 🚀" });
});

// ✅ Spell Checker
app.post("/spellcheck", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "No text provided." });

        const spellChecker = await spellCheckerPromise;
        const words = text.split(/\s+/).map(cleanWord);
        const results = words.map((word) => {
            if (isNumber(word)) return { word, suggestions: [] };
            if (!spellChecker.correct(word)) {
                return { word, suggestions: spellChecker.suggest(word).slice(0, maxSuggestions) };
            }
            return { word, suggestions: [] };
        });

        res.json(results);
    } catch (error) {
        console.error("Error processing spellcheck request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const { diffWords } = require("diff");

app.post("/grammarcheck", async (req, res) => {
    const { text } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an assistant that only checks and corrects grammar or spelling mistakes. Do not comment, summarize, explain, translate, or do anything outside of correcting the text."
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
                    i++; // Skip the added part
                }
            }
        }

        res.json({ corrected, suggestions });

    } catch (error) {
        console.error("OpenAI Error:", error.message);
        res.status(500).json({ error: "Failed to process grammar check." });
    }
});

app.post("/upload", async (req, res) => {
    try {
        if (!req.files || !req.files.file) return res.status(400).json({ error: "No file uploaded." });

        let uploadedFile = req.files.file;
        if (path.extname(uploadedFile.name).toLowerCase() !== ".txt") {
            return res.status(400).json({ error: "Only .txt files are allowed." });
        }

        const filePath = path.join(uploadsDir, uploadedFile.name);
        await uploadedFile.mv(filePath);
        const fileContent = await fs.readFile(filePath, "utf8");
        const spellChecker = await spellCheckerPromise;

        const words = fileContent.split(/\s+/).map(cleanWord);
        const results = words.map((word) => {
            if (isNumber(word)) return { word, suggestions: [] };
            if (!spellChecker.correct(word)) {
                return { word, suggestions: spellChecker.suggest(word).slice(0, maxSuggestions) };
            }
            return { word, suggestions: [] };
        });

        await fs.unlink(filePath);
        res.json(results);
    } catch (error) {
        console.error("Error processing file upload:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
