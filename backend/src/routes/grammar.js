const express = require('express');
const { checkGrammar } = require('../openAiService');

const router = express.Router();

// Ping route
router.get("/ping", (req, res) => {
    res.json({ status: "Server is running 🚀" });
});

// Grammar check route
router.post("/grammarcheck", async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const result = await checkGrammar(text);
        res.json(result);
    } catch (error) {
        // The service layer already logged the specific error
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
