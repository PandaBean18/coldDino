"use server"
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { cookies } from "next/headers";

interface GoogleTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

const SCOPES = ["https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/gmail.compose"];

async function refreshAccessToken(refreshToken: string, tokens: GoogleTokens, req: NextApiRequest, res: NextApiResponse): Promise<string> {
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

        setCookie("gmail_tokens", JSON.stringify({
            access_token: response.data.access_token,
            refresh_token: tokens.refresh_token,
            expires_in: Date.now() + (response.data.expires_in * 1000),
            token_type: response.data.token_type
          }), {
            req,
            res,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: response.data.expires_in
          });

        return response.data.access_token;
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
        const tokenData = cookieStore["gmail_tokens"];
        console.log(tokenData);
        if (tokenData) {
            try {
                const tokens: GoogleTokens = JSON.parse(tokenData.toString()) as GoogleTokens;
                if (Date.now() >  tokens.expires_in * 1000) {
                    await refreshAccessToken(tokens.refresh_token, tokens, req, res);                    
                }
                return res.status(200).json({message: "Token present"})
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