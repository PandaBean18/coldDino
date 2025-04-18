import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { decode } from 'jsonwebtoken';

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

        const decodedJwt = decode(jwt.value);

        if (decodedJwt === null || typeof(decodedJwt) === 'string') {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/signin`);
        }

        const userSub = decodedJwt["sub"];

        if (userSub === undefined) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/signin`);
        }

    }
    return NextResponse.next();
}