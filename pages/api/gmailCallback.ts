import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { db } from "@/utils/firebase";
import { decode } from "jsonwebtoken";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ message: "Authorization code missing" });
    }

    try {
        const response = await axios.post("https://oauth2.googleapis.com/token", new URLSearchParams({
            code: code as string,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/gmailCallback`,
            grant_type: "authorization_code"
          }), {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          });

          const obj = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_in: Date.now() + (response.data.expires_in * 1000)
          }

          const cookieStore = req.cookies;
          const jwt = cookieStore.coldDinoJwt;

          if (jwt === undefined) {
            res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/signin`)
            return;
          }

          const decodedJwt = decode(jwt);

          if (decodedJwt === null || typeof(decodedJwt) === "string") {
            res.status(403).json({message: "Error decoding JWT"});
            return;
          }

          const userSub = decodedJwt["sub"];

          if (userSub === undefined){
            res.status(403).json({message: "Uer SUB missing"});
            return;
          }

          try {
            const docRef = db.collection("authTokens").doc(userSub);
            await docRef.set(obj);
            res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL!}/signin/redirect`);
          } catch (e) {
            console.log(e);
            res.status(500).json({message: "Error in storing authentication token"});
            return;
          } 
            
    } catch (error) {
        console.log("OAuth callback error:", error);
        res.status(500).json({ message: "Authentication failed" });
    }
}