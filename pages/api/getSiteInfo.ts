import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { parseHTML } from "linkedom";
import { Readability } from "@mozilla/readability";
import { db } from "@/utils/firebase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).json({message: "method not allowed"});
        return;
    }

    const {domain, endpoint} = req.query;

    const docRef = db.collection("websiteInfoCache").doc(domain as string);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
        const jsonData = {...(docSnap.data())}
        res.status(200).json(jsonData);
        return;
    }


    if (!domain) {
        res.status(400).json({"error": "domain name not sent."});
        return;
    }

    try {
        const response = await axios.get(`https://${domain}${endpoint}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });
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

            try {
                const newDocRef = db.collection("websiteInfoCache").doc(domain as string)
                await newDocRef.set(obj);
            } catch (e) {
                console.log("Error while adding website cache: ", e);
            }

            res.status(200).json(obj);
            return
        } else {

            throw new Error('Unable to parse content');
        }
    } catch (eOut: any) {
        if (eOut.message === "Unable to parse content") {
            try {
                const response = await axios.post("https://cold-dino-scraper.vercel.app/api/scrape", {
                    url: `https://${domain}${endpoint}`,
                    api_key: process.env.COLD_DINO_SCRAPER_API_KEY
                });

                const html = response.data["html"];

                if (html === "") {
                    res.status(404).json({"error": "there was an error"});
                    return;
                }

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

                    try {
                        const newDocRef = db.collection("websiteInfoCache").doc(domain as string);
                        await newDocRef.set(obj);
                    } catch (e) {
                        console.log("Error while adding website cache: ", e);
                    }
        
                    res.status(200).json(obj);
                    return
                } else {
                    throw new Error('Unable to parse content');
                }

            } catch (e: any) {
                if (e.status === 504) {
                    try {
                        const response = await axios.post("https://cold-dino-scraper.vercel.app/api/scrape", {
                            url: `https://${domain}${endpoint}`,
                            api_key: process.env.COLD_DINO_SCRAPER_API_KEY
                        });
        
                        const html = response.data["html"];
        
                        if (html === "") {
                            res.status(404).json({"error": "there was an error"});
                            return;
                        }
        
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
            
                            try {
                                const newDocRef = db.collection("websiteInfoCache").doc(domain as string);
                                await newDocRef.set(obj);
                            } catch (e) {
                                console.log("Error while adding website cache: ", e);
                            }
                
                            res.status(200).json(obj);
                            return
                        } else {
                            res.status(404).json({"error": "there was an error"});
                            return;
                        }
                    } catch {
                        res.status(500).json({"error": "there was an error"});
                        return;
                    }
                } else {
                    res.status(404).json({"error": "there was an error"});
                    return;
                }
            }
        } else if (domain.indexOf(".") === domain.lastIndexOf(".")) {
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

                    try {
                        const newDocRef = db.collection("websiteInfoCache").doc(domain as string);
                        await newDocRef.set(obj);
                    } catch (e) {
                        console.log("Error while adding website cache: ", e);
                    }
        
                    res.status(200).json(obj);
                    return
                } else {
                    throw new Error('Unable to parse content');
                }
            } catch (eIn: any) {
                if (eIn.message === "Unable to parse content") {
                    try {
                        const response = await axios.post("https://cold-dino-scraper.vercel.app/api/scrape", {
                            url: `https://${domain}${endpoint}`,
                            api_key: process.env.COLD_DINO_SCRAPER_API_KEY
                        });
        
                        const html = response.data["html"];
        
                        if (html === "") {
                            res.status(404).json({"error": "there was an error"});
                            return;
                        }
        
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
            
                            try {
                                const newDocRef = db.collection("websiteInfoCache").doc(domain as string);
                                await newDocRef.set(obj);
                            } catch (e) {
                                console.log("Error while adding website cache: ", e);
                            }
                
                            res.status(200).json(obj);
                            return
                        } else {
                            res.status(404).json({"error": "there was an error"});
                            return;
                        }
        
                    } catch (e: any) {
                        if (e.status === 504) {
                            try {
                                const response = await axios.post("https://cold-dino-scraper.vercel.app/api/scrape", {
                                    url: `https://${domain}${endpoint}`,
                                    api_key: process.env.COLD_DINO_SCRAPER_API_KEY
                                });
                
                                const html = response.data["html"];
                
                                if (html === "") {
                                    res.status(404).json({"error": "there was an error"});
                                    return;
                                }
                
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
            
                                    try {
                                        const newDocRef = db.collection("websiteInfoCache").doc(domain as string);
                                        await newDocRef.set(obj);
                                    } catch (e) {
                                        console.log("Error while adding website cache: ", e);
                                    }
                        
                                    res.status(200).json(obj);
                                    return
                                }
                            } catch {
                                res.status(500).json({"error": "there was an error"});
                                return;
                            }
                        }
                        res.status(404).json({"error": "there was an error"});
                        return;
                    }
                }
                res.status(404).json({"error": "there was an error"});
                return;
            }
        } else {
            res.status(404).json({"error": "there was an error"});
            return;
        }
    }
}