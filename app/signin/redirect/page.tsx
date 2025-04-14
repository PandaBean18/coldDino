"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Redirecting() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.replace("/dashboard/generate")
        }, 100);
    }, [])

    return <p>Redirecting you to your dashboard...</p>
}