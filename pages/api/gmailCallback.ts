import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { setCookie } from "cookies-next";

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
      
          setCookie("gmail_tokens", JSON.stringify({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
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
      
          res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL!}/dashboard/generate`);
    } catch (error) {
        console.log("OAuth callback error:", error);
        res.status(500).json({ message: "Authentication failed" });
    }
}