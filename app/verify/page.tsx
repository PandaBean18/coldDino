"use server"

import { NextApiRequest, NextApiResponse } from "next";
import { headers } from "next/headers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const h = await headers();
    console.log(h.get("kid"));
    console.log(req.headers)
}