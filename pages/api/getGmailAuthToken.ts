"use server"
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { db } from "@/utils/firebase";
import { getDoc, setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { decode } from "jsonwebtoken";

interface GoogleTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

const SCOPES = ["https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/gmail.compose"];

async function refreshAccessToken(refreshToken: string, tokens: GoogleTokens): Promise<GoogleTokens> {
    try {
        const response = await axios.post("https://oauth2.googleapis.com/token", new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: refreshToken,
          redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/gmailCallback`,
          grant_type: "refresh_token"
        }), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });

        const obj: GoogleTokens = {
          access_token: response.data.access_token,
          refresh_token: tokens.refresh_token,
          expires_in: Date.now() + (response.data.expires_in * 1000),
        }

        return obj;
      } catch (error: any) {
        throw new Error("Failed to refresh access token");
      }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    
    try {
        const cookieStore = req.cookies;
        const jwt = cookieStore["coldDinoJwt"];

        if (jwt === undefined) {
          res.status(403).json({message: "Unauthorized, JWT not present"});
          return;
        }
        const decodedJwt = decode(jwt);

        if (decodedJwt === null || typeof(decodedJwt) === "string") {
          res.status(403).json({message: "JWT was not parsed correctly"});
          return;
        }

        const userSub = decodedJwt["sub"];

        if (userSub === undefined) {
          res.status(403).json({message: "Could not extract user SUB from JWT"});
          return;
        }
        const docRef = doc(db, "authTokens", userSub);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            try {
                const tokens: GoogleTokens = docSnap.data() as GoogleTokens;
                if (Date.now() >  tokens.expires_in * 1000) {
                    const updatedData = await refreshAccessToken(tokens.refresh_token, tokens); 
                    try {
                      const newDocRef = doc(db, "authTokens", userSub);
                      await setDoc(newDocRef, updatedData);
                      return res.status(200).json({message: "Token present"});
                    } catch (e) {
                      console.log(e);
                      return res.status(500).json({message: "There was an error while trying to save refreshed token."});
                    }
                } else {
                  return res.status(200).json({message: "Token present"});
                }
                
            } catch (error) {
                console.error("Error parsing token data:", error);
                return res.status(403).json({ message: "Invalid token data" });
            }
        } else {
            const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
            authUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
            authUrl.searchParams.set("redirect_uri", `${process.env.NEXT_PUBLIC_BASE_URL}/api/gmailCallback`);
            authUrl.searchParams.set("response_type", "code");
            authUrl.searchParams.set("scope", SCOPES.join(" "));
            authUrl.searchParams.set("access_type", "offline");
            authUrl.searchParams.set("prompt", "consent");

            return res.status(401).json({
                authUrl: authUrl.toString(),
                message: "Authentication required"
            });
        }
    } catch (error) {
        console.error("Gmail API error:", error);
        return res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
}