import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import { NextApiRequest, NextApiResponse } from "next";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL_NAME = process.env.GEMINI_MODEL_NAME;
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    

    if (req.method === "POST") {
        const input = `
Domain: ${req.body["domain"]}
Title: ${req.body["title"]}
Content: ${req.body["content"]}
Excerpt: ${req.body["excerpt"]}
`;      
        const response = await ai.models.generateContent({
            model: `tunedModels/${GEMINI_MODEL_NAME}`,
            contents: input
        })
        res.status(200).json({"text": response.text});
    } else {
        res.status(405).json({"error": "method not allowed"});
    }
}