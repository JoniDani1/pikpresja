// ==========================
// BACKEND (server.js) using ChatGPT API (GPT-3.5 Turbo)
// ==========================
const express = require("express");
const fs = require("fs").promises;
const nspell = require("nspell");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
require("dotenv").config();
//const fileUpload = require("express-fileupload");

const { OpenAI } = require("openai");

const app = express();
<<<<<<< HEAD
const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });
=======
>>>>>>> e85ad03acf50d7a7c19208fd7d76a4484f226251

const frontendPath = path.join(__dirname, "../docs");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(cors());
app.use(express.json());
//app.use(fileUpload({ limits: { fileSize: 5 * 1024 * 1024 }, abortOnLimit: true, createParentPath: true }));

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


const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
    if(!req.file){
        return res.status(400).json({ error: "No file uploaded." });
    }
try{
   res.json({ message: "File uploaded successfully.", filePath: req.file.path });
} catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Server error during file upload." });
  }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));