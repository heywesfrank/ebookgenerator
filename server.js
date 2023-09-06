
const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.post('/generate-text', async (req, res) => {
    try {
        const userInput = req.body.prompt;
        const response = await openai.chat.completions.create({
            messages: [{ role: "user", content: userInput }],
            model: "gpt-3.5-turbo",
        });
        
        res.json({ text: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/generate-outline', async (req, res) => {
    try {
        const ebookTitle = req.body.title;
        const response = await openai.chat.completions.create({
            messages: [{ role: "user", content: `Generate a 3 chapter outline for an ebook titled "${ebookTitle}"` }],
            model: "gpt-3.5-turbo",
        });
        
        const outline = response.choices[0].message.content;
        const chapters = outline.split('\n').slice(0, 3); // Get the first 3 chapters
        
        res.json({
            chapter1: chapters[0] || '',
            chapter2: chapters[1] || '',
            chapter3: chapters[2] || ''
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
