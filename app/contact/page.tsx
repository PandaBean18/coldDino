'use client'
import { useState } from "react";
import Image from "next/image";

export default function Contact() {
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [topic, setTopic] = useState("");
    const [message, setMessage] = useState("");

    function updateName(event: InputEvent) {
        setName(event.target!.value);
    }

    return (
        <div className="w-full min-h-full bg-white" style={{fontFamily: "Poppins"}}>
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
                <p className="text-3xl font-semibold text-[#121212]">Contact Us</p>
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
                    <p className="text-4xl font-semibold text-[#121212]">Contact Us</p>
                </div>
            </div>

            <div className="w-full min-h-[100vh] p-[20px] flex mbp:items-center justify-center">
                <div className="w-full h-max max-w-[600px] border-1 border-zinc-300 rounded-[5px] p-[10px]">
                    <p className="text-3xl text-[#121212] font-semibold">Get in Touch</p>
                    <p className="ext-[#121212]">Use this form to get in touch with us.</p>
                    <br />
                    
                </div>
            </div>
        </div>
    );
}