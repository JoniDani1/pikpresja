const { OpenAI } = require("openai");
const config = require('./config')
const { diffWords } = require("diff");

const openai = new OpenAI({apiKey:config.openaiApiKey});

async function checkGrammar(text) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an assistant that only checks and corrects grammar or spelling mistakes in Albanian language . Do not comment, summarize, explain, translate, or do anything outside of correcting the text.",
                },
                {
                    role: "user",
                    content: text,
                },
            ],
            temperature: 0.2,
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
                        suggestions: [next.value.trim()],
                    });
                    i++;
                }
            }
        }

        return { corrected, suggestions };
    } catch (error) {
        console.error("OpenAI Error:", error.message);
        throw new Error("Failed to process grammar check with OpenAI.");
    }
}


module.exports ={
   checkGrammar,
}

