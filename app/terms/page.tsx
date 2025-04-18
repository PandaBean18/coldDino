"use client"
import Image from "next/image";

export default function TermsAndConditions() {
    return (
        <div className="w-full bg-white select-none" style={{fontFamily: "Poppins"}}>
            {/* Mobile navbar */}
            <div className="h-[60px] w-full mbp:hidden bg-white flex justify-center items-center border-b-1">
                <div className="h-full flex items-center justify center hover:cursor-pointer" onClick={()=>{window.location.href = "/"}}>
                    <Image
                        src="/logo.svg"
                        height={32}
                        width={32}
                        alt="logo"
                    />
                    <div className="w-[10px]"></div>
                    <p className="text-2xl font-semibold text-[#121212]">ColdDino</p>
                </div>
            </div>
            <div className="w-max mbp:hidden p-[20px] pb-0">
                <p className="text-3xl font-semibold text-[#121212]">Terms and Conditions</p>
                <div className="w-full h-0 border-b-1 border-zinc-300"></div>
            </div>
            {/* Desktop navbar */}
            <div className="w-full h-[60px] bg-white hidden mbp:flex p-[10px] relative border-b-1">
                <div className="h-full flex items-center justify center hover:cursor-pointer absolute top-0 left-0 z-10 p-[10px]" onClick={()=>{window.location.href = "/"}}>
                    <Image
                        src="/logo.svg"
                        height={32}
                        width={32}
                        alt="logo"
                    />
                    <div className="w-[10px]"></div>
                    <p className="text-2xl font-semibold text-[#121212]">ColdDino</p>
                </div>
                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
                    <p className="text-4xl font-semibold text-[#121212]">Terms and Conditions</p>
                </div>
            </div>

            <div className="w-full p-[20px] text-[#121212]">
                <p>Last Updated: April 17th, 2025</p>
                <br />
                <p>Welcome to ColdDino! These Terms and Conditions ("Terms") govern your access to and use of ColdDino ("we", "our", or "us") and its services. By using our website or application, you agree to these Terms.</p>
                <br />
                <ol className="list-decimal pl-[25px] text-3xl font-semibold">
                    <li>
                        Use of the Service 
                        <p className="text-xl font-normal">ColdDino is an AI-powered tool to help students and job seekers personalize cold emails. You agree to use the Service only for lawful purposes and in compliance with these Terms.</p>
                    </li>
                    <br />
                    <li>
                        User Authentication
                        <p className="text-xl font-normal">You may sign in using Google One Tap or OAuth-based authentication. You are responsible for maintaining the security of your account.</p>
                    </li>
                    <br />
                    <li>
                        Data Usage
                        <p className="text-xl font-normal">We do not store user-generated content by default. Your data primarily resides in your browser (cookies or local storage). The only data we collect directly is your email when you sign up for the waitlist. See our <a className="text-blue-500" href="/privacy">Privacy Policy</a> for full details.</p>
                    </li>
                    <br />
                    <li>
                        Third-Party Services
                        <p className="text-xl font-normal">We integrate with third-party services like Google (OAuth2, Gmail API, Drive API), Firebase, and Vercel. We are not responsible for any actions or changes made by these services.</p>
                    </li>
                    <br />
                    <li>
                        Intellectual Property
                        <p className="text-xl font-normal">ColdDino is an open-source project. You are free to inspect, use, and modify the source code for <strong>non-commercial purposes</strong> under the terms of the applicable open-source license. Any commercial use of ColdDino, including derivative works or monetized deployments, is strictly prohibited without explicit written permission.</p>
                    </li>
                    <br />
                    <li>
                        Limitations of Liability 
                        <p className="text-xl font-normal">We do our best to ensure accuracy, but ColdDino is provided "as is". We are not liable for any loss resulting from the use or inability to use our services.</p>
                    </li>
                    <br />
                    <li>
                        Changes to the Service or Terms
                        <p className="text-xl font-normal">We may update these Terms at any time. Continued use of the Service means you accept any changes.</p>
                    </li>
                    <br />
                    <li>
                        Termination
                        <p className="text-xl font-normal">We reserve the right to suspend or terminate access to the Service for any user who violates these Terms.</p>
                    </li>
                    <br />
                    <li>
                        Contact
                        <p className="text-xl font-normal">For questions, please reach out via the contact form on our website.</p>
                    </li>
                    <br />
                </ol>
            </div>
        </div>
    );
}