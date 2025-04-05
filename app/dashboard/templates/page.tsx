'use client'
import Image from "next/image"
import { ChangeEvent, useEffect } from "react";
import { useState } from "react";
import Cookies from "js-cookie"


declare global {
    interface HTMLElement {
        src: string,
        value: string,
        href: string,
        disabled: string,
    }

    interface Event {
        inputType: string,
        data: string,
        key: string
    }

    interface EventTarget {
        value: string
    }
}

interface InvdividualTemplate {
    templateName: string, 
    subject: string,
    message: string,
}

export default function Templates() {
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

    function createNewTemplate(event: Event): boolean {
        event.preventDefault();
        const templateName = document.getElementById("newTemplateName");
        const subjectDiv = document.getElementById("newTemplateSubjectContent");
        const contentDiv = document.getElementById("newTemplateMessageContent");
        const s: string | undefined = Cookies.get("templates");

        const obj = {
            templateName: templateName?.value || "",
            subject: subjectDiv?.innerText || "",
            message: contentDiv?.innerText || "", 
        }

        if (s === undefined) {
    
            const t = {
                0: obj
            }
    
            Cookies.set("templates", `${JSON.stringify(t)}`, {expires: 1000});
        } else {
            let t = JSON.parse(decodeURIComponent(s));
            let i = 0;

            for(const templateId in t) {
                i = Number(templateId);
            }

            t[i+1] = obj;
            Cookies.set("templates", `${JSON.stringify(t)}`, {expires: 1000});
        }

        

        return false;
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

    function matchUrl(s: string) {
        const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
        const regex = new RegExp(expression);

        return (s.match(regex) !== null);
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

    function messageTagListener(urlToAdd: string | null = null) {
        const subjectDiv = document.getElementById("newTemplateMessageContent");
        let charCount = getCountCharactersBefore(subjectDiv!);
        const constantCharCount = charCount;
        const text = subjectDiv!.innerText;
        let lastAppended = false;
        let lastWord = ""
        let numCompanyNameTags = 0;
        let numGeneratedTextTags = 0;

        let i = 0;
        subjectDiv!.innerHTML = "";
        for(i; i < (text!.length); i++) {
            if (text![i] === "\n" || text![i] === " ") {
                if (matchUrl(lastWord)) {
                    const t = text![i];
                    const size = lastWord.length;
                    const selection = document.getSelection();
                    selection!.removeAllRanges();
                    selection!.selectAllChildren(subjectDiv!);
                    selection!.collapseToStart();
                    
                    for (let j = 0; j < (i - size - ((numCompanyNameTags) * ("@companyName".length - 1) + (numGeneratedTextTags * ("@generatedText".length - 1)))); j++) {
                        selection!.modify("move", "right", "character");
                    }

                    for (let k = 0; k < size; k++) {
                        selection!.modify("extend", "right", "character");
                    }

                    selection!.deleteFromDocument();
                    const e = createUrlAnchorTag(lastWord);
                    subjectDiv!.appendChild(e);
                    lastWord = "";
                    subjectDiv!.innerHTML += t
                    continue
                }
                lastWord = "";
            } else {
                lastWord += text![i];
            }

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

                numCompanyNameTags += 1;
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

                numGeneratedTextTags += 1;
            } else if ((text!.length - i) >= "!!LINK!![]".length && text!.slice(i, i+("!!LINK!![".length)) === "!!LINK!![") {
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

                const ele = document.createElement("span");
                ele.style.display = "inline-flex";
                ele.style.width = "0";
                ele.style.height = "0";
                ele.style.overflow = "hidden";
                ele.innerHTML = `!!LINK!![${((linkId === (linkCount.toString()) && (urlToAdd !== null) ? urlToAdd : url))},${displayText},${linkId}]`;
                ele.contentEditable = "false";
                subjectDiv!.appendChild(ele);

                const e = createUrlAnchorTag(((linkId === (linkCount.toString()) && (urlToAdd !== null) ? urlToAdd : url)), displayText)
                e.id = linkId;
                subjectDiv!.appendChild(e);

                if (i < charCount) {
                    charCount -= `!!LINK!![${url},${displayText},${linkCount}]`.length;
                    charCount += 1;
                }

                if (i === (text!.length - (`!!LINK!![${url},${displayText},${linkCount}]`.length + displayText.length))) {
                    lastAppended = true;
                    i += (`!!LINK!![${url},${displayText},${linkCount}]`.length + displayText.length);
                } else {
                    i += (`!!LINK!![${url},${displayText},${linkCount}]`.length + displayText.length) - 1; 
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
        return 
    }

    function getSelectedText(): string | null {
        const selection = window.getSelection();

        if (selection!.rangeCount === 0) {
            window.alert("Please select the text that you want to add link to.");
            return null;
        }

        return selection!.toString();
    }

    let addLinkDivShowing = false;
    let cursorPositionBeforeLink;
    let linkCount = 0;

    function addNewLinkEventListener(linkId: string) {
        const e = document.getElementById(linkId);
        const d = document.getElementById("applyLinkGoToText");
        e!.href =  d!.value;

        if (d!.value === "") {
            const applyLinkButton = document.getElementById("applyLinkButton");
            applyLinkButton!.style.backgroundColor = "#71717b";
            applyLinkButton!.disabled = "true";
        } else {
            const applyLinkButton = document.getElementById("applyLinkButton");
            applyLinkButton!.style.backgroundColor = "black";
            applyLinkButton!.removeAttribute("disabled")
        }
    }

    function applyLink() {
        const gotoTextInput = document.getElementById("applyLinkGoToText");
        const url = gotoTextInput!.value;
        console.log(url);
        messageTagListener(url);
        const parentDiv = document.getElementById("newTemplateForm");
        parentDiv!.removeChild(applyLinkDiv);
        addLinkDivShowing = false;
    }

    function calculateApplyLinkDivPos(divHeight: number = 200, divWidth : number = 200) {
        const selection = window.getSelection();
        const range = selection!.getRangeAt(0).cloneRange();
        range.collapse(false);

        const e = document.createElement("span");
        range.insertNode(e);

        const rect = e.getBoundingClientRect();

        console.log("Left: ", rect.left);
        console.log("Top: ", rect.top);
        e.parentNode!.removeChild(e);

        const d = document.getElementById("newTemplateMessageContent");
        const controlRect = d!.getBoundingClientRect();
        console.log("Control Left: ", controlRect.left);
        console.log("Control Top: ", controlRect.top);

        let x = rect.left + 10;
        let y = rect.top + 25;

        if ((y + divHeight) > (controlRect.top + 280)) {
            y = controlRect.top + 280 - divHeight - 25;
        }

        if ((x + divWidth) > (controlRect.left + 450)) {
            x = controlRect.left + 450 - divWidth - 10;
        }
        
        return [x, y]
    }

    function createApplyLinkDiv(x: number, y: number) {
        const e = document.createElement("div");
        const inputEle1 = document.createElement("input");
        inputEle1.type = "text";
        inputEle1.id = "applyLinkDisplayText"
        inputEle1.className = "border-1 border-zinc-300 h-[40px] w-[180px] p-[10px] rounded-[2.5px] focus:outline-1 text-zinc-500";
        inputEle1.placeholder = "Display Text";

        const inputEle2 = document.createElement("input");
        inputEle2.type = "text";
        inputEle2.className = "border-1 border-zinc-300 h-[40px] w-[180px] p-[10px] rounded-[2.5px] focus:outline-1 text-zinc-500";
        inputEle2.placeholder = "Go To Link";
        inputEle2.id = "applyLinkGoToText"

        inputEle2.addEventListener("input", () => {
            addNewLinkEventListener(linkCount.toString());
        });


        const inputButton = document.createElement("input");
        inputButton.type = "button";
        inputButton.className = "border-1 border-zinc-600 h-[40px] w-[80%] bg-zinc-500 text-white rounded-[2.5px] hover:cursor-pointer"
        inputButton.value = "Apply Link"
        inputButton.onclick = applyLink;
        inputButton.id = "applyLinkButton";
        inputButton.disabled = true;
 
        const t = `absolute bg-white h-[200px] w-[200px] rounded-[5px] shadow-[0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)] p-[10px] flex flex-col items-center justify-evenly`;
        e.className = t;
        e.style.top = `${y}px`;
        e.style.left  = `${x}px`;
        e.appendChild(inputEle1);
        e.appendChild(inputEle2);
        e.appendChild(inputButton);
        return e;
    }

    let applyLinkDiv: HTMLElement;

    function toggleAddlink() {
        const parentDiv = document.getElementById("newTemplateForm")
        const messageDiv = document.getElementById("newTemplateMessageContent")
        
        if (!addLinkDivShowing) {
            const [calculatedX, calculatedY] = calculateApplyLinkDivPos();
            applyLinkDiv = createApplyLinkDiv(calculatedX, calculatedY);
            linkCount += 1;
            parentDiv!.appendChild(applyLinkDiv)
            
            const displayText = getSelectedText();
            if (displayText === null) {
                addLinkDivShowing = false;
            } else {
                cursorPositionBeforeLink = getCountCharactersBefore(messageDiv!);
                const d = document.getElementById("applyLinkDisplayText");
                d!.value = displayText;
                d!.disabled = "true";
                const messageContent = messageDiv!.innerText;
                messageDiv!.innerHTML = ""
                for (let i = 0; i < messageContent!.length; i++) {
                    if (i === (cursorPositionBeforeLink - displayText.length)) {
                        
                        const ele = document.createElement("span");
                        ele.style.display = "inline-flex";
                        ele.style.width = "0";
                        ele.style.height = "0";
                        ele.style.overflow = "hidden";
                        ele.contentEditable = "false";
                        ele.innerHTML = `!!LINK!![${""},${displayText},${linkCount}]`;
                        messageDiv!.appendChild(ele);
                    }
                    messageDiv!.innerHTML += messageContent[i];
                }
                messageTagListener();
                document.getElementById("applyLinkGoToText")!.focus();
            }
        } else {
            parentDiv!.removeChild(applyLinkDiv);
            addLinkDivShowing = false;
        }
        
    }

    useEffect(()=>{
        const form = document.getElementById("newTemplateForm");
        form!.addEventListener("submit", (event)=>{
            createNewTemplate(event);
        })

    }, [])

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
                <div className="h-full w-[30%] max-w-[300px] hidden mbp:block bg-zinc-100">
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
                                    <form className="w-full" id="newTemplateForm">
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
                                        <div className="h-[300px] w-full pl-[10px] pt-[10px] text-zinc-300 border-1 border-zinc-300 overflow-y-scroll rounded-[2.5px] p-[10px] focus:outline-offset-5 text-wrap focus:outline-zinc-400 hover:cursor-text relative" id="newTemplateContent" contentEditable="false" onClick={() => {
                                            if (!contentActive) {
                                                const d = document.getElementById("newTemplateContent")
                                                d!.innerText = "";
                                                d!.innerHTML = `<p contenteditable="true" class="focus:outline-none whitespace-pre text-wrap" style="text-wrap:auto" id="newTemplateMessageContent"></p>`
                                                const e = document.getElementById("newTemplateMessageContent") 
                                                e!.focus();
                                                e!.addEventListener("input", (event) => {
                                                    messageTagListener();
                                                })

                                                e!.addEventListener("keydown", (event) => {
                                                    messageKeyListener(event);
                                                })
                                                e!.style.color = "#121212";
                                                contentActive = true;
                                            }
                                            
                                        }}>Enter the content of your email</div>
                                        <div className="w-full h-[45px] p-[10px]">

                                        </div>
                                        <div className="w-full flex justify-between items-center">
                                            <div className="flex w-[100px] justify-between items-center">
                                                <div className="h-[50px] w-[50px] flex justify-center items-center hover:cursor-pointer" onClick={toggleAddlink}>
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