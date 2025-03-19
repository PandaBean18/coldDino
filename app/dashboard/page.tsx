'use client'
import Image from "next/image"
import { useEffect } from "react";
import { useState } from "react";

declare global {
    interface HTMLElement {
        src: string
    }

    interface Event {
        inputType: string,
        data: string
    }
}

export default function Dashboard() {
    let visible: boolean = false;
    let navBarImage: string = "/hamburger.svg"
    let rotated: boolean = false;
    let createNewTemplatePage: boolean = true;
    let totalTemplateCount: number = 2;
    const [newTemplateName, setNewTemplateName] = useState(`Template ${totalTemplateCount+1}`)
    let subjectActive = false;
    let contentActive = false;

    function toggleSidebar() {
        const sidebar = document.getElementById("sidebar");
        const img = document.getElementById("navbarImage");
        const content = document.getElementById("sidebarContent")
        if (visible) {
            sidebar!.style.width = "0";
            img!.src = "/hamburger.svg";
            content!.style.display = "none";
            visible = false;
        } else {
            sidebar!.style.width = "80%";
            img!.src = "/cross.svg";
            content!.style.display = "flex"
            visible = true;
        }
    }

    function toggleDrafts() {
        let img;
        let templateList;

        if (!visible) {
            img = document.getElementById("downImage");
            templateList = document.getElementById("templateList");
        } else  {
            img = document.getElementById("downImageSidebar");
            templateList = document.getElementById("templateListSidebar");
        }

        if (rotated) {
            img!.style.transform = "rotate(0deg)";
            templateList!.style.height = "0";
            templateList!.style.padding = "0";
            rotated = false;
        } else {
            img!.style.transform = "rotate(180deg)";
            rotated = true;
            templateList!.style.height = "max-content";
            templateList!.style.padding = "10px";
        }
    }

    function createNewTemplate(): boolean {
        return true;
    }

    function getCountCharactersBefore(d: HTMLElement) {
        const selection = window.getSelection();
        const range = selection!.getRangeAt(0);
        const clonedRange = range.cloneRange();
        clonedRange.selectNodeContents(d);
        clonedRange.setEnd(range.endContainer, range.endOffset);

        const cursorPosition = clonedRange.toString().length;
        return cursorPosition;
    }

    function createCompanyNameSpan() {
        const e = document.createElement("span");
        e.innerText = "@companyName"
        e.className += "w-min text-cyan-700 select-text";
        e.contentEditable = "false";
        return e;
    }

    function createGeneratedTextNameSpan() {
        const e = document.createElement("span");
        e.innerText = "@generatedText"
        e.className += "w-min text-green-700 select-text";
        e.contentEditable = "false";
        return e;
    }


    function subjectKeyListener(event: KeyboardEvent) {
        if (event.key === "Enter") {
            //setTimeout(() => {}, 0)
            event.preventDefault();
            const selection = window.getSelection();
            const subjectDiv = document.getElementById("newTemplateSubjectContent");
            const charCount = getCountCharactersBefore(subjectDiv!);
            
            if (subjectDiv!.innerText[charCount-1] === "\n") {
                subjectDiv!.innerHTML += "\n"
            } else  {
                subjectDiv!.innerHTML += "\n\n"
            }
            
            selection!.removeAllRanges();
            selection!.selectAllChildren(subjectDiv!);
            selection!.collapseToStart();
            for(let a = 0; a <= (charCount+1); a++) {
                selection!.modify("move", "right", "character")
            }
        }
    }

    function subjectTagListener(event: Event) {
        const subjectDiv = document.getElementById("newTemplateSubjectContent");
        const charCount = getCountCharactersBefore(subjectDiv!);
        const text = subjectDiv!.innerText;
        let lastAppended = false;

        let i = 0;
        subjectDiv!.innerHTML = "";
        for(i; i <= (text!.length - "@companyName".length); i++) {
            if (text.slice(i, i+"@companyName".length) === "@companyName"){
                const e = createCompanyNameSpan();
                subjectDiv!.appendChild(e);

                if (i === (text!.length - "@companyName".length)) {
                    lastAppended = true;
                    i += "@companyName".length;
                } else {
                    i += "@companyName".length - 1; 
                }
            } else if ((text!.length - i) >= ("@generatedText".length) && text.slice(i, i+("@generatedText".length)) === "@generatedText") {
                const e = createGeneratedTextNameSpan();
                subjectDiv!.appendChild(e);

                if (i === (text!.length - "@generatedText".length)) {
                    lastAppended = true;
                    i += "@generatedText".length;
                } else {
                    i += "@generatedText".length - 1; 
                }
            } else {
                subjectDiv!.innerHTML += text![i];
            }
        }

        if (!lastAppended) {
            subjectDiv!.innerHTML += text!.slice(i);
        }

        const selection = window.getSelection();
        selection!.removeAllRanges();
        selection!.selectAllChildren(subjectDiv!);
        selection!.collapseToStart();
        for(let a = 0; a < (charCount); a++) {
            selection!.modify("move", "right", "character")
        }
    }

    function messageKeyListener(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();
            const selection = window.getSelection();
            const subjectDiv = document.getElementById("newTemplateMessageContent");
            const charCount = getCountCharactersBefore(subjectDiv!);

            if (subjectDiv!.innerText[charCount-1] === "\n") {
                subjectDiv!.innerHTML += "\n"
            } else  {
                subjectDiv!.innerHTML += "\n\n"
            }

            selection!.removeAllRanges();
            selection!.selectAllChildren(subjectDiv!);
            selection!.collapseToStart();
            for(let a = 0; a <= (charCount+1); a++) {
                selection!.modify("move", "right", "character")
            }
        }
    }

    function messageTagListener(event: Event) {
        const subjectDiv = document.getElementById("newTemplateMessageContent");
        let charCount = getCountCharactersBefore(subjectDiv!);
        const constantCharCount = charCount;
        const text = subjectDiv!.innerText;
        let lastAppended = false;

        let i = 0;
        subjectDiv!.innerHTML = "";
        for(i; i <= (text!.length - "@companyName".length); i++) {
            if (text.slice(i, i+"@companyName".length) === "@companyName"){
                const e = createCompanyNameSpan();
                subjectDiv!.appendChild(e);

                if (i < constantCharCount) {
                    charCount -= "@companyName".length;
                    if (i > 0 && text![i-1] !== "\n") {
                        charCount += 1;
                    }
                    
                }

                if (i === (text!.length - "@companyName".length)) {
                    lastAppended = true;
                    i += "@companyName".length;
                } else {
                    i += "@companyName".length - 1; 
                }
            } else if ((text!.length - i) >= ("@generatedText".length) && text.slice(i, i+("@generatedText".length)) === "@generatedText") {
                const e = createGeneratedTextNameSpan();
                subjectDiv!.appendChild(e);

                if (i < constantCharCount) {
                    charCount -= "@generatedText".length;
                    if (i > 0 && text![i-1] !== "\n") {
                        charCount += 1;
                    }
                }

                if (i === (text!.length - "@generatedText".length)) {
                    lastAppended = true;
                    i += "@generatedText".length;
                } else {
                    i += "@generatedText".length - 1; 
                }
            } else {
                subjectDiv!.innerHTML += text![i];
            }
        }

        if (!lastAppended) {
            subjectDiv!.innerHTML += text!.slice(i);
        }

        const selection = window.getSelection();
        selection!.removeAllRanges();
        selection!.selectAllChildren(subjectDiv!);
        selection!.collapseToStart();
        for(let a = 0; a < (charCount); a++) {
            selection!.modify("move", "right", "character")
        }
    }

    return  (
        <div className="w-full h-full bg-white select-none" style={{fontFamily: "Poppins"}}>
            <div className="bg-zinc-300 h-[70px] w-full mbp:h-0 relative flex justify-center items-center">
                <Image 
                    src="/logo.svg"
                    height={50}
                    width={50}
                    alt="logo"
                    className="mbp:hidden"
                />
                <div className="absolute left-[10px] mbp:hidden" onClick={toggleSidebar}>
                    <Image 
                        src={navBarImage}
                        height={30}
                        width={30}
                        alt="menu"
                        className="mbp:hidden"
                        id="navbarImage"
                    />
                </div>
            </div>
            <div className="w-0 h-full bg-zinc-400 duration-300 ease-in-out mbp:hidden" id="sidebar">
                <div className="h-[calc(100%-140px)] hidden w-full flex flex-col items-center" id="sidebarContent">
                    <div className="h-[50px] w-[90%] flex justify-between items-center rounded-[5px] duration-100 ease-in-out hover:cursor-pointer" onClick={toggleDrafts}>
                        <div className="flex items-center">
                            <Image
                                src="/mail_draft.svg"
                                height={25}
                                width={25}
                                alt="draft"
                            />
                            <p className="text-[#121212] font-normal ml-[10px]">Email Templates</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <Image 
                                src="/down.svg"
                                height={20}
                                width={20}
                                alt="down"
                                className="duration-100 ease-in-out transform-[rotate(0deg)]"
                                id="downImageSidebar"
                            />
                        </div>
                    </div>
                    <div className="w-[70%] p-[0px] rounded-[5px] flex flex-col justify-center items-center duration-100 h-0 bg-zinc-400 overflow-hidden" id="templateListSidebar">
                        <div className="template w-full hover:cursor-pointer">
                            <p className="text-[#121212]">Template 1</p>
                        </div>
                        <div className="w-full border-b-1 border-zinc-500 mt-[10px] mb-[10px]"></div>
                        <div className="template w-full hover:cursor-pointer">
                            <p className="text-[#121212]" >Template 2</p>
                        </div>
                        <div className="w-[80%] h-[35px] bg-zinc-600 rounded-[2.5px] mt-[10px] flex justify-center items-center hover:cursor-pointer">
                            <p className="text-zinc-200">New Template</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-[calc(100%-70px)] mbp:h-full flex">
                <div className="h-full w-[30%] max-w-[350px] hidden mbp:block bg-zinc-300">
                    <div className="h-[70px] w-full flex justify-center items-center">
                        <Image 
                            src="/logo.svg"
                            height={30}
                            width={30}
                            alt="menu"
                        />
                        <p className="text-[#121212] text-2xl font-bold ml-[10px]">Dashboard</p>
                    </div>
                    <div className="h-[calc(100%-140px)] w-full flex flex-col items-center">
                        <div className="h-[50px] w-[90%] flex justify-between items-center rounded-[5px] duration-100 ease-in-out hover:cursor-pointer" onClick={toggleDrafts}>
                            <div className="flex items-center">
                                <Image
                                    src="/mail_draft.svg"
                                    height={25}
                                    width={25}
                                    alt="draft"
                                />
                                <p className="text-[#121212] font-normal ml-[10px]">Email Templates</p>
                            </div>
                            <div className="flex items-center justify-center">
                                <Image 
                                    src="/down.svg"
                                    height={20}
                                    width={20}
                                    alt="down"
                                    className="duration-100 ease-in-out transform-[rotate(0deg)]"
                                    id="downImage"
                                />
                            </div>
                        </div>
                        <div className="w-[70%] p-[0px] rounded-[5px] flex flex-col justify-center items-center duration-100 h-0 bg-slate-200 overflow-hidden" id="templateList">
                            <div className="template w-full hover:cursor-pointer">
                                <p className="text-[#121212]">Template 1</p>
                            </div>
                            <div className="w-full border-b-1 border-zinc-500 mt-[10px] mb-[10px]"></div>
                            <div className="template w-full hover:cursor-pointer">
                                <p className="text-[#121212]" >Template 2</p>
                            </div>
                            <div className="w-[80%] h-[35px] bg-[#121212] rounded-[2.5px] mt-[10px] flex justify-center items-center hover:cursor-pointer">
                                <p className="text-zinc-100">New Template</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* div for creating new email template */}
                <div className="h-0 w-0 mbp:h-full mbp:w-[70%] mbp:min-w-[calc(100%-350px)] mbp:p-[20px] mbp:pb-0 flex flex-col justify-center items-center">
                    <div className="w-full h-[70px] border-zinc-300 border-0 border-b-1 flex items-center"><p className="text-3xl text-[#121212] font-semibold">Create New Template</p></div>
                    {/* <input className="h-[70px] w-full text-3xl text-[#121212] font-semibold border-zinc-200 border-0 border-b-1 focus:outline-none focus:border-zinc-500" type="text" id="newTemplateName" value={`Template ${totalTemplateCount+1}`}/> */}
                    <div className="flex h-full w-full">
                        <div className="h-[calc(100%-40px)] pt-[20px] flex justify-center items-center">
                            <div className="h-[50px] w-[70px] pr-[20px]">
                                <Image 
                                    src="/down.svg"
                                    height={50}
                                    width={50}
                                    alt="up"
                                    className="transform-[rotate(180deg)] hover:cursor-pointer"
                                />
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <div className="rounded-[5px] border-1 border-zinc-300 p-[10px] w-[500px] flex flex-col flex-center items-center">
                                    <form className="w-full" onSubmit={createNewTemplate}>
                                        <input className="h-[50px] w-full text-3xl text-[#121212] font-semibold focus:outline-none" type="text" id="newTemplateName" value={newTemplateName} onChange={(e)=>{setNewTemplateName(e.target.value)}}/>
                                        <p className="text-zinc-400">Fill in the details below to create a new template.</p>
                                        <br />
                                        <div className="flex items-center h-[20px] mb-[5px]">
                                            <p className="text-[#121212] text-sm mr-[10px]">Subject line</p>
                                            <Image
                                                src="/copy.svg"
                                                height={20}
                                                width={20}
                                                alt="copy"
                                            />
                                        </div>
                                        <div id="newTemplateSubject" className="min-h-[40px] w-full border-1 border-zinc-300 p-[10px] pt-0 pb-0 text-zinc-300 rounded-[2.5px] flex flex-col justify-center focus:outline-zinc-400 focus:outline-offset-5 text-wrap hover:cursor-text" contentEditable="false" onClick={() => {
                                            
                                            if (!subjectActive) {
                                                const d = document.getElementById("newTemplateSubject")
                                                d!.innerText = "";
                                                d!.innerHTML = `<p contenteditable="true" class="focus:outline-none whitespace-pre text-wrap" style="text-wrap:auto" id="newTemplateSubjectContent"></p>`
                                                const e = document.getElementById("newTemplateSubjectContent") 
                                                e!.focus();
                                                e!.addEventListener("input", (event) => {
                                                    subjectTagListener(event);
                                                })

                                                e!.addEventListener("keydown", (event) => {
                                                    subjectKeyListener(event);
                                                })
                                                e!.style.color = "#121212";
                                                subjectActive = true;
                                            }

                                        }}>Enter the subject of your email</div>
                                        <br />
                                        <div className="flex items-center h-[20px] mb-[5px]">
                                            <p className="text-[#121212] text-sm mr-[10px]">Message Content</p>
                                            <Image
                                                src="/copy.svg"
                                                height={20}
                                                width={20}
                                                alt="copy"
                                            />
                                        </div>
                                        <div className="h-[300px] w-full pl-[10px] pt-[10px] text-zinc-300 border-1 border-zinc-300 overflow-y-scroll rounded-[2.5px] p-[10px] focus:outline-offset-5 text-wrap focus:outline-zinc-400 hover:cursor-text" id="newTemplateContent" contentEditable="false" onClick={() => {
                                            if (!contentActive) {
                                                const d = document.getElementById("newTemplateContent")
                                                d!.innerText = "";
                                                d!.innerHTML = `<p contenteditable="true" class="focus:outline-none whitespace-pre text-wrap" style="text-wrap:auto" id="newTemplateMessageContent"></p>`
                                                const e = document.getElementById("newTemplateMessageContent") 
                                                e!.focus();
                                                e!.addEventListener("input", (event) => {
                                                    messageTagListener(event);
                                                })

                                                e!.addEventListener("keydown", (event) => {
                                                    messageKeyListener(event);
                                                })
                                                e!.style.color = "#121212";
                                                contentActive = true;
                                            }
                                            
                                        }}>Enter the content of your email</div>
                                        <br />
                                        <br />
                                        <div className="w-full flex justify-between items-center">
                                            <div className="flex w-[100px] justify-between items-center">
                                                <div className="h-[50px] w-[50px] flex justify-center items-center hover:cursor-pointer">
                                                    <Image
                                                        src="/link.svg"
                                                        height={30}
                                                        width={30}
                                                        alt="link"
                                                    />
                                                </div>
                                                <div className="h-[50px] w-[50px] flex justify-center items-center hover:cursor-pointer">
                                                    <Image
                                                        src="/attachment.svg"
                                                        height={30}
                                                        width={30}
                                                        alt="attachment"
                                                    />
                                                </div>
                                            </div>
                                            <input className=" bg-[#121212] p-[10px] rounded-[10px] hover:cursor-pointer self-end" type="submit" value="Create new template"/>
                                        </div>
                                    </form>
                                    
                                </div>
                                <p className="text-[#121212] text-xl" style={{fontFamily: "Bebas Neue"}}>1/3</p>
                            </div>
                            <div className="h-[50px] w-[70px] pl-[20px]">
                                <Image
                                    src="/down.svg"
                                    height={50}
                                    width={50}
                                    alt="down"
                                    className="hover:cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="w-max h-full hidden mbp:flex justify-center p-[10px] pl-[20px]">
                            <ul className="list-disc text-[#121212]">
                                <li><p className="text-xl">Use the <span className="text-cyan-700">@companyName</span> placeholder to refer to the company name.</p></li>
                                <br />
                                <li><p className="text-xl">Use the <span className="text-green-700">@generatedText</span> placeholder to refer to the text that will be generated by our AI agent.</p></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}