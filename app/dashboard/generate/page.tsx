"use client"
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

interface InvdividualTemplate {
    templateName: string, 
    subject: string,
    message: string,
}

interface SiteInfoResponse {
    domain: string,
    title: string,
    content: string,
    excerpt: string
}

interface GeneratedText {
    text: string,
}

declare global {
    interface HTMLElement {
        selectedIndex: number
    }
}

export default function Generate() {
    let [templates, setTemplates] = useState(Array<InvdividualTemplate>);
    let currentEmailInputTab = "manual";

    function populateTemplates() {
        try {    const s: string | undefined = Cookies.get("templates");

            if (s == undefined) {
                window.location.href = "/dashboard/templates";
            }

            const obj = JSON.parse(decodeURIComponent(s!));
            const ele = document.getElementById("selectTemplateMobile");
            const ele2 = document.getElementById("selectTemplate");
            let currentTemplates: Array<InvdividualTemplate> = []
            for(let templateId in obj) {
                const currentTemplate: InvdividualTemplate = obj[templateId];
                currentTemplates.push(currentTemplate);
                const op = document.createElement("option");
                op.id = `template_${templateId}`;
                op.innerText = currentTemplate["templateName"];

                const op2 = document.createElement("option");
                op2.id = `template_${templateId}`;
                op2.innerText = currentTemplate["templateName"];
                ele!.appendChild(op);
                ele2!.appendChild(op2);
            }

            setTemplates(currentTemplates)
        } catch (e) {
            console.error("Firefox cookie access error:", e);
        }
    }

    useEffect(() => {
        const handleLoad = () => {
            setTimeout(populateTemplates, 100);
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }

        return () => window.removeEventListener('load', handleLoad);
    }, []);

    function mobileView() {
        const [sidebarShowing, setSidebarShowing] = useState(false);
        let [companyDomains, setCompanyDomains] = useState(Array<string>);
        let [currentCompanyIndex, setCurrentCompanyIndex] = useState(-1);
        let [mails, setMails] = useState(new Map<string, string>);
        let [companyInfo, setCompanyInfo] = useState(Array<SiteInfoResponse>);
        let [currentTemplateIndex, setCurrentTemplateIndex] = useState(-1);
        let [generatedContent, setGeneratedContent] = useState(Array<GeneratedText>);
        let [currentMailPreviewCount, setCurrentMailPreviewCount] = useState(1);
        let [mailAction, setMailAction] = useState("Drafts")

        function toggleSidebarMobile() {
            const e1 = document.getElementById("hamburgerTop");
            const e2 = document.getElementById("hamburgerMid");
            const e3 = document.getElementById("hamburgerEnd");

            const sidebar = document.getElementById("sidebarMobile")
            if (!sidebarShowing) {
                e1!.style.top = "33%";
                e2!.style.display = "none";
                e3!.style.bottom = "33%";

                e1!.style.transform = "rotate(45deg)";
                e3!.style.transform = "rotate(-45deg)";
                sidebar!.style.width = "80%";
                setSidebarShowing(true);
            } else {
                e1!.style.top = "0";
                e2!.style.display = "flex";
                e3!.style.bottom = "0";

                e1!.style.transform = "rotate(0deg)";
                e3!.style.transform = "rotate(0deg)";
                sidebar!.style.width = "0";
                setSidebarShowing(false);
            }
        }

        function toggleCurrentEmailInputTab(t: string) {
            currentEmailInputTab = t;

            const manualTab = document.getElementById("emailInputManualTabMobile");
            const uploadTab = document.getElementById("emailInputUploadTabMobile");
            const manualDiv = document.getElementById("manualDivMobile");
            const uploadDiv = document.getElementById("uploadDivMobile");
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
            const e = document.getElementById("uploadFileMobile");
            e!.click();
        }

        function validateMail(str: string) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
        }

        function resetCompanyInfoDiv() {
            for(let i = 0; i < 4; i++) {
                const e1 = document.getElementById(`${i}_loading_animation_mobile`);
                const e2 = document.getElementById(`${i}_check_mobile`);
                const e3 = document.getElementById(`${i}_cross_mobile`);

                if (i === 0) {
                    e1!.style.display = "block";
                    e2!.style.display = "none";
                    e3!.style.display = "none";
                } else {
                    e1!.style.display = "none";
                    e2!.style.display = "none";
                    e3!.style.display = "none";
                }
            }
        }

        async function findCompanyInfo(currentCompanyDomains: Array<string>) {
            const endpoints = ["/about", "/aboutus", "/about-us", "/"];
            let currentCompanyInfo: Array<SiteInfoResponse> = []
            for(let i = 0; i < currentCompanyDomains.length; i++) {
                console.log("lmao")
                for(let j = 0; j < endpoints.length; j++) {
                    try {
                        const response = await axios.post(`/api/getSiteInfo?domain=${currentCompanyDomains[i]}&endpoint=${endpoints[j]}`);

                        currentCompanyInfo.push(response.data);
                        const loadAnimation = document.getElementById(`${j}_loading_animation_mobile`);
                        const check = document.getElementById(`${j}_check_mobile`);
                        loadAnimation!.style.display = "none";
                        check!.style.display = "block";

                        if (i != currentCompanyDomains.length-1) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            resetCompanyInfoDiv();
                            setCurrentCompanyIndex(i+1);
                            const domainsDup = currentCompanyDomains.slice(0);
                            setCompanyDomains(domainsDup);
                        }
                        break;
                    
                    } catch (e) {
                        console.log("error: ", e);
                        const loadAnimation = document.getElementById(`${j}_loading_animation_mobile`);
                        const cross = document.getElementById(`${j}_cross_mobile`);
                        loadAnimation!.style.display = "none";
                        cross!.style.display = "block";

                        if (j != 3) {
                            const nextLoadAnimation = document.getElementById(`${j+1}_loading_animation_mobile`);
                            nextLoadAnimation!.style.display = "block";
                        }
                        continue;
                    }
                }
            }
            setCompanyInfo(currentCompanyInfo);
            await populateSiteContentStatusDiv(currentCompanyInfo, currentCompanyDomains);
        }

        async function populateSiteContentStatusDiv(companyInfo: Array<SiteInfoResponse>, companyDomains: Array<string>) {
            const ele = document.getElementById("siteContentStatusMobile");
            
            for (let k = 0; k < ele!.childNodes!.length; k++) {
                ele!.removeChild(ele!.childNodes[k]);
            }

            for(let i = 0; i < companyDomains.length; i++) {
                let domainInfoFound = false;

                const newDiv = document.createElement("div");
                newDiv.className = "w-full h-[50px] flex justify-between items-center pl-[10px]";

                const innerDiv = document.createElement("div");
                innerDiv.className = "w-[calc(100%-50px)] h-full flex items-center";

                const innerDivImage = document.createElement("img");
                innerDivImage.className = "h-[30px] w-[30px] mr-[10px] rounded-[5px]";
                innerDivImage.alt = "companyLogo";
                innerDivImage.src = `https://www.google.com/s2/favicons?domain=${companyDomains[i]}&sz=40`;
                innerDiv.appendChild(innerDivImage);

                const innerDivPara = document.createElement("p");
                innerDivPara.className = "text-2xl text-[#121212] font-medium text-nowrap text-ellipsis w-[calc(100%-50px)] overflow-clip";
                innerDivPara.innerHTML = companyDomains[i];
                innerDiv.appendChild(innerDivPara);

                const img = document.createElement("img");
                img.className = "pr-[10px]";
                img.style.color = "transparent";
                img.decoding = "async";
                img.height = 40;
                img.width = 40;
                img.loading = "lazy";

                for(let j = 0; j < companyInfo.length; j++) {
                    if (companyInfo[j]["domain"] === companyDomains[i]) {
                        domainInfoFound = true;
                        img.src = "/check_green.svg";
                        img.alt = "check";
                        break;
                    }
                }

                if (!domainInfoFound) {
                    img.src = "/close_red.svg";
                    img.alt = "cross";
                }

                newDiv.appendChild(innerDiv);
                newDiv.appendChild(img);
                ele!.appendChild(newDiv);
            }

            const e1 = document.getElementById("siteContentStatusReviewDivMobile");
            const e2 = document.getElementById("checkSiteContentDivMobile");
            e2!.style.display = "none";
            e1!.style.display = "block";
            await new Promise(resolve => setTimeout(()=>{
                const e = document.getElementById("templatePreviewDivMobile");
                e!.scrollIntoView({behavior: "smooth"})
                resolve
            }, 1000));
        }

        function handleNextStepClick() {
            const mailsDiv = document.getElementById("emailInputManualMobile");
            const mailsDivContent = mailsDiv!.value;
            const mails: Array<string> = mailsDivContent.trim().split("\n");
            const currentCompanyDomains = [];
            let currentMails: Map<string, string> = new Map();
            for(let i = 0; i < mails.length; i++) {
                if (!validateMail(mails[i])) {
                    alert("Invalid mails detected.")
                    return false;
                }
                const currentDomain = mails[i].slice(mails[i].indexOf("@")+1);
                currentCompanyDomains.push(currentDomain);
                currentMails.set(currentDomain, mails[i]);
            }

            const inputDiv = document.getElementById("emailInputTabMobile");
            const companyInfoDiv = document.getElementById("checkSiteContentDivMobile");

            inputDiv!.style.display = "none";
            companyInfoDiv!.style.display = "block";
            setCurrentCompanyIndex(0);
            setCompanyDomains(currentCompanyDomains);
            setMails(currentMails);
            findCompanyInfo(currentCompanyDomains); 
        }

        function handleBack() {
            const inputDiv = document.getElementById("emailInputTab");
            const companyInfoDiv = document.getElementById("checkSiteContentDivMobile");
            setCompanyDomains([]);
            resetCompanyInfoDiv();
            inputDiv!.style.display = "block";
            companyInfoDiv!.style.display = "none";
        }

        async function generateMails() {
            const ele = document.getElementById("selectTemplateMobile");
            if (ele!.selectedIndex === 0) {
                alert("Please select a template before proceeding");
                return false;
            } 
            const templatePreviewDiv = document.getElementById("templatePreviewDivMobile");
            const generatedMailPreviewDiv = document.getElementById("generatedMailPreviewDivMobile");
            templatePreviewDiv!.style.display = "none";
            generatedMailPreviewDiv!.style.display = "block";

            const currentGeneratedContent: Array<GeneratedText> = [];
            for (let i = 0; i < companyInfo.length; i++) {
                const generatedMailLoadingDiv = document.getElementById("generatedMailLoadingMobile");
                const generatedMailLoadedDiv = document.getElementById("generatedMailLoadedMobile");

                const response = await axios.post("/api/generateContent", companyInfo[i]);

                if (i === 0) {
                    const subjectDiv = document.getElementById("generatedMailSubjectMobile");
                    const messageDiv = document.getElementById("generatedMailMessageMobile");

                    generatedMailLoadingDiv!.style.display = "none";
                    generatedMailLoadedDiv!.style.display = "block";
                    subjectDiv!.innerText = templates[currentTemplateIndex]["subject"].replaceAll("@companyName", companyInfo[i]["domain"]);
                    messageDiv!.innerText = (templates[currentTemplateIndex]["message"].replaceAll("@companyName", companyInfo[i]["domain"])).replaceAll("@generatedText", response.data["text"]);
                    formatText(messageDiv!);
                }
                currentGeneratedContent.push(response.data);
                setGeneratedContent(currentGeneratedContent.slice(0))

            }

            setGeneratedContent(currentGeneratedContent);
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

        function updateTemplatePreview() {
            const ele = document.getElementById("selectTemplateMobile");
            const obj: InvdividualTemplate = templates[ele!.selectedIndex-1];
            
            if (currentTemplateIndex === -1) {
                setCurrentTemplateIndex(ele!.selectedIndex - 1);
                const notTemplateSelectedDiv = document.getElementById("templatePreviewNothingSelectedMobile");
                const templateSelectedDiv = document.getElementById("templatePreviewSelectedMobile");
                notTemplateSelectedDiv!.style.display = "none";
                templateSelectedDiv!.style.display = "flex";
            } else {
                setCurrentTemplateIndex(ele!.selectedIndex - 1);
            }

            const previewSubject = document.getElementById("templatePreviewSubjectMobile");
            const previewMessage = document.getElementById("templatePreviewMessageMobile");

            previewSubject!.innerText = obj["subject"];
            previewMessage!.innerText = obj["message"];

            formatText(previewSubject!);
            formatText(previewMessage!);
        }

        async function handleMailActionClick() {
            try {
                const message = {
                    to: mails.get(companyInfo[currentMailPreviewCount-1]["domain"]),
                    subject: document.getElementById("generatedMailSubjectMobile")?.innerText,
                    body: document.getElementById("generatedMailMessageMobile")?.innerHTML
                }
                if (mailAction === "Drafts") {
                    await axios.post("/api/saveDraft", message);
                } else if (mailAction === "Send") {
                    await axios.post("/api/sendMail", message);
                } else if (mailAction === "Send All") {

                }
                
                document.getElementById("mailActionCompletedDivMobile")!.style.display = "flex";
            } catch (error) {
                console.log(error)
                alert("Failure");
            }
        }

        function handleMailActionsDropDown() {
            const ele = document.getElementById("emailActionsDropDownDivMobile");
            const img = document.getElementById("mailActionsDropDownImageMobile")
            if (ele!.style.height === "0px") {
                ele!.style.height = "100px";
                img!.style.transform = "rotate(180deg)";
            } else {
                ele!.style.height = "0";
                img!.style.transform = "rotate(0deg)";
            }
        }

        function handleMailActionOptionClick(tabClicked: string) {
            if (tabClicked === "drafts") {
                setMailAction("Drafts");
            } else if (tabClicked === "send") {
                setMailAction("Send");
            } else if (tabClicked === "sendAll") {
                setMailAction("Send All");
            }
            handleMailActionsDropDown();
        }

        function handleMailPreviewClick(dir: string) {
            if (dir === "right") {
                if (currentMailPreviewCount < generatedContent.length) {
                    console.log(currentMailPreviewCount)
                    setCurrentMailPreviewCount(currentMailPreviewCount+1);
                    const subjectDiv = document.getElementById("generatedMailSubjectMobile");
                    const messageDiv = document.getElementById("generatedMailMessageMobile");

                    subjectDiv!.innerText = templates[currentTemplateIndex]["subject"].replaceAll("@companyName", companyInfo[currentMailPreviewCount]["domain"]);
                    messageDiv!.innerText = (templates[currentTemplateIndex]["message"].replaceAll("@companyName", companyInfo[currentMailPreviewCount]["domain"])).replaceAll("@generatedText", generatedContent[currentMailPreviewCount]["text"]);
                    console.log(currentMailPreviewCount)
                    formatText(messageDiv!);
                }
            } else if (dir === "left") {
                if (currentMailPreviewCount > 1) {
                    setCurrentMailPreviewCount(currentMailPreviewCount-1);
                    const subjectDiv = document.getElementById("generatedMailSubjectMobile");
                    const messageDiv = document.getElementById("generatedMailMessageMobile");

                    subjectDiv!.innerText = templates[currentTemplateIndex]["subject"].replaceAll("@companyName", companyInfo[currentMailPreviewCount-2]["domain"]);
                    messageDiv!.innerText = (templates[currentTemplateIndex]["message"].replaceAll("@companyName", companyInfo[currentMailPreviewCount-2]["domain"])).replaceAll("@generatedText", generatedContent[currentMailPreviewCount-2]["text"]);
                    formatText(messageDiv!);
                }
            }

            
        }

        return (
            <div className="w-full h-max bg-white relative">
                <div className="w-full h-[60px] bg-white flex items-center p-[10px] border-b-1 border-slate-200">
                    <div className="w-full h-[60px] z-0 flex justify-center items-center absolute top-0 left-0">
                        <p className="text-[#121212] text-2xl font-bold ml-[10px]">Generate Mail</p>
                    </div>
                    <div className="w-[40px] h-[40px] relative" onClick={toggleSidebarMobile}>
                        <div className="w-full h-[33%] flex justify-center items-center absolute top-0 duration-150 ease-in-out" id="hamburgerTop">
                            <div className="w-full border-1 border-[#121212]"></div>
                        </div>
                        <div className="w-full h-[33%] flex justify-center items-center absolute top-[33%] duration-150 ease-in-out" id="hamburgerMid">
                            <div className="w-full border-1 border-[#121212]"></div>
                        </div>
                        <div className="w-full h-[33%] flex justify-center items-center absolute bottom-0 duration-150 ease-in-out" id="hamburgerEnd">
                            <div className="w-full border-1 border-[#121212]"></div>
                        </div>
                    </div>
                    
                </div>
                {/* sidebar */}
                <div className="h-[calc(100%-60px)] w-[0%] bg-zinc-100 absolute top-[60px] overflow-hidden duration-150 flex flex-col items-center z-100" id="sidebarMobile">
                    <div className="h-[50px] w-[90%] flex justify-between items-center rounded-[5px] hover:cursor-pointer" onClick={()=>{window.location.href = "/"}}>
                        <div className="flex items-center">
                            <Image
                                src="/home.svg"
                                height={25}
                                width={25}
                                alt="home"
                            />
                            <p className="text-[#121212] text-xl font-normal ml-[10px]">Homepage</p>
                        </div>
                    </div>
                    <div className="h-[50px] w-[90%] flex justify-between items-center rounded-[5px] hover:cursor-pointer" onClick={()=>{window.location.href = "/dashboard/templates"}}>
                        <div className="flex items-center">
                            <Image
                                src="/mail_draft.svg"
                                height={25}
                                width={25}
                                alt="draft"
                            />
                            <p className="text-[#121212] text-xl font-normal ml-[10px]">Email Templates</p>
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
                            <p className="text-[#121212] text-xl font-normal ml-[10px]">Generate Email</p>
                        </div>
                    </div>
                </div>

                {/* Main content div */}
                <div className="w-full min-h-[calc(100%-80px)] h-[175vh] flex flex-col justify-between items-center p-[10px]">
                    <div className="w-full h-[100vh]" id="emailInputTabMobile">
                        <div className="h-full w-full bg-white rounded-[5px] border-1 border-zinc-300 p-[30px]">
                            <p className="text-3xl text-[#121212] font-medium">Recipients</p>
                            <p className="text-zinc-400 font-normal">Enter email addresses manually or upload a file</p>
                            <br />
                            <div className="w-full h-[50px] bg-zinc-300 rounded-[5px] p-[5px] flex justify-between items-center">
                                <div className="h-full w-[calc(50%-5px)] bg-white rounded-[2.5px] flex justify-center items-center text-[#121212] hover:cursor-pointer" id="emailInputManualTabMobile" onClick={()=>{toggleCurrentEmailInputTab("manual")}}>
                                    <p>Enter Manually</p>
                                </div>
                                <div className="h-full w-[calc(50%-5px)] bg-transparent rounded-[2.5px] flex justify-center items-center text-zinc-500 hover:cursor-pointer" id="emailInputUploadTabMobile" onClick={()=>{toggleCurrentEmailInputTab("upload")}}>
                                    <p>Upload List</p>
                                </div>
                            </div>
                            <div className="h-[calc(100%-225px)]" id="manualDivMobile">
                                <div className="w-full h-[50px] flex justify-between items-center">
                                    <p className="text-lg text-[#121212] font-medium">Email Addresses</p>
                                </div>
                                <textarea className="w-full h-[calc(100%-50px)] bg-white rounded-[5px] border-1 border-zinc-300 resize-none p-[10px] text-[#121212] focus:outline-zinc-200 focus:outline-[2px] focus:outline-offset-2" id="emailInputManualMobile" placeholder="Enter email addresses (one per line)"></textarea>
                            </div>

                            <div className="hidden h-[calc(100%-225px)]" id="uploadDivMobile">
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
                                        <input className="hidden" type="file" id="uploadFileMobile"/>
                                        <br />
                                        <div className="h-[50px] w-[150px] bg-white hover:cursor-pointer hover:bg-zinc-100 rounded-[5px] border-1 border-zinc-300 flex justify-center items-center ease-in-out duration-150" onClick={handleFileUploadButton}>
                                            <p className="font-medium">Select File</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-[70px] flex items-center justify-end pt-[10px] pb-[10px]">
                                <div className="w-[150px] h-[50px] bg-[#121212] rounded-[5px] flex items-center justify-center hover:cursor-pointer">
                                    <p className="text-zinc-100 text-lg font-normal" onClick={handleNextStepClick}>Next Steps</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Div that shows up after clicking next*/}
                    <div className="w-full h-max hidden" id="checkSiteContentDivMobile">
                        <div className="w-full h-full border-1 border-zinc-300 rounded-[5px] p-[10px] relative">
                            <div className="w-full flex text-nowrap text-ellipsis pb-[10px]">
                                <img src={`https://www.google.com/s2/favicons?domain=${companyDomains[currentCompanyIndex]}&sz=40`} className="h-[40px] w-[40px] mr-[10px] rounded-[5px]" alt="companyLogo" />
                                <p className="text-3xl text-[#121212] font-medium text-nowrap text-ellipsis w-[calc(100%-50px)] overflow-clip">{companyDomains[currentCompanyIndex]}</p>
                            </div>
                            <p className="text-zinc-400 font-normal">Finding infromation about {companyDomains[currentCompanyIndex]}</p>
                            <br />
                            <div className="h-[50px] w-full flex justify-between items-center">
                                <div className="w-[calc(100%-60px)] pl-[10px]">
                                    <a href={`https://www.${companyDomains[currentCompanyIndex]}/about`} className="text-blue-500 text-xl" >{companyDomains[currentCompanyIndex]}/about</a>
                                </div>
                                <div className="h-[30px] w-[40px] pr-[10px]">
                                    <div className="w-[30px] aspect-square rounded-[50%] border-4 border-4 border-t-[#121212] border-b-[#121212] border-r-white border-l-white animate-myspin" id="0_loading_animation_mobile"></div>
                                    <div className="w-[30px] h-[30px] hidden" id="0_check_mobile">
                                        <Image
                                            src="/check_green.svg"
                                            height={30}
                                            width={30}
                                            alt="check"
                                        />
                                    </div>
                                    <div className="w-[30px] h-[30px] hidden" id="0_cross_mobile">
                                        <Image
                                            src="/close_red.svg"
                                            height={30}
                                            width={30}
                                            alt="check"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="h-[50px] w-full flex justify-between items-center">
                                <div className="w-[calc(100%-60px)] pl-[10px]">
                                    <a href={`https://www.${companyDomains[currentCompanyIndex]}/aboutus`} className="text-blue-500 text-xl" >{companyDomains[currentCompanyIndex]}/aboutus</a>
                                </div>
                                <div className="h-[30px] w-[40px] pr-[10px]">
                                    <div className="w-[30px] aspect-square rounded-[50%] border-4 border-4 border-t-[#121212] border-b-[#121212] border-r-white border-l-white animate-myspin hidden" id="1_loading_animation_mobile"></div>
                                    <div className="w-[30px] h-[30px] hidden" id="1_check_mobile">
                                        <Image
                                            src="/check_green.svg"
                                            height={30}
                                            width={30}
                                            alt="check"
                                        />
                                    </div>
                                    <div className="w-[30px] h-[30px] hidden" id="1_cross_mobile">
                                        <Image
                                            src="/close_red.svg"
                                            height={30}
                                            width={30}
                                            alt="check"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="h-[50px] w-full flex justify-between items-center">
                                <div className="w-[calc(100%-60px)] pl-[10px]">
                                    <a href={`https://www.${companyDomains[currentCompanyIndex]}}/about-us`} className="text-blue-500 text-xl" >{companyDomains[currentCompanyIndex]}/about-us</a>
                                </div>
                                <div className="h-[30px] w-[40px] pr-[10px]">
                                    <div className="w-[30px] aspect-square rounded-[50%] border-4 border-4 border-t-[#121212] border-b-[#121212] border-r-white border-l-white animate-myspin hidden" id="2_loading_animation_mobile"></div>
                                    <div className="w-[30px] h-[30px] hidden" id="2_check_mobile">
                                        <Image
                                            src="/check_green.svg"
                                            height={30}
                                            width={30}
                                            alt="check"
                                        />
                                    </div>
                                    <div className="w-[30px] h-[30px] hidden" id="2_cross_mobile">
                                        <Image
                                            src="/close_red.svg"
                                            height={30}
                                            width={30}
                                            alt="check"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="h-[50px] w-full flex justify-between items-center">
                                <div className="w-[calc(100%-60px)] pl-[10px]">
                                    <a href={`https://${companyDomains[currentCompanyIndex]}/`} className="text-blue-500 text-xl" >{companyDomains[currentCompanyIndex]}/</a>
                                </div>
                                <div className="h-[30px] w-[40px] pr-[10px]">
                                    <div className="w-[30px] aspect-square rounded-[50%] border-4 border-4 border-t-[#121212] border-b-[#121212] border-r-white border-l-white animate-myspin hidden" id="3_loading_animation_mobile"></div>
                                    <div className="w-[30px] h-[30px] hidden" id="3_check_mobile">
                                        <Image
                                            src="/check_green.svg"
                                            height={30}
                                            width={30}
                                            alt="check"
                                        />
                                    </div>
                                    <div className="w-[30px] h-[30px] hidden" id="3_cross_mobile">
                                        <Image
                                            src="/close_red.svg"
                                            height={30}
                                            width={30}
                                            alt="check"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-[50px] flex justify-center items-center">
                                <p className="text-[#121212] font-normal text-xl">{currentCompanyIndex+1} / {companyDomains.length}</p>
                            </div>
                            <br />
                            <div className="w-full h-[50px] flex justify-between items-center">
                                <div className="w-[150px] h-full flex items-center justify-center bg-white border-1 border-zinc-300 rounded-[5px] text-[#121212] font-normal hover:cursor-pointer" onClick={handleBack}>Back</div>
                                <div className="w-[150px] h-full flex items-center justify-center bg-[#121212] border-1 border-zinc-300 rounded-[5px] text-zinc-100 font-normal hover:cursor-pointer">Generate</div>
                            </div>
                        </div>
                    </div>
                    {/* div that shows up after all data has been fetched */}
                    <div className="w-full h-[500px] hidden" id="siteContentStatusReviewDivMobile">
                        <div className="w-full h-full border-1 border-zinc-300 rounded-[5px] p-[30px] flex flex-col">
                            <p className="text-3xl text-[#121212] font-medium">Content Status</p>
                            <p className="text-zinc-400 font-normal">The application was able to find information for the following companies:</p>
                            <br />
                            <div className="w-full grow-1 overflow-hidden overflow-y-scroll" id="siteContentStatusMobile">
                                
                            </div>
                            <br />
                            
                        </div>
                    </div>
                    <div className="w-full h-[50px]"></div>
                    {/* template preview div*/}
                    <div className="h-[100vh] w-full bg-white rounded-[5px] border-1 border-zinc-300 p-[10px]" id="templatePreviewDivMobile">
                        <p className="text-3xl text-[#121212] font-medium">Email Template</p>
                        <p className="text-zinc-400 font-normal">Select the template you want to use</p>
                        <br />
                        <select className="h-[50px] w-full rounded-[5px] text-[#121212] border-1 border-zinc-300 focus:outline-zinc-200 focus:outline-[2px] focus:outline-offset-2" name="selectedTemplate" id="selectTemplateMobile" onChange={(event)=>{updateTemplatePreview()}} defaultValue="selectOption">
                            <option className="mt-[20px]" value="selectOption" disabled>Select Template</option>
                        </select>
                        <div className="w-full h-[50px] flex justify-between items-center">
                            <p className="text-lg text-[#121212] font-medium">Template Preview</p>
                        </div>
                        <div className="w-full h-[calc(100%-260px)] bg-white ">
                            <div className="h-full w-full p-[30px] flex flex-col items-center rounded-[5px] border-1 border-zinc-300" id="templatePreviewNothingSelectedMobile">
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
                            <div className="h-full w-full flex flex-col hidden" id="templatePreviewSelectedMobile">
                                <p className="text-[#121212] text-sm mr-[10px]">Subject line</p>
                                <div className="h-[50px] w-full border-1 border-zinc-300 rounded-[2.5px] p-[10px] text-[#121212] overflow-x-scroll overflow-y-hidden text-nowrap text-clip" id="templatePreviewSubjectMobile"></div>
                                <br />
                                <p className="text-[#121212] text-sm mr-[10px]">Message Content</p>
                                <div className="w-full border-1 border-zinc-300 rounded-[2.5px] p-[10px] text-[#121212] overflow-y-scroll flex-1" id="templatePreviewMessageMobile"></div>
                            </div>
                        </div>
                        <br />
                        <div className="w-full h-[50px] flex justify-end items-center">
                            <div className="h-full w-[150px] bg-[#121212] flex justify-center items-center rounded-[5px] hover:cursor-pointer" onClick={generateMails}>
                                <p className="text-zinc-100">Generate</p>
                            </div>
                        </div>
                    </div>
                    {/* generated text mails */}
                    <div className="h-[100vh] w-full bg-white rounded-[5px] border-1 border-zinc-300 p-[10px] hidden" id="generatedMailPreviewDivMobile">
                        <div className="h-[calc(100%-50px)] w-full border-b-1 border-zinc-300 overflow-hidden overflow-y-scroll relative hidden" id="generatedMailLoadedMobile">
                            <div className="w-full h-[50px] flex items-center justify-between pr-[10px] pl-[10px] pt-0">
                                <div className="w-[50%] text-nowrap">
                                    <p className="text-[#121212] text-xl mr-[10px] truncate">To: {(companyInfo.length === 0) ? "" : mails.get(companyInfo[currentMailPreviewCount-1]["domain"])}</p>
                                </div>
                                <div className="w-[150px] h-[50px] bg-[#121212] border-1 border-zinc-400 rounded-[5px] hover:cursor-pointer hover:bg-zinc-800  duration-250 ease-in-out p-[10px] flex justify-between items-center" id="emailActionButtonMobile">
                                    <p className="w-[calc(100%-30px)] h-full" onClick={handleMailActionClick}>{mailAction}</p>
                                    <Image
                                        src="/drop_down_white.svg"
                                        height={30}
                                        width={30}
                                        alt="down"
                                        onClick={handleMailActionsDropDown}
                                        id="mailActionsDropDownImageMobile"   
                                        className="duration-100 ease-in-out"                       
                                    />
                                </div>
                            </div>
                            <div className="w-full h-0 pr-[10px] flex items-center justify-end absolute top-[50px] duration-100 ease-in-out" id="emailActionsDropDownDivMobile">
                                <div className="w-[150px] h-full bg-[#121212] border-1 border-zinc-300 rounded-[5px] overflow-hidden pr-[10px] pl-[10px]">
                                    <div className="h-[50%] hover:bg-zinc-800 hover:cursor-pointer flex justify-center items-center text-white" id="dropDownOption_draftsMobile" onClick={()=>{handleMailActionOptionClick("drafts")}}>Drafts</div>
                                    <div className="h-[50%] hover:bg-zinc-800 hover:cursor-pointer border-t-1 border-zinc-500 flex justify-center items-center text-white" id="dropDownOption_sendMobile" onClick={()=>{handleMailActionOptionClick("send")}}>Send</div>
                                    {/* <div className="h-[33%] hover:bg-zinc-800 hover:cursor-pointer flex justify-center items-center text-white" id="dropDownOption_sendAllMobile" onClick={()=>{handleMailActionOptionClick("sendAll")}}>Send All</div> */}
                                </div>
                            </div>
                            <br />
                            <p className="text-[#121212] text-sm mr-[10px]">Subject line</p>
                            <div className="h-[50px] w-full border-1 border-zinc-300 rounded-[2.5px] p-[10px] text-[#121212] overflow-x-scroll overflow-y-hidden text-nowrap text-clip" id="generatedMailSubjectMobile"></div>
                            <br />
                            <p className="text-[#121212] text-sm mr-[10px]">Message Content</p>
                            <div className="w-full border-1 border-zinc-300 rounded-[2.5px] p-[10px] text-[#121212] flex-1" id="generatedMailMessageMobile"></div>
                            <br />
                        </div>
                        <div className="h-[calc(100%-50px)] w-full border-b-1 border-zinc-300] flex flex-col justify-center items-center" id="generatedMailLoadingMobile">
                            <p className="text-4xl font-semibold bg-gradient-to-r from-cyan-500 to-green-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-mygradient pb-1">Generating...</p>
                        </div>
                        <div className="h-[50px] w-full flex justify-evenly items-center">
                            <Image
                                src="/arrow_left.svg"
                                height={30}
                                width={30}
                                alt="left"
                                className="hover:cursor-pointer"
                                onClick={()=>{handleMailPreviewClick("left")}}
                            />
                            <p className="text-[#121212] text-xl">{currentMailPreviewCount} / {generatedContent.length}</p>
                            <Image
                                src="/arrow_right.svg"
                                height={30}
                                width={30}
                                alt="right"
                                className="hover:cursor-pointer"
                                onClick={()=>{handleMailPreviewClick("right")}}
                            />
                        </div>
                    </div>
                    
                </div>
                <div className="absolute bottom-[100px] w-full h-[50px] z-50 bg-transparent flex justify-center items-center hidden" id="mailActionCompletedDivMobile">
                    <div className="w-[250px] h-full bg-slate-800 border-1 border-zinc-300 rounded-[2.5px] flex items-center justify-between p-[10px]">
                        <p className="text-white">{mailAction === "Drafts" ? "Saved to drafts" : "Mail sent"}</p>
                        <Image
                            src="/cross_white.svg"
                            height={25}
                            width={25}
                            alt="cross"
                            className="hover:cursor-pointer"
                            onClick={()=>{
                                document.getElementById("mailActionCompletedDivMobile")!.style.display = "none";
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }

    function desktopView() {
        let currentEmailInputTab = "manual";
        let [currentTemplateIndex, setCurrentTemplateIndex] = useState(-1);
        let [companyDomains, setCompanyDomains] = useState(Array<string>);
        let [currentCompanyIndex, setCurrentCompanyIndex] = useState(-1);
        let [companyInfo, setCompanyInfo] = useState(Array<SiteInfoResponse>);
        let [mails, setMails] = useState(new Map<string, string>);
        let [generatedContent, setGeneratedContent] = useState(Array<GeneratedText>);
        let [currentMailPreviewCount, setCurrentMailPreviewCount] = useState(1);
        let [mailAction, setMailAction] = useState("Drafts")

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
                setCurrentTemplateIndex(ele!.selectedIndex - 1);
                const notTemplateSelectedDiv = document.getElementById("templatePreviewNothingSelected");
                const templateSelectedDiv = document.getElementById("templatePreviewSelected");
                notTemplateSelectedDiv!.style.display = "none";
                templateSelectedDiv!.style.display = "flex";
            } else {
                setCurrentTemplateIndex(ele!.selectedIndex - 1);
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

        function handleBack() {
            const inputDiv = document.getElementById("emailInputTab");
            const companyInfoDiv = document.getElementById("checkSiteContentDiv");
            setCompanyDomains([]);
            resetCompanyInfoDiv();
            inputDiv!.style.display = "block";
            companyInfoDiv!.style.display = "none";
        }

        async function generateMails() {
            const ele = document.getElementById("selectTemplate");
            if (ele!.selectedIndex === 0) {
                alert("Please select a template before proceeding");
                return false;
            } 
            const templatePreviewDiv = document.getElementById("templatePreviewDiv");
            const generatedMailPreviewDiv = document.getElementById("generatedMailPreviewDiv");
            templatePreviewDiv!.style.display = "none";
            generatedMailPreviewDiv!.style.display = "block";

            const currentGeneratedContent: Array<GeneratedText> = [];
            for (let i = 0; i < companyInfo.length; i++) {
                const generatedMailLoadingDiv = document.getElementById("generatedMailLoading");
                const generatedMailLoadedDiv = document.getElementById("generatedMailLoaded");

                const response = await axios.post("/api/generateContent", companyInfo[i]);

                if (i === 0) {
                    const subjectDiv = document.getElementById("generatedMailSubject");
                    const messageDiv = document.getElementById("generatedMailMessage");

                    generatedMailLoadingDiv!.style.display = "none";
                    generatedMailLoadedDiv!.style.display = "block";
                    subjectDiv!.innerText = templates[currentTemplateIndex]["subject"].replaceAll("@companyName", companyInfo[i]["domain"]);
                    messageDiv!.innerText = (templates[currentTemplateIndex]["message"].replaceAll("@companyName", companyInfo[i]["domain"])).replaceAll("@generatedText", response.data["text"]);
                    formatText(messageDiv!);
                }
                currentGeneratedContent.push(response.data);
                setGeneratedContent(currentGeneratedContent.slice(0))

            }

            setGeneratedContent(currentGeneratedContent);
        }

        function validateMail(str: string) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
        }

        function handleNextStepClick() {
            const mailsDiv = document.getElementById("emailInputManual");
            const mailsDivContent = mailsDiv!.value;
            const mails: Array<string> = mailsDivContent.trim().split("\n");
            const currentCompanyDomains = [];
            let currentMails: Map<string, string> = new Map();
            for(let i = 0; i < mails.length; i++) {
                if (!validateMail(mails[i])) {
                    alert("Invalid mails detected.")
                    return false;
                }
                const currentDomain = mails[i].slice(mails[i].indexOf("@")+1);
                currentCompanyDomains.push(currentDomain);
                currentMails.set(currentDomain, mails[i]);
            }

            const inputDiv = document.getElementById("emailInputTab");
            const companyInfoDiv = document.getElementById("checkSiteContentDiv");

            inputDiv!.style.display = "none";
            companyInfoDiv!.style.display = "block";
            setCurrentCompanyIndex(0);
            setCompanyDomains(currentCompanyDomains);
            setMails(currentMails);
            findCompanyInfo(currentCompanyDomains); 
        }

        function resetCompanyInfoDiv() {
            for(let i = 0; i < 4; i++) {
                const e1 = document.getElementById(`${i}_loading_animation`);
                const e2 = document.getElementById(`${i}_check`);
                const e3 = document.getElementById(`${i}_cross`);

                if (i === 0) {
                    e1!.style.display = "block";
                    e2!.style.display = "none";
                    e3!.style.display = "none";
                } else {
                    e1!.style.display = "none";
                    e2!.style.display = "none";
                    e3!.style.display = "none";
                }
            }
        }

        async function findCompanyInfo(currentCompanyDomains: Array<string>) {
            const endpoints = ["/about", "/aboutus", "/about-us", "/"];
            let currentCompanyInfo: Array<SiteInfoResponse> = []
            for(let i = 0; i < currentCompanyDomains.length; i++) {
                console.log("lmao")
                for(let j = 0; j < endpoints.length; j++) {
                    try {
                        const response = await axios.post(`/api/getSiteInfo?domain=${currentCompanyDomains[i]}&endpoint=${endpoints[j]}`);

                        currentCompanyInfo.push(response.data);
                        const loadAnimation = document.getElementById(`${j}_loading_animation`);
                        const check = document.getElementById(`${j}_check`);
                        loadAnimation!.style.display = "none";
                        check!.style.display = "block";

                        if (i != currentCompanyDomains.length-1) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            resetCompanyInfoDiv();
                            setCurrentCompanyIndex(i+1);
                            const domainsDup = currentCompanyDomains.slice(0);
                            setCompanyDomains(domainsDup);
                        }
                        break;
                    
                    } catch {
                        console.log("error")
                        const loadAnimation = document.getElementById(`${j}_loading_animation`);
                        const cross = document.getElementById(`${j}_cross`);
                        loadAnimation!.style.display = "none";
                        cross!.style.display = "block";

                        if (j != 3) {
                            const nextLoadAnimation = document.getElementById(`${j+1}_loading_animation`);
                            nextLoadAnimation!.style.display = "block";
                        }
                        continue;
                    }
                }
            }
            setCompanyInfo(currentCompanyInfo);
            populateSiteContentStatusDiv(currentCompanyInfo, currentCompanyDomains);
        }

        function populateSiteContentStatusDiv(companyInfo: Array<SiteInfoResponse>, companyDomains: Array<string>) {
            const ele = document.getElementById("siteContentStatus");
            
            for (let k = 0; k < ele!.childNodes!.length; k++) {
                ele!.removeChild(ele!.childNodes[k]);
            }

            for(let i = 0; i < companyDomains.length; i++) {
                let domainInfoFound = false;

                const newDiv = document.createElement("div");
                newDiv.className = "w-full h-[50px] flex justify-between items-center pl-[10px]";

                const innerDiv = document.createElement("div");
                innerDiv.className = "w-[calc(100%-50px)] h-full flex items-center";

                const innerDivImage = document.createElement("img");
                innerDivImage.className = "h-[30px] w-[30px] mr-[10px] rounded-[5px]";
                innerDivImage.alt = "companyLogo";
                innerDivImage.src = `https://www.google.com/s2/favicons?domain=${companyDomains[i]}&sz=40`;
                innerDiv.appendChild(innerDivImage);

                const innerDivPara = document.createElement("p");
                innerDivPara.className = "text-2xl text-[#121212] font-medium text-nowrap text-ellipsis w-[calc(100%-50px)] overflow-clip";
                innerDivPara.innerHTML = companyDomains[i];
                innerDiv.appendChild(innerDivPara);

                const img = document.createElement("img");
                img.className = "pr-[10px]";
                img.style.color = "transparent";
                img.decoding = "async";
                img.height = 40;
                img.width = 40;
                img.loading = "lazy";

                for(let j = 0; j < companyInfo.length; j++) {
                    if (companyInfo[j]["domain"] === companyDomains[i]) {
                        domainInfoFound = true;
                        img.src = "/check_green.svg";
                        img.alt = "check";
                        break;
                    }
                }

                if (!domainInfoFound) {
                    img.src = "/close_red.svg";
                    img.alt = "cross";
                }

                newDiv.appendChild(innerDiv);
                newDiv.appendChild(img);
                ele!.appendChild(newDiv);
            }

            const e1 = document.getElementById("siteContentStatusReviewDiv");
            const e2 = document.getElementById("checkSiteContentDiv");
            e2!.style.display = "none";
            e1!.style.display = "block";
        }

        function handleMailPreviewClick(dir: string) {
            if (dir === "right") {
                if (currentMailPreviewCount < generatedContent.length) {
                    console.log(currentMailPreviewCount)
                    setCurrentMailPreviewCount(currentMailPreviewCount+1);
                    const subjectDiv = document.getElementById("generatedMailSubject");
                    const messageDiv = document.getElementById("generatedMailMessage");

                    subjectDiv!.innerText = templates[currentTemplateIndex]["subject"].replaceAll("@companyName", companyInfo[currentMailPreviewCount]["domain"]);
                    messageDiv!.innerText = (templates[currentTemplateIndex]["message"].replaceAll("@companyName", companyInfo[currentMailPreviewCount]["domain"])).replaceAll("@generatedText", generatedContent[currentMailPreviewCount]["text"]);
                    console.log(currentMailPreviewCount)
                    formatText(messageDiv!);
                }
            } else if (dir === "left") {
                if (currentMailPreviewCount > 1) {
                    setCurrentMailPreviewCount(currentMailPreviewCount-1);
                    const subjectDiv = document.getElementById("generatedMailSubject");
                    const messageDiv = document.getElementById("generatedMailMessage");

                    subjectDiv!.innerText = templates[currentTemplateIndex]["subject"].replaceAll("@companyName", companyInfo[currentMailPreviewCount-2]["domain"]);
                    messageDiv!.innerText = (templates[currentTemplateIndex]["message"].replaceAll("@companyName", companyInfo[currentMailPreviewCount-2]["domain"])).replaceAll("@generatedText", generatedContent[currentMailPreviewCount-2]["text"]);
                    formatText(messageDiv!);
                }
            }

            
        }

        function handleMailActionsDropDown() {
            const ele = document.getElementById("emailActionsDropDownDiv");
            const img = document.getElementById("mailActionsDropDownImage")
            if (ele!.style.height === "0px") {
                ele!.style.height = "100px";
                img!.style.transform = "rotate(180deg)";
            } else {
                ele!.style.height = "0";
                img!.style.transform = "rotate(0deg)";
            }
        }

        function handleMailActionOptionClick(tabClicked: string) {
            if (tabClicked === "drafts") {
                setMailAction("Drafts");
            } else if (tabClicked === "send") {
                setMailAction("Send");
            } else if (tabClicked === "sendAll") {
                setMailAction("Send All");
            }
            handleMailActionsDropDown();
        }

        async function handleMailActionClick() {
            try {
                const message = {
                    to: mails.get(companyInfo[currentMailPreviewCount-1]["domain"]),
                    subject: document.getElementById("generatedMailSubject")?.innerText,
                    body: document.getElementById("generatedMailMessage")?.innerHTML
                }
                if (mailAction === "Drafts") {
                    await axios.post("/api/saveDraft", message);
                } else if (mailAction === "Send") {
                    await axios.post("/api/sendMail", message);
                } else if (mailAction === "Send All") {

                }
                
                document.getElementById("mailActionCompletedDiv")!.style.display = "flex";
            } catch (error) {
                console.log(error)
                alert("Failure");
            }
        }

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
                            <div className="flex items-center" onClick={()=>{window.location.href = "/"}}>
                                <Image
                                    src="/home.svg"
                                    height={25}
                                    width={25}
                                    alt="home"
                                />
                                <p className="text-[#121212] font-normal ml-[10px]">Homepage</p>
                            </div>
                        </div>
                        <div className="h-[50px] w-[90%] flex justify-between items-center rounded-[5px] hover:cursor-pointer">
                            <div className="flex items-center" onClick={()=>{window.location.href = "/dashboard/templates"}}>
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
                        {/* This is the div that shows up first on the left by default */}
                        <div className="w-[calc(50%-15px)] h-full" id="emailInputTab">
                            <div className="h-full w-full bg-white rounded-[5px] border-1 border-zinc-300 p-[30px]">
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
                                    <textarea className="w-full h-[calc(100%-50px)] bg-white rounded-[5px] border-1 border-zinc-300 resize-none p-[10px] text-[#121212] focus:outline-zinc-200 focus:outline-[2px] focus:outline-offset-2" id="emailInputManual" placeholder="Enter email addresses (one per line)"></textarea>
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
                                <div className="w-full h-[70px] flex items-center justify-end pt-[10px] pb-[10px]">
                                    <div className="w-[150px] h-[50px] bg-[#121212] rounded-[5px] flex items-center justify-center hover:cursor-pointer">
                                        <p className="text-zinc-100 text-lg font-normal" onClick={handleNextStepClick}>Next Steps</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* next step div, this shows up when user presses next button */}
                        <div className="w-[calc(50%-15px)] h-full hidden" id="checkSiteContentDiv">
                            <div className="w-full h-full border-1 border-zinc-300 rounded-[5px] p-[30px] relative">
                                <div className="w-full flex text-nowrap text-ellipsis pb-[10px]">
                                    <img src={`https://www.google.com/s2/favicons?domain=${companyDomains[currentCompanyIndex]}&sz=40`} className="h-[40px] w-[40px] mr-[10px] rounded-[5px]" alt="companyLogo" />
                                    <p className="text-3xl text-[#121212] font-medium text-nowrap text-ellipsis w-[calc(100%-50px)] overflow-clip">{companyDomains[currentCompanyIndex]}</p>
                                </div>
                                <p className="text-zinc-400 font-normal">Finding infromation about {companyDomains[currentCompanyIndex]}</p>
                                <br />
                                <div className="h-[50px] w-full flex justify-between items-center">
                                    <div className="w-[calc(100%-60px)] pl-[10px]">
                                        <a href={`https://www.${companyDomains[currentCompanyIndex]}/about`} className="text-blue-500 text-xl" >{companyDomains[currentCompanyIndex]}/about</a>
                                    </div>
                                    <div className="h-[30px] w-[40px] pr-[10px]">
                                        <div className="w-[30px] aspect-square rounded-[50%] border-4 border-4 border-t-[#121212] border-b-[#121212] border-r-white border-l-white animate-myspin" id="0_loading_animation"></div>
                                        <div className="w-[30px] h-[30px] hidden" id="0_check">
                                            <Image
                                                src="/check_green.svg"
                                                height={30}
                                                width={30}
                                                alt="check"
                                            />
                                        </div>
                                        <div className="w-[30px] h-[30px] hidden" id="0_cross">
                                            <Image
                                                src="/close_red.svg"
                                                height={30}
                                                width={30}
                                                alt="check"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[50px] w-full flex justify-between items-center">
                                    <div className="w-[calc(100%-60px)] pl-[10px]">
                                        <a href={`https://www.${companyDomains[currentCompanyIndex]}/aboutus`} className="text-blue-500 text-xl" >{companyDomains[currentCompanyIndex]}/aboutus</a>
                                    </div>
                                    <div className="h-[30px] w-[40px] pr-[10px]">
                                        <div className="w-[30px] aspect-square rounded-[50%] border-4 border-4 border-t-[#121212] border-b-[#121212] border-r-white border-l-white animate-myspin hidden" id="1_loading_animation"></div>
                                        <div className="w-[30px] h-[30px] hidden" id="1_check">
                                            <Image
                                                src="/check_green.svg"
                                                height={30}
                                                width={30}
                                                alt="check"
                                            />
                                        </div>
                                        <div className="w-[30px] h-[30px] hidden" id="1_cross">
                                            <Image
                                                src="/close_red.svg"
                                                height={30}
                                                width={30}
                                                alt="check"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[50px] w-full flex justify-between items-center">
                                    <div className="w-[calc(100%-60px)] pl-[10px]">
                                        <a href={`https://www.${companyDomains[currentCompanyIndex]}}/about-us`} className="text-blue-500 text-xl" >{companyDomains[currentCompanyIndex]}/about-us</a>
                                    </div>
                                    <div className="h-[30px] w-[40px] pr-[10px]">
                                        <div className="w-[30px] aspect-square rounded-[50%] border-4 border-4 border-t-[#121212] border-b-[#121212] border-r-white border-l-white animate-myspin hidden" id="2_loading_animation"></div>
                                        <div className="w-[30px] h-[30px] hidden" id="2_check">
                                            <Image
                                                src="/check_green.svg"
                                                height={30}
                                                width={30}
                                                alt="check"
                                            />
                                        </div>
                                        <div className="w-[30px] h-[30px] hidden" id="2_cross">
                                            <Image
                                                src="/close_red.svg"
                                                height={30}
                                                width={30}
                                                alt="check"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[50px] w-full flex justify-between items-center">
                                    <div className="w-[calc(100%-60px)] pl-[10px]">
                                        <a href={`https://${companyDomains[currentCompanyIndex]}/`} className="text-blue-500 text-xl" >{companyDomains[currentCompanyIndex]}/</a>
                                    </div>
                                    <div className="h-[30px] w-[40px] pr-[10px]">
                                        <div className="w-[30px] aspect-square rounded-[50%] border-4 border-4 border-t-[#121212] border-b-[#121212] border-r-white border-l-white animate-myspin hidden" id="3_loading_animation"></div>
                                        <div className="w-[30px] h-[30px] hidden" id="3_check">
                                            <Image
                                                src="/check_green.svg"
                                                height={30}
                                                width={30}
                                                alt="check"
                                            />
                                        </div>
                                        <div className="w-[30px] h-[30px] hidden" id="3_cross">
                                            <Image
                                                src="/close_red.svg"
                                                height={30}
                                                width={30}
                                                alt="check"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full h-[50px] flex justify-center items-center">
                                    <p className="text-[#121212] font-normal text-xl">{currentCompanyIndex+1} / {companyDomains.length}</p>
                                </div>
                                <br />
                                <div className="w-full h-[50px] flex justify-between items-center">
                                    <div className="w-[150px] h-full flex items-center justify-center bg-white border-1 border-zinc-300 rounded-[5px] text-[#121212] font-normal hover:cursor-pointer" onClick={handleBack}>Back</div>
                                    <div className="w-[150px] h-full flex items-center justify-center bg-[#121212] border-1 border-zinc-300 rounded-[5px] text-zinc-100 font-normal hover:cursor-pointer">Generate</div>
                                </div>
                            </div>
                        </div>
                        {/* this is the div that is rendered after data of all sites has been fetched */}
                        <div className="w-[calc(50%-15px)] h-full hidden" id="siteContentStatusReviewDiv">
                            <div className="w-full h-full border-1 border-zinc-300 rounded-[5px] p-[30px] flex flex-col">
                                <p className="text-3xl text-[#121212] font-medium">Content Status</p>
                                <p className="text-zinc-400 font-normal">The application was able to find information for the following companies:</p>
                                <br />
                                <div className="w-full grow-1 overflow-hidden overflow-y-scroll" id="siteContentStatus">
                                    
                                </div>
                                <br />
                                <div className="w-full h-[50px] flex justify-end items-center">
                                    <div className="h-full w-[150px] bg-[#121212] flex justify-center items-center rounded-[5px] hover:cursor-pointer" onClick={generateMails}>
                                        <p className="text-zinc-100">Generate</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* template preview div*/}
                        <div className="h-full w-[calc(50%-15px)] bg-white rounded-[5px] border-1 border-zinc-300 p-[30px]" id="templatePreviewDiv">
                            <p className="text-3xl text-[#121212] font-medium">Email Template</p>
                            <p className="text-zinc-400 font-normal">Select the template you want to use</p>
                            <br />
                            <select className="h-[50px] w-full rounded-[5px] text-[#121212] border-1 border-zinc-300 focus:outline-zinc-200 focus:outline-[2px] focus:outline-offset-2" name="selectedTemplate" id="selectTemplate" onChange={(event)=>{updateTemplatePreview()}} defaultValue="selectOption">
                                <option className="mt-[20px]" value="selectOption" disabled>Select Template</option>
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
                        {/* generated text mails */}
                        <div className="h-full w-[calc(50%-15px)] bg-white rounded-[5px] border-1 border-zinc-300 p-[30px] hidden" id="generatedMailPreviewDiv">
                            <div className="h-[calc(100%-50px)] w-full border-b-1 border-zinc-300 overflow-hidden overflow-y-scroll relative hidden" id="generatedMailLoaded">
                                <div className="w-full h-[50px] flex items-center justify-between pr-[10px] pl-[10px] pt-0">
                                    <div className="w-[50%] text-nowrap">
                                        <p className="text-[#121212] text-xl mr-[10px] truncate">To: {(companyInfo.length === 0) ? "" : mails.get(companyInfo[currentMailPreviewCount-1]["domain"])}</p>
                                    </div>
                                    <div className="w-[150px] h-[50px] bg-[#121212] border-1 border-zinc-400 rounded-[5px] hover:cursor-pointer hover:bg-zinc-800  duration-250 ease-in-out p-[10px] flex justify-between items-center" id="emailActionButton">
                                        <p className="w-[calc(100%-30px)] h-full" onClick={handleMailActionClick}>{mailAction}</p>
                                        <Image
                                            src="/drop_down_white.svg"
                                            height={30}
                                            width={30}
                                            alt="down"
                                            onClick={handleMailActionsDropDown}
                                            id="mailActionsDropDownImage"   
                                            className="duration-100 ease-in-out"                       
                                        />
                                    </div>
                                </div>
                                <div className="w-full h-0 pr-[10px] flex items-center justify-end absolute top-[50px] duration-100 ease-in-out" id="emailActionsDropDownDiv">
                                    <div className="w-[150px] h-full bg-[#121212] border-1 border-zinc-300 rounded-[5px] overflow-hidden pr-[10px] pl-[10px]">
                                        <div className="h-[50%] hover:bg-zinc-800 hover:cursor-pointer flex justify-center items-center text-white" id="dropDownOption_drafts" onClick={()=>{handleMailActionOptionClick("drafts")}}>Drafts</div>
                                        <div className="h-[50%] hover:bg-zinc-800 hover:cursor-pointer border-t-1 border-zinc-500 flex justify-center items-center text-white" id="dropDownOption_send" onClick={()=>{handleMailActionOptionClick("send")}}>Send</div>
                                        {/* <div className="h-[33%] hover:bg-zinc-800 hover:cursor-pointer flex justify-center items-center text-white" id="dropDownOption_sendAll" onClick={()=>{handleMailActionOptionClick("sendAll")}}>Send All</div> */}
                                    </div>
                                </div>
                                <br />
                                <p className="text-[#121212] text-sm mr-[10px]">Subject line</p>
                                <div className="h-[50px] w-full border-1 border-zinc-300 rounded-[2.5px] p-[10px] text-[#121212] overflow-x-scroll overflow-y-hidden text-nowrap text-clip" id="generatedMailSubject"></div>
                                <br />
                                <p className="text-[#121212] text-sm mr-[10px]">Message Content</p>
                                <div className="w-full border-1 border-zinc-300 rounded-[2.5px] p-[10px] text-[#121212] flex-1" id="generatedMailMessage"></div>
                                <br />
                            </div>
                            <div className="h-[calc(100%-50px)] w-full border-b-1 border-zinc-300] flex flex-col justify-center items-center" id="generatedMailLoading">
                                <p className="text-4xl font-semibold bg-gradient-to-r from-cyan-500 to-green-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-mygradient pb-1">Generating...</p>
                            </div>
                            <div className="h-[50px] w-full flex justify-evenly items-center">
                                <Image
                                    src="/arrow_left.svg"
                                    height={30}
                                    width={30}
                                    alt="left"
                                    className="hover:cursor-pointer"
                                    onClick={()=>{handleMailPreviewClick("left")}}
                                />
                                <p className="text-[#121212] text-xl">{currentMailPreviewCount} / {generatedContent.length}</p>
                                <Image
                                    src="/arrow_right.svg"
                                    height={30}
                                    width={30}
                                    alt="right"
                                    className="hover:cursor-pointer"
                                    onClick={()=>{handleMailPreviewClick("right")}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-5 w-full h-[50px] z-50 bg-transparent flex justify-center items-center hidden" id="mailActionCompletedDiv">
                    <div className="w-[250px] h-full bg-slate-800 border-1 border-zinc-300 rounded-[2.5px] flex items-center justify-between p-[10px]">
                        <p className="text-white">{mailAction === "Drafts" ? "Saved to drafts" : "Mail sent"}</p>
                        <Image
                            src="/cross_white.svg"
                            height={25}
                            width={25}
                            alt="cross"
                            className="hover:cursor-pointer"
                            onClick={()=>{
                                document.getElementById("mailActionCompletedDiv")!.style.display = "none";
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }

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