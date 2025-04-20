'use client'
import { ChangeEvent, FormEventHandler, TextareaHTMLAttributes, useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function Contact() {
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    function updateName(event: ChangeEvent<HTMLInputElement>) {
        setName(event.target!.value);
    }

    function updateMail(event: ChangeEvent<HTMLInputElement>) {
        setMail(event.target!.value);
    }

    function updateCategory(event: ChangeEvent<HTMLInputElement>) {
        setCategory(event.target!.value);
    }

    function validateMail(str: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
    }

    async function validateData() {
        const nameInput = document.getElementById("inputName");
        const mailInput = document.getElementById("inputMail");
        const categoryInput = document.getElementById("inputIssueCategory");
        const descriptionInput = document.getElementById("inputIssueDesc");
        const sendButton = document.getElementById("sendButton");
        const sendButtonLoading = document.getElementById("sendButtonLoading");

        sendButton!.style.display = "none";
        sendButtonLoading!.style.display = "flex";

        if (name === "") {
            nameInput!.style.outlineColor = "red";
            nameInput!.scrollIntoView({behavior: "smooth"});
            sendButton!.style.display = "block";
            sendButtonLoading!.style.display = "none";
            return false;
        } else if (mail === "") {
            mailInput!.style.outlineColor = "red";
            mailInput!.scrollIntoView({behavior: "smooth"});
            sendButton!.style.display = "block";
            sendButtonLoading!.style.display = "none";
            return false;
        } else if (category === "") {
            categoryInput!.style.outlineColor = "red";
            categoryInput!.scrollIntoView({behavior: "smooth"});
            sendButton!.style.display = "block";
            sendButtonLoading!.style.display = "none";
            return false;
        } else if (descriptionInput!.value === "") {
            descriptionInput!.style.outlineColor = "red";
            descriptionInput!.scrollIntoView({behavior: "smooth"});
            sendButton!.style.display = "block";
            sendButtonLoading!.style.display = "none";
            return false;
        }

        if (!validateMail(mail)) {
            mailInput!.style.outlineColor = "red";
            mailInput!.scrollIntoView({behavior: "smooth"});
            sendButton!.style.display = "block";
            sendButtonLoading!.style.display = "none";
            return false;
        }

        try {
            await axios.post("/api/contact", {
                data: {
                    userName: name,
                    userMail: mail,
                    issueCategory: category,
                    issueDescription: descriptionInput!.value
                }
            })

            sendButton!.style.display = "block";
            sendButtonLoading!.style.display = "none";
            document.getElementById("contactForm")!.style.display = "none";
            document.getElementById("contactSent")!.style.display = "flex";

        } catch(e: any) {
            if (e.status === 429) {
                alert("Rate limit exceeded.");
            } else {
                alert("Something went wrong.");
            }

            sendButton!.style.display = "block";
            sendButtonLoading!.style.display = "none";
            return;
        }
        
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

            <div className="w-full min-h-[calc(100vh-60px)] p-[20px] flex mbp:items-center justify-center">
                <div className=" w-[400px] h-max mbp:w-[600px] border-1 border-zinc-300 rounded-[5px] p-[10px]" id="contactForm">
                    <p className="text-3xl text-[#121212] font-semibold">Get in Touch</p>
                    <p className="text-zinc-400">Use this form to get in touch with us.</p>
                    <br />
                    <div className="w-full block mbp:flex mbp:justify-between">
                        <div className="w-full mbp:w-[calc(50%-20px)]">
                            <label htmlFor="inputName" className="text-[#121212]">Name <span className="text-red-500">*</span></label>
                            <br />
                            <input id="inputName" type="text" className="w-full rounded-[5px] p-[10px] border-1 border-zinc-300 text-[#121212] outline outline-zinc-300 focus-outline focus:outline-[#121212]" placeholder="Name" onChange={updateName} onClick={()=>{
                                const e = document.getElementById("inputName");
                                e!.style.outlineColor = "#121212";
                            }} />
                        </div>
                        <div className="w-full mbp:w-[calc(50%-20px)] mt-[24px] mbp:mt-0">
                            <label htmlFor="inputMail" className="text-[#121212]">Email <span className="text-red-500">*</span></label>
                            <br />
                            <input type="text" className="w-full rounded-[5px] p-[10px] border-1 border-zinc-300 text-[#121212] outline outline-zinc-300 focus-outline focus:outline-[#121212]" placeholder="you@email.com" onChange={updateMail} onClick={()=>{
                                const e = document.getElementById("inputMail");
                                e!.style.outlineColor = "#121212";
                            }} id="inputMail"/>
                        </div>
                    </div>
                    <div className="w-full mt-[24px]">
                        <label htmlFor="inputIssueCategory" className="text-[#121212]">Category <span className="text-red-500">*</span></label>
                        <br />
                        <input type="text" className="w-full rounded-[5px] p-[10px] border-1 border-zinc-300 text-[#121212] outline outline-zinc-300 focus-outline focus:outline-[#121212]" placeholder="Example: Bug, Query, Feature Request" onChange={updateCategory} onClick={()=>{
                            const e = document.getElementById("inputIssueCategory");
                            e!.style.outlineColor = "#121212";
                        }} id="inputIssueCategory"/>
                    </div>
                    <div className="w-full mt-[24px]">
                        <label htmlFor="inputIssueDesc" className="text-[#121212]">Description <span className="text-red-500">*</span></label>
                        <br />
                        <textarea className="w-full h-[200px] rounded-[5px] p-[10px] border-1 border-zinc-300 text-[#121212] outline outline-zinc-300 focus-outline focus:outline-[#121212] resize-none" placeholder="Describe your issue or suggestion" onClick={()=>{
                            const e = document.getElementById("inputIssueDesc");
                            e!.style.outlineColor = "#121212";
                        }} id="inputIssueDesc"/>
                    </div>
                    <div className="w-full h-[70px] flex justify-end items-center">
                        <input className="h-[50px] w-[150px] bg-[#121212] text-white rounded-[5px] hover:cursor-pointer" type="button" name="send" id="sendButton" value="Send" onClick={validateData}></input>
                        <div className="hidden h-[50px] w-[150px] bg-[#121212] text-white rounded-[5px] flex items-center justify-center" id="sendButtonLoading">
                            <div className="w-[30px] aspect-square rounded-[50%] border-4 border-4 border-t-[#121212] border-b-[#121212] border-r-white border-l-white animate-myspin"></div>
                        </div>
                    </div>
                </div>
                <div className="hidden w-[400px] h-[300px] mbp:w-[600px] border-1 border-zinc-300 rounded-[5px] p-[10px] flex flex-col items-center justify-center" id="contactSent">
                    <p className="text-[#121212] text-3xl font-semibold text-center">Information Has Been Sent</p>
                    <p className="text-zinc-400 text-center">Our team will get in contact with you if required.</p>
                </div>
            </div>

        </div>
    );
}