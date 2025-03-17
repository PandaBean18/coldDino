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

    function createCompanyNameTag() {
        const d = document.createElement('div');
        d.className = "h-[20px] text-white text-xs bg-cyan-700 w-[100px] flex justify-center items-center ml-[5px] mr-[5px] rounded-[2.5px]";
        d.innerText = " @companyName ";
        d.contentEditable = "false";

        return d;
    }

    function createGeneratedTextTag() {
        const d = document.createElement('div');
        d.className = "h-[20px] text-white text-xs bg-green-700 w-[100px] flex justify-center items-center ml-[5px] mr-[5px] rounded-[2.5px]";
        d.innerText = " @generatedText ";
        d.contentEditable = "false";

        return d;
    }

    function getCountCharactersBefore(d: HTMLElement) {
        // const selection = window.getSelection();
        // if (selection!.rangeCount === 0) {
        //     return 0;
        // }

        // const range = selection!.getRangeAt(0);
        // const preCursorRange = range.cloneRange();
        // preCursorRange.selectNodeContents(d); 
        // preCursorRange.setEnd(range.startContainer, range.startOffset); 

        // let l = preCursorRange.toString().length;
        // return l;
        // const range = selection!.getRangeAt(0);
        // const clonedRange = range.cloneRange();
        // clonedRange.collapse(true); // Collapse to the start of the range

        // const startRange = document.createRange();
        // startRange.setStart(d, 0); // Start from the beginning of the <p> tag
        // startRange.setEnd(clonedRange.startContainer, clonedRange.startOffset);

        // const textToLeft = startRange.toString();
        // return textToLeft.length;
        const selection = window.getSelection();
        const range = selection!.getRangeAt(0);
        const clonedRange = range.cloneRange();
        clonedRange.selectNodeContents(d);
        clonedRange.setEnd(range.endContainer, range.endOffset);

        const cursorPosition = clonedRange.toString().length;
        return cursorPosition;
    }

    let currentSubjectDiv = 1;
    let currentMessageDiv = 1;

    function addNewSubjectDiv(event: KeyboardEvent, divNo: number) {
        let subjectInput = document.getElementById(`newTemplateSubjectDiv${divNo}`);
        console.log(event.key)
        console.log(divNo);
        if (event.key === "Enter") {
            event.preventDefault();
            const selection = window.getSelection();
            const range = selection!.getRangeAt(0);
            // const rangeDup = range.cloneRange();
            console.log(range.extractContents().textContent)
            //rangeDup.setStart(range.startContainer, range.startOffset); 
            // rangeDup.setEndAfter(range.endContainer.lastChild! || range.endContainer);
            // selection!.removeAllRanges();
            // selection!.addRange(rangeDup);
            console.log(range.toString().length)

            const d = document.getElementById("newTemplateSubject");
            const newDiv = document.createElement("div");
            newDiv.id = `newTemplateSubjectDiv${currentSubjectDiv+1}`;
            currentSubjectDiv++;
            newDiv.className = "w-max max-w-full h-[24px] flex items-center focus:outline-none text-[#121212]";
            newDiv.contentEditable = "true";
            newDiv.onclick = () => {
                currentSubjectDiv = divNo+1;
            }

            d!.appendChild(newDiv);
            subjectInput = newDiv;
            subjectInput.focus();
            subjectInput.addEventListener("input", (e) => {
                subjectTagEventListener(e, currentSubjectDiv)
            });
            subjectInput.addEventListener("keydown", (e) => {
                addNewSubjectDiv(e, currentSubjectDiv);
            })
            prevCompanyNameCountSubjectDivArray.push(0);
            prevContentCountSubjectDivArray.push(0)
        } else if (event.key === "Backspace" && (subjectInput!.innerText === "" || subjectInput!.innerText === "\n")) {
            event.preventDefault();
            console.log("lmao")
            if (divNo != 1) {
                subjectInput!.removeEventListener("input", (event) => {
                    subjectTagEventListener(event, divNo);
                })

                subjectInput!.removeEventListener("keydown", (event) => {
                    addNewSubjectDiv(event, divNo);
                })
                let i = divNo-1;
                while (i > 0) {
                    const newSubject = document.getElementById(`newTemplateSubjectDiv${i}`);
                    if (newSubject != null) {
                        newSubject!.focus();
                        const selection = window.getSelection();
                        selection!.selectAllChildren(newSubject);
                        selection!.collapseToEnd();
                        currentSubjectDiv = i;
                        break;
                    }
                    i--;
                }
                subjectInput!.remove();
            } 
        } else if (event.key === "ArrowUp") {
            let i = divNo-1;
            while (i > 0) {
                const newSubject = document.getElementById(`newTemplateSubjectDiv${i}`);
                if (newSubject != null) {
                    newSubject!.focus();
                    const selection = window.getSelection();
                    selection!.selectAllChildren(newSubject);
                    selection!.collapseToEnd();
                    currentSubjectDiv = i;
                    break;
                }
                i--;
            }
        } else if (event.key === "ArrowDown") {
            let i = divNo+1;
            while (i <= prevCompanyNameCountSubjectDivArray.length) {
                const newSubject = document.getElementById(`newTemplateSubjectDiv${i}`);
                if (newSubject != null) {
                    newSubject!.focus();
                    const selection = window.getSelection();
                    selection!.selectAllChildren(newSubject);
                    selection!.collapseToEnd();
                    currentSubjectDiv = i;
                    break;
                }
                i++;
            }
        } else if(subjectInput!.offsetWidth >= 430 && event.key !== "Backspace") {
            //event.preventDefault();
            const d = document.getElementById("newTemplateSubject");
            const newDiv = document.createElement("div");
            newDiv.id = `newTemplateSubjectDiv${currentSubjectDiv+1}`;
            currentSubjectDiv++;
            newDiv.className = "w-max max-w-full h-[24px] flex items-center focus:outline-none text-[#121212]";
            newDiv.contentEditable = "true";
            newDiv.onclick = () => {
                currentSubjectDiv = divNo+1;

            }
            d!.appendChild(newDiv);
            subjectInput = newDiv;
            subjectInput.focus();
            subjectInput.addEventListener("input", (e) => {
                subjectTagEventListener(e, currentSubjectDiv)
            });
            subjectInput.addEventListener("keydown", (e) => {
                addNewSubjectDiv(e, currentSubjectDiv);
            })
            prevCompanyNameCountSubjectDivArray.push(0);
            prevContentCountSubjectDivArray.push(0);
        }
    }


    let prevContentCountMessageDivArray = [0];
    let prevCompanyNameCountMessageDivArray = [0];

    function messageContentTagEventListener(event: Event, divNo: number) { 
        const prevContentCount = prevContentCountMessageDivArray[divNo-1];

        const prevCompanyNameCount = prevCompanyNameCountMessageDivArray[divNo-1];
        const subjectInput = document.getElementById(`newTemplateContentDiv${divNo}`);
        const text = subjectInput!.innerText;
        let characterCount = getCountCharactersBefore(subjectInput!);
        const characterCountDup = characterCount;

        if (characterCount < ("@companyName".length)) {
            return;
        }

        subjectInput!.innerText = "";

        let lastAppended: boolean = false;
        let i = 0;
        let currentContentCount = 0;
        let contentAtStart: boolean = false
        let contentBeforeCursor = 0;
        let currentCompanyNameCount = 0;
        let companyNameAtStart: boolean = false
        let companyNameBeforeCursor = 0;
        for(i = 0; i <= (text!.length - "@companyName".length); i++) {
            if (((text!.length - i) >= "@generatedText".length) && text!.slice(i, i+("@generatedText".length)) === "@generatedText") {
                const d = createGeneratedTextTag();
                subjectInput!.appendChild(d);

                if (i < characterCountDup) {
                    if (i === 0) {
                        characterCount -= "@generatedText".length;
                        contentAtStart = true;
                    } else  {
                        characterCount -= "@generatedText\n".length;
                    }
                    contentBeforeCursor += 1;
                }

                if (i === (text!.length - "@generatedText".length)) {
                    lastAppended = true;
                    i += ("@generatedText".length);
                    
                } else {
                    i += ("@generatedText".length) - 1;
                    if (text![i+1] == "\n" && text![i+2] == "\xA0") {
                        i += 2;
                    } else if (text![i+1] === "\n") {
                        i += 1;
                        characterCount += ((i <= characterCountDup) ? 1 : 0);
                    }
                }
                currentContentCount += 1;
            } else if (text!.slice(i, i+("@companyName".length)) === "@companyName") {
                const d = createCompanyNameTag();
                subjectInput!.appendChild(d);

                if (i < characterCountDup) {
                    if (i === 0) {
                        console.log(1)
                        characterCount -= "@companyName".length;
                        companyNameAtStart = true;
                    } else  {
                        console.log(2)
                        characterCount -= "@companyName\n".length;
                    }
                    companyNameBeforeCursor += 1;
                }

                if (i === (text!.length - "@companyName".length)) {
                    lastAppended = true;
                    i += ("@companyName".length);
                    console.log(3)
                    
                } else {
                    i += ("@companyName".length) - 1;
                    if (text![i+1] == "\n" && text![i+2] == "\xA0") {
                        console.log(4)
                        i += 2;
                    } else if (text![i+1] === "\n") {
                        console.log(5)
                        i += 1;
                        characterCount += ((i <= characterCountDup) ? 1 : 0);
                    }
                }
                currentCompanyNameCount += 1;
            } else if ((text![i] === " " || text![i] === "\n") && text!.slice(i+1, i+("@generatedText".length) + 1) === "@generatedText") {
                continue;
            } else if ((text![i] === " " || text![i] === "\n") && text!.slice(i+1, i+("@companyName".length) + 1) === "@companyName") {
                console.log(6)
                continue;
            } else {
                subjectInput!.appendChild(document.createTextNode(text![i]));
            }
        }

        if (!lastAppended) {
            console.log(7)
            subjectInput!.appendChild(document.createTextNode(text!.slice(i)));
        } else {
            console.log(8)
            subjectInput!.appendChild(document.createTextNode("\xA0"));
        }

        if (prevContentCount === currentContentCount && prevCompanyNameCount === currentCompanyNameCount) {
            const selection = window.getSelection();
            selection!.removeAllRanges();
            selection!.selectAllChildren(subjectInput!);
            selection!.collapseToStart();
            console.log(9)
            for(let a = 0; a < (characterCount - (contentBeforeCursor + companyNameBeforeCursor)); a++) {
                selection!.modify("move", "right", "character")
            }
        } else if (prevCompanyNameCount < currentCompanyNameCount) {
            console.log(10)
            const selection = window.getSelection();
            selection!.removeAllRanges();
            selection!.selectAllChildren(subjectInput!);
            selection!.collapseToStart();
            for(let a = 0; a < (characterCount + (companyNameAtStart ? 2 : 3)); a++) {
                selection!.modify("move", "right", "character")
            }
        } else {
            const selection = window.getSelection();
            selection!.removeAllRanges();
            selection!.selectAllChildren(subjectInput!);
            selection!.collapseToStart();
            for(let a = 0; a < (characterCount + (contentAtStart ? 2 : 3)); a++) {
                selection!.modify("move", "right", "character")
            }
        }

        prevContentCountMessageDivArray[divNo-1] = currentContentCount;
        prevCompanyNameCountMessageDivArray[divNo-1] = currentCompanyNameCount;
    }

    let prevContentCountSubjectDivArray = [0];
    let prevCompanyNameCountSubjectDivArray = [0];

    function subjectTagEventListener(event: Event, divNo: number) { 
        const prevContentCount = prevContentCountSubjectDivArray[divNo-1];

        const prevCompanyNameCount = prevCompanyNameCountSubjectDivArray[divNo-1];
        const subjectInput = document.getElementById(`newTemplateSubjectDiv${divNo}`);
        const text = subjectInput!.innerText;
        let characterCount = getCountCharactersBefore(subjectInput!);
        const characterCountDup = characterCount;

        if (characterCount < ("@companyName".length)) {
            return;
        }

        subjectInput!.innerText = "";

        let lastAppended: boolean = false;
        let i = 0;
        let currentContentCount = 0;
        let contentAtStart: boolean = false
        let contentBeforeCursor = 0;
        let currentCompanyNameCount = 0;
        let companyNameAtStart: boolean = false
        let companyNameBeforeCursor = 0;
        for(i = 0; i <= (text!.length - "@companyName".length); i++) {
            if (((text!.length - i) >= "@generatedText".length) && text!.slice(i, i+("@generatedText".length)) === "@generatedText") {
                const d = createGeneratedTextTag();
                subjectInput!.appendChild(d);

                if (i < characterCountDup) {
                    if (i === 0) {
                        characterCount -= "@generatedText".length;
                        contentAtStart = true;
                    } else  {
                        characterCount -= "@generatedText\n".length;
                    }
                    contentBeforeCursor += 1;
                }

                if (i === (text!.length - "@generatedText".length)) {
                    lastAppended = true;
                    i += ("@generatedText".length);
                    
                } else {
                    i += ("@generatedText".length) - 1;
                    if (text![i+1] == "\n" && text![i+2] == "\xA0") {
                        i += 2;
                    } else if (text![i+1] === "\n") {
                        i += 1;
                        characterCount += ((i <= characterCountDup) ? 1 : 0);
                    }
                }
                currentContentCount += 1;
            } else if (text!.slice(i, i+("@companyName".length)) === "@companyName") {
                const d = createCompanyNameTag();
                subjectInput!.appendChild(d);

                if (i < characterCountDup) {
                    if (i === 0) {
                        console.log(1)
                        characterCount -= "@companyName".length;
                        companyNameAtStart = true;
                    } else  {
                        console.log(2)
                        characterCount -= "@companyName\n".length;
                    }
                    companyNameBeforeCursor += 1;
                }

                if (i === (text!.length - "@companyName".length)) {
                    lastAppended = true;
                    i += ("@companyName".length);
                    console.log(3)
                    
                } else {
                    i += ("@companyName".length) - 1;
                    if (text![i+1] == "\n" && text![i+2] == "\xA0") {
                        console.log(4)
                        i += 2;
                    } else if (text![i+1] === "\n") {
                        console.log(5)
                        i += 1;
                        characterCount += ((i <= characterCountDup) ? 1 : 0);
                    }
                }
                currentCompanyNameCount += 1;
            } else if ((text![i] === " " || text![i] === "\n") && text!.slice(i+1, i+("@generatedText".length) + 1) === "@generatedText") {
                continue;
            } else if ((text![i] === " " || text![i] === "\n") && text!.slice(i+1, i+("@companyName".length) + 1) === "@companyName") {
                console.log(6)
                continue;
            } else {
                subjectInput!.appendChild(document.createTextNode(text![i]));
            }
        }

        if (!lastAppended) {
            console.log(7)
            subjectInput!.appendChild(document.createTextNode(text!.slice(i)));
        } else {
            console.log(8)
            subjectInput!.appendChild(document.createTextNode("\xA0"));
        }

        if (prevContentCount === currentContentCount && prevCompanyNameCount === currentCompanyNameCount) {
            const selection = window.getSelection();
            selection!.removeAllRanges();
            selection!.selectAllChildren(subjectInput!);
            selection!.collapseToStart();
            console.log(9)
            for(let a = 0; a < (characterCount - (contentBeforeCursor + companyNameBeforeCursor)); a++) {
                selection!.modify("move", "right", "character")
            }
        } else if (prevCompanyNameCount < currentCompanyNameCount) {
            console.log(10)
            const selection = window.getSelection();
            selection!.removeAllRanges();
            selection!.selectAllChildren(subjectInput!);
            selection!.collapseToStart();
            for(let a = 0; a < (characterCount + (companyNameAtStart ? 2 : 3)); a++) {
                selection!.modify("move", "right", "character")
            }
        } else {
            const selection = window.getSelection();
            selection!.removeAllRanges();
            selection!.selectAllChildren(subjectInput!);
            selection!.collapseToStart();
            for(let a = 0; a < (characterCount + (contentAtStart ? 2 : 3)); a++) {
                selection!.modify("move", "right", "character")
            }
        }

        prevContentCountSubjectDivArray[divNo-1] = currentContentCount;
        prevCompanyNameCountSubjectDivArray[divNo-1] = currentCompanyNameCount;
    }


    function addNewContentDiv(event: KeyboardEvent, divNo: number) {
        let subjectInput = document.getElementById(`newTemplateContentDiv${divNo}`);
        console.log(event.key)
        console.log(divNo);
        if (event.key === "Enter") {
            event.preventDefault();
            const d = document.getElementById("newTemplateContent");
            const newDiv = document.createElement("div");
            newDiv.id = `newTemplateContentDiv${currentMessageDiv+1}`;
            currentMessageDiv++;
            newDiv.className = "w-max max-w-full h-[24px] flex items-center focus:outline-none text-[#121212]";
            newDiv.contentEditable = "true";
            newDiv.onclick = () => {
                currentMessageDiv = divNo+1;

            }
            d!.appendChild(newDiv);
            subjectInput = newDiv;
            subjectInput.focus();
            subjectInput.addEventListener("input", (e) => {
                messageContentTagEventListener(e, currentMessageDiv)
            });
            subjectInput.addEventListener("keydown", (e) => {
                addNewContentDiv(e, currentMessageDiv);
            })
            prevCompanyNameCountMessageDivArray.push(0);
            prevContentCountMessageDivArray.push(0);
        } else if (event.key === "Backspace" && (subjectInput!.innerText === "" || subjectInput!.innerText === "\n")) {
            event.preventDefault();
            console.log("lmao")
            if (divNo != 1) {
                subjectInput!.removeEventListener("input", (event) => {
                    messageContentTagEventListener(event, divNo);
                })

                subjectInput!.removeEventListener("keydown", (event) => {
                    addNewContentDiv(event, divNo);
                })
                let i = divNo-1;
                while (i > 0) {
                    const newSubject = document.getElementById(`newTemplateContentDiv${i}`);
                    if (newSubject != null) {
                        newSubject!.focus();
                        const selection = window.getSelection();
                        selection!.selectAllChildren(newSubject);
                        selection!.collapseToEnd();
                        currentMessageDiv = i;
                        break;
                    }
                    i--;
                }
                subjectInput!.remove();
            } 
        } else if (event.key === "ArrowUp") {
            let i = divNo-1;
            while (i > 0) {
                const newSubject = document.getElementById(`newTemplateContentDiv${i}`);
                if (newSubject != null) {
                    newSubject!.focus();
                    const selection = window.getSelection();
                    selection!.selectAllChildren(newSubject);
                    selection!.collapseToEnd();
                    currentMessageDiv = i;
                    break;
                }
                i--;
            }
        } else if (event.key === "ArrowDown") {
            let i = divNo+1;
            while (i <= prevCompanyNameCountMessageDivArray.length) {
                const newSubject = document.getElementById(`newTemplateContentDiv${i}`);
                if (newSubject != null) {
                    newSubject!.focus();
                    const selection = window.getSelection();
                    selection!.selectAllChildren(newSubject);
                    selection!.collapseToEnd();
                    currentMessageDiv = i;
                    break;
                }
                i++;
            }
        } else if (event.key === "ArrowRight") {
            return;
        } else if (event.key === "ArrowLeft") {
            return;
        } else if(subjectInput!.offsetWidth > 431 && (event.key !== "Backspace")) {
            //event.preventDefault();
            const d = document.getElementById("newTemplateContent");
            const newDiv = document.createElement("div");
            newDiv.id = `newTemplateContentDiv${currentMessageDiv+1}`;
            currentMessageDiv++;
            newDiv.className = "w-max max-w-full h-[24px] flex items-center focus:outline-none text-[#121212]";
            newDiv.contentEditable = "true";
            newDiv.onclick = () => {
                currentMessageDiv = divNo+1;

            }
            d!.appendChild(newDiv);
            subjectInput = newDiv;
            subjectInput.focus();
            subjectInput.addEventListener("input", (e) => {
                messageContentTagEventListener(e, currentMessageDiv)
            });
            subjectInput.addEventListener("keydown", (e) => {
                addNewContentDiv(e, currentMessageDiv);
            })
            prevContentCountMessageDivArray.push(0);
            prevCompanyNameCountMessageDivArray.push(0);
        }
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

    // useEffect(() => {
    //     let subjectInput = document.getElementById("newTemplateSubjectDiv1");
    //     let contentInput = document.getElementById("newTemplateContentDiv1");

    //     subjectInput!.addEventListener("keydown", (event) => {
    //         addNewSubjectDiv(event, 1);
    //     })
        
    //     subjectInput!.addEventListener("input", (event) => {
    //         subjectTagEventListener(event, 1)
    //     })

    //     contentInput!.addEventListener("keydown", (event) => {
    //         addNewContentDiv(event, 1);
    //     })

    //     contentInput!.addEventListener("input", (event) => {
    //         messageContentTagEventListener(event, 1)
    //     })
    // }, [])


    return  (
        <div className="w-full h-full bg-white select-none">
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
                    <div className="h-[calc(100%-70px)] w-[80%] pt-[20px] overflow-y-scroll flex justify-center items-center">
                        <div className=" rounded-[5px] border-1 border-zinc-300 p-[10px] w-[500px]">
                            <form onSubmit={createNewTemplate}>
                                <input className="h-[50px] w-full text-3xl text-[#121212] font-semibold focus:outline-none" type="text" id="newTemplateName" value={newTemplateName} onChange={(e)=>{setNewTemplateName(e.target.value)}}/>
                                <p className="text-zinc-400">Fill in the details below to create a new template.</p>
                                <br />
                                <p className="text-[#121212] text-sm mb-[10px]">Subject line</p>
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
                                <p className="text-[#121212] text-sm mb-[10px]">Message Content</p>
                                <div className="h-[300px] w-full pl-[10px] pt-[10px] text-zinc-300 border-1 border-zinc-300 rounded-[2.5px] p-[10px] focus:outline-offset-5 text-wrap focus:outline-zinc-400 hover:cursor-text" id="newTemplateContent" contentEditable="false" onClick={() => {
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
                                <div className="w-full flex justify-end items-center">
                                    <input className=" bg-[#121212] p-[10px] rounded-[10px] hover:cursor-pointer self-end" type="submit" value="Create new template"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}