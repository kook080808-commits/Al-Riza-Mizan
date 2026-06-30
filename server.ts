import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// API route
app.post('/api/gemini', async (req, res) => {
  try {
    const { question, lang, history } = req.body;
    if (!question && !history) {
      return res.status(400).json({ error: 'Question or history is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured.' });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    let systemInst = "Siz \"AL-RIZA MIZAN\" advokatlik byurosi professional va tajribali advokatisiz (Muhammadjon O'lmasov boshchiligidagi). Mijozga uning yozgan tilida (o'zbekcha) juda professional, aniq va ishonchli yuridik maslahat bering (O'zbekiston Respublikasi qonunchiligi asosida). Sizu biz deb murojaat qiling. DIQQAT: Javobingiz juda lo'nda, qisqa va aniq bo'lsin, o'rtacha 4-5 ta gapdan iborat bo'lsin va aslo undan oshmasin! Savol beruvchiga to'g'ri, xatosiz, ishonchli va aniq javob bering.";
    if (lang === 'ru') {
      systemInst = "Вы являетесь профессиональным и опытным адвокатом адвокатского бюро \"AL-RIZA MIZAN\" (под руководством Мухаммаджона Улмасова). Предоставьте клиенту краткую, точную юридическую консультацию на русском языке на основе законодательства Республики Узбекистан. Будьте очень кратки, максимум 4-5 предложений! Дайте абсолютно точный, надежный и безошибочный ответ.";
    } else if (lang === 'en') {
      systemInst = "You are a professional attorney at the \"AL-RIZA MIZAN\" advocacy bureau (led by Muhammadjon O'lmasov). Provide the client with brief, precise, and polite legal advice in English based on the legislation of the Republic of Uzbekistan. Your response must be very short and concise, averaging 4-5 sentences max, and completely accurate without mistakes.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: (history && Array.isArray(history) && history.length > 0) ? history : question,
      config: {
        systemInstruction: systemInst,
        temperature: 0.3,
      }
    });

    const text = response.text;
    res.json({ text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Error occurred while calling Gemini API' });
  }
});

// Determine static folder (serve root if build hasn't run yet, otherwise build output)
const distPath = path.join(__dirname, 'dist');
const staticPath = fs.existsSync(distPath) ? distPath : __dirname;

app.use(express.static(staticPath));

// Fallback to index.html for SPA routing if any
app.get('*any', (_req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}, serving ${staticPath}`);
});