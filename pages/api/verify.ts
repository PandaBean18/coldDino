import { createPublicKey } from "crypto";
import { verify } from "jsonwebtoken"
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface individualKeyInterface {
    kid: string,
    n: string,
    kty: string, 
    e: string,
}

interface keysInterface {
    keys: Array<individualKeyInterface>
}

interface googleCertsResp {
    data: keysInterface,
    status: number,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const token = req.body["token"];
        const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
        const resp: googleCertsResp = await axios.get("https://www.googleapis.com/oauth2/v3/certs");
        const key = resp.data.keys.find(key => key.kid === header.kid);

        if (!key) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }

        const publicKey = createPublicKey({
            key: {
            kty: key!.kty,
            n: key!.n,
            e: key!.e
            },
            format: 'jwk'
        }).export({ type: 'spki', format: 'pem' });
        try {
            let v = verify(token, publicKey, {algorithms: ["RS256"]});

            if (typeof(v) !== "string") {
                console.log(v.exp);
                res.status(200).json({"message": "valid token", "expiry": v.exp})
            } else {
                console.log("failure")
                res.status(401).json({"message": "invalid token"})
            }
        } catch {
            res.status(401).json({"message": "invalid token"})
        }
    } else {
        res.status(405).json({"error": "method not allowed"});
    }
}