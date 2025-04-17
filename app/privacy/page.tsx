"use client"
import Image from "next/image";

export default function PrivacyPolicy() {
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
                <p className="text-3xl font-semibold text-[#121212]">Privacy Policy</p>
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
                    <p className="text-4xl font-semibold text-[#121212]">Privacy Policy</p>
                </div>
            </div>

            <div className="w-full p-[20px] text-[#121212]">
                <p>Last Updated: April 17th, 2025</p>
                <br />
                <p>ColdDino ("we", "our", or "us") values your privacy. This Privacy Policy outlines how we handle your data when you use our service.</p>
                <br />
                <ol className="list-decimal pl-[25px] text-3xl font-semibold">
                    <li>
                        Information We Collect
                        <ul className="list-disc pl-[10px] text-xl font-normal">
                            <li><span className="font-semibold">Email Addresses:</span> Collected only when you voluntarily join the waitlist.</li>
                            <li><span className="font-semibold">Google Profile Info:</span> While signing in via Google One Tap, we may access your name and email for authentication only</li>
                            <li><span className="font-semibold">Cookies/Local Storage:</span> Used to store session data and to store your email templates.</li>
                            <li><span className="font-semibold">Email Templates (Conditional):</span> By default, we do not store or access any email templates or generated content. In cases where you contact us about poor content quality and explicitly consent, we may request a sample email template and company name. These may be added to our fine-tuning dataset and could persist for future model training.</li>
                        </ul>
                    </li>
                    <br />
                    <li>
                        How We Use Your Information 
                        <p className="text-xl font-normal">We use your data to:</p>
                        <ul className="list-disc pl-[10px] text-xl font-normal">
                            <li>Authenticate you.</li>
                            <li>Maintain and communicate through the waitlist.</li>
                            <li>Improve AI performance (with consent, as above).</li>
                        </ul>
                    </li>
                    <br />
                    <li>
                        Third-Party Services
                        <ul className="list-disc pl-[10px] text-xl font-normal">
                            <li><span className="font-semibold">Google</span> (for authentication, Gmail API, and Drive API)</li>
                            <li><span className="font-semibold">Firebase</span> (for backend infrastructure)</li>
                            <li><span className="font-semibold">Vercel</span> (for hosting ColdDino web application)</li>
                            <li><span className="font-semibold">Gemini by Google</span> (A fine-tuned model to generate personalized emails)</li>
                        </ul>
                    </li>
                    <br />
                    <li>
                        Data Security 
                        <p className="text-xl font-normal">We take reasonable precautions to protect your data but cannot guarantee absolute security.</p>
                    </li>
                    <br />
                    <li>
                        Your Rights 
                        <ul className="list-disc pl-[10px] text-xl font-normal">
                            <li>You can opt out of the waitlist at any time. (Through contact form)</li>
                            <li>You may request deletion of your data if collected.</li>
                            <li>You are not required to share any content for fine-tuning.</li>
                        </ul>
                    </li>
                    <br />
                    <li>
                        Children's Privacy
                        <p className="text-xl font-normal">ColdDino is not intended for users under 13. We do not knowingly collect personal data from children.</p>
                    </li>
                    <br />
                    <li>
                        Changes to This Policy
                        <p className="text-xl font-normal">We may update this Privacy Policy at any time. Changes will be posted on this page with a revised effective date.</p>
                    </li>
                    <br />
                    <li>
                        Contact
                        <p className="text-xl font-normal">If you have questions or requests, please use the contact form available on our website.</p>
                    </li>
                    <br />
                </ol>
            </div>
        </div>
    );
}