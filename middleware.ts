import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/dashboard")) {
        const cookieStore = await cookies()
        const jwt = cookieStore.get("coldDinoJwt");

        if (jwt === undefined) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/signin`);
        }
  
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verify`, {"token": jwt.value});
        } catch (error) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/signin`);
        }

        const gmailTokens = cookieStore.get("gmail_tokens");
        if (gmailTokens === undefined) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/signin/allow`);
        }
    }

    return NextResponse.next();
}