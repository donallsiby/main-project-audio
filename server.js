import express from 'express';
import cors from 'cors';
import torchaudio from 'torchaudio';
import { AudioGen } from 'audiocraft.models';
import { audio_write } from 'audiocraft.data.audio';

// Load the pre-trained model
const model = AudioGen.get_pretrained('facebook/audiogen-medium');
model.set_generation_params(duration=5); // generate 5 seconds of audio

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Function to generate audio from a user prompt
const generateAudioFromPrompt = async (prompt, index) => {
    let wav;
    try {
        wav = await model.generate([prompt]);
    } catch (error) {
        console.error("Error generating audio:", error);
        throw new Error('Audio generation failed');
    }

    audio_write(`./generated_audio/${index}.wav`, wav[0].cpu(), model.sample_rate, { strategy: "loudness", loudness_compressor: true });

    return `./audio/${index}.wav`;
};

// API endpoint to generate sound
app.post('/generate-sound', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }
    try {
        const audioFilePath = await generateAudioFromPrompt(prompt, Date.now());
        res.json({ audioFilePath });
    } catch (error) {
        res.status(500).json({ error: 'Error generating audio' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
