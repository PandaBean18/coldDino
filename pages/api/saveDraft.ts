import { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "cookies-next";
import axios from "axios";
import { db } from "@/utils/firebase";
import { decode } from "jsonwebtoken";

interface EmailData {
    to: string;
    subject: string;
    body: string;
}

interface GoogleTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

async function sendMail(accessToken: string, data: EmailData) {
    const emailLines = [
        `To: ${data.to}`,
        "Content-Type: text/html; charset=utf-8",
        "MIME-Version: 1.0",
        `Subject: ${data.subject}`,
        "",
        data.body
    ];

    const rawEmail = Buffer.from(emailLines.join("\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

    try {
        await axios.post("https://gmail.googleapis.com/gmail/v1/users/me/drafts", {
            message: {
                raw: rawEmail
            }
        }, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
            }
        });
        return true;
    } catch (error: any) {
        console.log(error.response)
        return false;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        return res.status(405).json({"message": "method not allowed"});
    }

    const cookieStore = req.cookies;
    const jwt = cookieStore.coldDinoJwt;

    if (jwt === undefined) {
        return res.status(403).json({ "message": "JWT not found" });
    }

    const decodedJwt = decode(jwt);

    if (decodedJwt === null || typeof(decodedJwt) === 'string') {
        return res.status(403).json({ "message": "Invalid JWT" });
    }

    const userSub = decodedJwt.sub;

    if (userSub === undefined){
        return res.status(403).json({ "message": "user SUB not found in JWT" });
    }

    const docRef = db.collection("authTokens").doc(userSub) // doc(db, "authTokens", userSub);
    const docSnap = await docRef.get();
    const data = req.body as EmailData;

    if (docSnap.exists) {
        let t = docSnap.data() as GoogleTokens;

        if (Date.now() > t.expires_in * 1000) {
            try {
                await axios.post("/api/getGmailAuthTokens");
                const s = await getCookie("gmail_tokens",  {req, res});
                if (s) {
                    t = JSON.parse(s) as GoogleTokens;
                } else {
                    return res.status(403).json({ "message": "Token refreshing failed" })
                }
                
            } catch {
                return res.status(403).json({ "message": "Invalid token" });
            }
        }

        const accestToken = t.access_token;
        const v = await sendMail(accestToken, data);

        if (v) {
            return res.status(200).json({"message": "mail sent successfully"});
        } else {
            return res.status(422).json({"message": "mail could not be sent"});

        }
    } else {
        return res.status(403).json({ "message": "Token not found" })
    }
}