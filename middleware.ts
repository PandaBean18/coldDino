import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { decode } from 'jsonwebtoken';
import { Redis } from '@upstash/redis/cloudflare';

const ROUTE_LIMITS: Record<string, {limit: number, window: number}> = {
    "/api/generateContent": {limit: 5, window: 60},
    "/api/getSiteInfo": {limit: 20, window: 60},
    "/api/contact": {limit: 5, window: 60},
    "/api/saveMail": {limit: 5, window: 60},
    "/api/saveDraft": {limit: 5, window: 60}
}

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
});

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
    } else if (pathname.startsWith("/api/")) {
        const limitObj = ROUTE_LIMITS[pathname];

        if (!limitObj) {
            return NextResponse.next();
        }

        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

        if (ip === 'unknown') {
            return new NextResponse('Invalid request, IP addr not found', { status: 403 });
        }

        const key = `rateLimit:${pathname}:${ip}`;
        const count = await redis.incr(key);

        if (count === 1) {
            await redis.expire(key, limitObj.window);
        }

        if (count > limitObj.limit) {
            return new NextResponse('Rate limit exceeded', { status: 429 });
        }
    }
    return NextResponse.next();
}