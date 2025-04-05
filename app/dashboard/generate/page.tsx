"use client"
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface InvdividualTemplate {
    templateName: string, 
    subject: string,
    message: string,
}

declare global {
    interface HTMLElement {
        selectedIndex: number
    }
}

function mobileView() {
    return (
        <div>Mobile</div>
    )
}

function desktopView() {
    let currentEmailInputTab = "manual";
    let currentTemplateIndex = -1;
    let templates: Array<InvdividualTemplate> = [];

    function createUrlAnchorTag(url: string, text: string | null = null) {
        const e = document.createElement("a");
        e.href = url;
        e.className = "underline text-blue-500"

        if (text === null) {
            e.innerHTML = url;
        } else {
            e.innerHTML = text;
        }

        return e;
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

    function toggleCurrentEmailInputTab(t: string) {
        currentEmailInputTab = t;

        const manualTab = document.getElementById("emailInputManualTab");
        const uploadTab = document.getElementById("emailInputUploadTab");
        const manualDiv = document.getElementById("manualDiv");
        const uploadDiv = document.getElementById("uploadDiv");
        if (currentEmailInputTab === "manual") {
            uploadTab!.style.backgroundColor = "transparent";
            uploadTab!.style.color = "oklch(0.552 0.016 285.938)";
            uploadDiv!.style.display = "none";
            manualTab!.style.backgroundColor = "white";
            manualTab!.style.color = "#121212";
            manualDiv!.style.display = "block";
        } else if (currentEmailInputTab === "upload") {
            manualTab!.style.backgroundColor = "transparent";
            manualTab!.style.color = "oklch(0.552 0.016 285.938)";
            manualDiv!.style.display = "none";
            uploadTab!.style.backgroundColor = "white";
            uploadTab!.style.color = "#121212";
            uploadDiv!.style.display = "block";
        }
    }

    function handleFileUploadButton() {
        const e = document.getElementById("uploadFile");
        e!.click();
    }

    function updateTemplatePreview() {
        const ele = document.getElementById("selectTemplate");
        const obj: InvdividualTemplate = templates[ele!.selectedIndex-1];
        
        if (currentTemplateIndex === -1) {
            currentTemplateIndex = ele!.selectedIndex - 1;
            const notTemplateSelectedDiv = document.getElementById("templatePreviewNothingSelected");
            const templateSelectedDiv = document.getElementById("templatePreviewSelected");
            notTemplateSelectedDiv!.style.display = "none";
            templateSelectedDiv!.style.display = "flex";
        } else {
            currentTemplateIndex = ele!.selectedIndex - 1;
        }

        const previewSubject = document.getElementById("templatePreviewSubject");
        const previewMessage = document.getElementById("templatePreviewMessage");

        previewSubject!.innerText = obj["subject"];
        previewMessage!.innerText = obj["message"];

        formatText(previewSubject!);
        formatText(previewMessage!);
    }

    function formatText(ele: HTMLElement) {
        const text = ele.innerText;
        ele.innerText = "";
        for(let i = 0; i < text.length; i++) {
            if (text.slice(i, i+"@companyName".length) === "@companyName") {
                const e = createCompanyNameSpan();
                ele.appendChild(e);
                i += "@companyName".length - 1
            } else if (text.slice(i, i+"@generatedText".length) === "@generatedText") {
                const e = createGeneratedTextNameSpan();
                ele.appendChild(e);
                i += "@generatedText".length-1;
            } else if (text!.slice(i, i+("!!LINK!![".length)) === "!!LINK!![") {
                let url = "";
                let displayText = "";
                let commasCrossed = 0;
                let linkId = "";
                let k;
                for (k = i + "!!LINK!![".length; k < text!.length; k++) {
                    if (text![k] === "]") {
                        break;
                    } else {
                        if (text![k] === ",") {
                            commasCrossed += 1;
                        } else if (commasCrossed === 1) {
                            displayText += text![k];
                        } else if (commasCrossed === 0) {
                            url += text![k];
                        } else if (commasCrossed === 2) {
                            linkId += text![k]
                        }
                    }
                }
                const e = createUrlAnchorTag(url, displayText);
                ele.appendChild(e);
                i += (`!!LINK!![${url},${displayText},${linkId}]`.length + displayText.length) - 1;
            } else if (text[i] === "\n") {
                const e = document.createElement("br");
                ele.appendChild(e);
            } else {
                ele.innerHTML += text[i];
            }
        }
    }

    function populateTemplates() {
        const s: string | undefined = Cookies.get("templates");

        if (s == undefined) {
            window.location.href = "/dashboard/templates";
        }

        const obj = JSON.parse(decodeURIComponent(s!));
        const ele = document.getElementById("selectTemplate");

        for(let templateId in obj) {
            const currentTemplate: InvdividualTemplate = obj[templateId];
            templates.push(currentTemplate);
            const op = document.createElement("option");
            op.id = `template_${templateId}`;
            op.innerText = currentTemplate["templateName"];
            ele!.appendChild(op);
        }
    }

    useEffect(()=>{
        window.onload = (event) => {
            populateTemplates();
        }
    }, [])

    return (
        <div className="w-full h-full flex items-center justify-between">
            <div className="w-[300px] h-full bg-zinc-100 border-r-1 border-zinc-300" id="sidebar">
                <div className="h-[70px] w-full flex justify-center items-center">
                    <Image 
                        src="/logo.svg"
                        height={30}
                        width={30}
                        alt="menu"
                    />
                    <p className="text-[#121212] text-2xl font-bold ml-[10px]">Dashboard</p>
                </div>
                <div className="w-full flex flex-col justify-center items-center">
                    <div className="h-[50px] w-[90%] flex justify-between items-center rounded-[5px] hover:cursor-pointer">
                        <div className="flex items-center">
                            <Image
                                src="/mail_draft.svg"
                                height={25}
                                width={25}
                                alt="draft"
                            />
                            <p className="text-[#121212] font-normal ml-[10px]">Email Templates</p>
                        </div>
                    </div>
                    <div className="h-[50px] w-[90%] flex justify-between items-center rounded-[5px] hover:cursor-pointer">
                        <div className="flex items-center">
                            <Image
                                src="/sparkle.svg"
                                height={25}
                                width={25}
                                alt="ai"
                            />
                            <p className="text-[#121212] font-normal ml-[10px]">Generate Email</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-[calc(100%-300px)] h-full p-[20px]">
                <div className="w-full h-[70px] border-b-1 border-zinc-300 flex flex-col justify-center">
                    <p className="text-3xl text-[#121212] font-semibold">Cold Email Generator</p>
                </div>
                <div className="w-full h-[calc(100%-70px)] flex justify-between items-center p-[30px]">
                    <div className="h-full w-[calc(50%-15px)] bg-white rounded-[5px] border-1 border-zinc-300 p-[30px]">
                        <p className="text-3xl text-[#121212] font-medium">Recipients</p>
                        <p className="text-zinc-400 font-normal">Enter email addresses manually or upload a file</p>
                        <br />
                        <div className="w-full h-[50px] bg-zinc-300 rounded-[5px] p-[5px] flex justify-between items-center">
                            <div className="h-full w-[calc(50%-5px)] bg-white rounded-[2.5px] flex justify-center items-center text-[#121212] hover:cursor-pointer" id="emailInputManualTab" onClick={()=>{toggleCurrentEmailInputTab("manual")}}>
                                <p>Enter Manually</p>
                            </div>
                            <div className="h-full w-[calc(50%-5px)] bg-transparent rounded-[2.5px] flex justify-center items-center text-zinc-500 hover:cursor-pointer" id="emailInputUploadTab" onClick={()=>{toggleCurrentEmailInputTab("upload")}}>
                                <p>Upload List</p>
                            </div>
                        </div>
                        <div className="h-[calc(100%-225px)]" id="manualDiv">
                            <div className="w-full h-[50px] flex justify-between items-center">
                                <p className="text-lg text-[#121212] font-medium">Email Addresses</p>
                            </div>
                            <textarea className="w-full h-[calc(100%-50px)] bg-white rounded-[5px] border-1 border-zinc-300 resize-none p-[10px] text-[#121212] focus:outline-zinc-200 focus:outline-[2px] focus:outline-offset-2" placeholder="Enter email addresses (one per line)"></textarea>
                        </div>

                        <div className="hidden h-[calc(100%-225px)]" id="uploadDiv">
                            <br />
                            <div className="w-full h-[calc(100%-50px)] bg-white rounded-[5px] border-3 border-dashed border-zinc-300 resize-none p-[20px] text-[#121212]">
                                <div className="w-full h-full flex flex-col items-center">
                                    <div className="w-full flex items-center justify-center">
                                        <Image 
                                            src="/upload.svg"
                                            height={60}
                                            width={60}
                                            alt="upload"                                
                                        />
                                    </div>
                                    <p className="text-lg text-[#121212] font-medium text-center">Drag and drop your files here or click the button to browse</p>
                                    <p className="text-zinc-400 text-sm text-center">Supports CSV or TXT files (Max 20 email addresses)</p>
                                    <input className="hidden" type="file" id="uploadFile"/>
                                    <br />
                                    <div className="h-[50px] w-[150px] bg-white hover:cursor-pointer hover:bg-zinc-100 rounded-[5px] border-1 border-zinc-300 flex justify-center items-center ease-in-out duration-150" onClick={handleFileUploadButton}>
                                        <p className="font-medium">Select File</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-full w-[calc(50%-15px)] bg-white rounded-[5px] border-1 border-zinc-300 p-[30px]">
                        <p className="text-3xl text-[#121212] font-medium">Email Template</p>
                        <p className="text-zinc-400 font-normal">Select the template you want to use</p>
                        <br />
                        <select className="h-[50px] w-full rounded-[5px] text-[#121212] border-1 border-zinc-300 focus:outline-zinc-200 focus:outline-[2px] focus:outline-offset-2" name="selectedTemplate" id="selectTemplate" onChange={(event)=>{updateTemplatePreview()}}>
                            <option className="mt-[20px]" defaultValue="select" selected disabled>Select Template</option>
                        </select>
                        <div className="w-full h-[50px] flex justify-between items-center">
                            <p className="text-lg text-[#121212] font-medium">Template Preview</p>
                        </div>
                        <div className="w-full h-[calc(100%-200px)] bg-white ">
                            <div className="h-full w-full p-[30px] flex flex-col items-center rounded-[5px] border-1 border-zinc-300" id="templatePreviewNothingSelected">
                                <Image
                                    src="/error.svg"
                                    height={60}
                                    width={60}
                                    alt="error"
                                />
                                <br />
                                <p className="text-zinc-400 font-normal text-center">Please select a template to</p>
                                <p className="text-zinc-400 font-normal text-center">preview its contents</p>
                            </div>
                            <div className="h-full w-full flex flex-col hidden" id="templatePreviewSelected">
                                <p className="text-[#121212] text-sm mr-[10px]">Subject line</p>
                                <div className="h-[50px] w-full border-1 border-zinc-300 rounded-[2.5px] p-[10px] text-[#121212] overflow-x-scroll overflow-y-hidden text-nowrap text-clip" id="templatePreviewSubject"></div>
                                <br />
                                <p className="text-[#121212] text-sm mr-[10px]">Message Content</p>
                                <div className="w-full border-1 border-zinc-300 rounded-[2.5px] p-[10px] text-[#121212] overflow-y-scroll flex-1" id="templatePreviewMessage"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default function Generate() {
    return (
        <div className="w-full h-full bg-white select-none" style={{fontFamily: "Poppins"}}>
            <div className="w-full h-full hidden mbp:block">
                {desktopView()}
            </div>
            <div className="w-full h-full block mbp:hidden">
                {mobileView()}
            </div>
        </div>
    );
}