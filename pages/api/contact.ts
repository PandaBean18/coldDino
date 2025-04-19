import { NextApiRequest, NextApiResponse } from "next";
import { resend } from "@/utils/resend";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        res.status(405).json({message: "method not allowed"});
        return;
    }

    const userMail = req.body["data"]["userMail"];
    const userName = req.body["data"]["userName"];
    const issueCategory = req.body["data"]["issueCategory"];
    const issueDescription = req.body["data"]["issueDescription"];

    const {data, error} = await resend.emails.send({
        from: `ColdDino: ${userMail} <onboarding@resend.dev>`,
        to: [process.env.SUPPORT_CONTACT_MAIL!],
        subject: issueCategory,
        html: `<strong>From: </strong>${userName} (${userMail})<br/><p>${issueDescription}</p>`
    })

    if (error) {
        res.status(500).json({message: `Error sending mail: ${error.message}`});
        return;
    }

    res.status(200).json({message: "Mail sent"});
}