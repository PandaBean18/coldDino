import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { parseHTML } from "linkedom";
import { Readability } from "@mozilla/readability";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {domain, endpoint} = req.query;

    if (!domain) {
        res.status(400).json({"error": "domain name not sent."});
        return;
    }

    try {
        const response = await axios.get(`https://${domain}${endpoint}`);
        const html = response.data;
        const dom = parseHTML(html);
        const reader = new Readability(dom.document);
        const article = reader.parse();

        if (article) {
            const obj = {
                domain: domain,
                title: article.title,
                content: article.textContent,
                excerpt: article.excerpt,
            };

            res.status(200).json(obj);
            return
        } else {

            throw new Error('Unable to parse content');
        }
    } catch {
        if (domain.indexOf(".") === domain.lastIndexOf(".")) {
            try {
                const response = await axios.get(`https://www.${domain}${endpoint}`);
                const html = response.data;
                const dom = parseHTML(html);
                const reader = new Readability(dom.document);
                const article = reader.parse();
        
                if (article) {
                    const obj = {
                        domain: domain,
                        title: article.title,
                        content: article.textContent,
                        excerpt: article.excerpt,
                    };
        
                    res.status(200).json(obj);
                    return
                } else {
        
                    throw new Error('Unable to parse content');
                }
            } catch {
                res.status(404).json({"error": "there was an error"});
                return;
            }
        } else {
            res.status(404).json({"error": "there was an error"});
            return;
        }
    }
}