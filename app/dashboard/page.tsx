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
        const selection = window.getSelection();
        if (selection!.rangeCount === 0) {
            return 0;
        }

        const range = selection!.getRangeAt(0);
        const preCursorRange = range.cloneRange();
        preCursorRange.selectNodeContents(d); 
        preCursorRange.setEnd(range.startContainer, range.startOffset); 

        let l = preCursorRange.toString().length;
        return l;
    }

    let prevCompanyNameCountArray = [0];
    let currentDiv = 1;

    function companyNametagEventListener(event: Event, divNo: number) { 
        const prevCompanyNameCount = prevCompanyNameCountArray[divNo-1];
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
        let currentCompanyNameCount = 0;
        let companyNameAtStart: boolean = false
        let companyNameBeforeCursor = 0;
        for(i = 0; i <= (text!.length - "@companyName".length); i++) {
            if (text!.slice(i, i+("@companyName".length)) === "@companyName") {
                const d = createCompanyNameTag();
                subjectInput!.appendChild(d);

                if (i < characterCountDup) {
                    if (i === 0) {
                        characterCount -= "@companyName".length;
                        companyNameAtStart = true;
                    } else  {
                        characterCount -= "@companyName\n".length;
                    }
                    companyNameBeforeCursor += 1;
                }

                if (i === (text!.length - "@companyName".length)) {
                    lastAppended = true;
                    i += ("@companyName".length);
                    
                } else {
                    i += ("@companyName".length) - 1;
                    if (text![i+1] == "\n" && text![i+2] == "\xA0") {
                        i += 2;
                    } else if (text![i+1] === "\n") {
                        i += 1;
                        characterCount += ((i <= characterCountDup) ? 1 : 0);
                    }
                }
                currentCompanyNameCount += 1;
            } else if ((text![i] === " " || text![i] === "\n") && text!.slice(i+1, i+("@companyName".length) + 1) === "@companyName") {
                continue;
            } else {
                subjectInput!.appendChild(document.createTextNode(text![i]));
            }
        }

        if (!lastAppended) {
            subjectInput!.appendChild(document.createTextNode(text!.slice(i)));
        } else {
            subjectInput!.appendChild(document.createTextNode("\xA0"));
        }

        if (prevCompanyNameCount === currentCompanyNameCount) {
            const selection = window.getSelection();
            selection!.removeAllRanges();
            selection!.selectAllChildren(subjectInput!);
            selection!.collapseToStart();
            for(let a = 0; a < (characterCount - companyNameBeforeCursor); a++) {
                selection!.modify("move", "right", "character")
            }
        } else {
            const selection = window.getSelection();
            selection!.removeAllRanges();
            selection!.selectAllChildren(subjectInput!);
            selection!.collapseToStart();
            for(let a = 0; a < (characterCount + (companyNameAtStart ? 2 : 3)); a++) {
                selection!.modify("move", "right", "character")
            }
        }

        prevCompanyNameCountArray[divNo-1] = currentCompanyNameCount;
    }

    function addNewSubjectDiv(event: KeyboardEvent, divNo: number) {
        let subjectInput = document.getElementById(`newTemplateSubjectDiv${divNo}`);
        console.log(event.key)
        console.log(divNo);
        if (event.key === "Enter") {
            event.preventDefault();
            const d = document.getElementById("newTemplateSubject");
            const newDiv = document.createElement("div");
            newDiv.id = `newTemplateSubjectDiv${currentDiv+1}`;
            currentDiv++;
            newDiv.className = "w-max max-w-full h-[24px] flex items-center focus:outline-none text-[#121212]";
            newDiv.contentEditable = "true";
            newDiv.onclick = () => {
                currentDiv = divNo+1;

            }
            d!.appendChild(newDiv);
            subjectInput = newDiv;
            subjectInput.focus();
            subjectInput.addEventListener("input", (e) => {
                companyNametagEventListener(e, currentDiv)
            });
            subjectInput.addEventListener("keydown", (e) => {
                addNewSubjectDiv(e, currentDiv);
            })
            prevCompanyNameCountArray.push(0);
        } else if (event.key === "Backspace" && (subjectInput!.innerText === "" || subjectInput!.innerText === "\n")) {
            event.preventDefault();
            console.log("lmao")
            if (divNo != 1) {
                subjectInput!.removeEventListener("input", (event) => {
                    companyNametagEventListener(event, divNo);
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
                        currentDiv = i;
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
                    currentDiv = i;
                    break;
                }
                i--;
            }
        } else if (event.key === "ArrowDown") {
            let i = divNo+1;
            while (i <= prevCompanyNameCountArray.length) {
                const newSubject = document.getElementById(`newTemplateSubjectDiv${i}`);
                if (newSubject != null) {
                    newSubject!.focus();
                    const selection = window.getSelection();
                    selection!.selectAllChildren(newSubject);
                    selection!.collapseToEnd();
                    currentDiv = i;
                    break;
                }
                i++;
            }
        } else if(subjectInput!.offsetWidth >= 430 && event.key !== "Backspace") {
            //event.preventDefault();
            const d = document.getElementById("newTemplateSubject");
            const newDiv = document.createElement("div");
            newDiv.id = `newTemplateSubjectDiv${currentDiv+1}`;
            currentDiv++;
            newDiv.className = "w-max max-w-full h-[24px] flex items-center focus:outline-none text-[#121212]";
            newDiv.contentEditable = "true";
            newDiv.onclick = () => {
                currentDiv = divNo+1;

            }
            d!.appendChild(newDiv);
            subjectInput = newDiv;
            subjectInput.focus();
            subjectInput.addEventListener("input", (e) => {
                companyNametagEventListener(e, currentDiv)
            });
            subjectInput.addEventListener("keydown", (e) => {
                addNewSubjectDiv(e, currentDiv);
            })
            prevCompanyNameCountArray.push(0);
        }
    }

    let prevContentCountArray = [0];
    let currentContentDiv = 1;

    function generatedTextNameTagEventListener(event: Event, divNo: number) { 
        const prevContentCount = prevContentCountArray[divNo-1];
        const subjectInput = document.getElementById(`newTemplateContentDiv${divNo}`);
        const text = subjectInput!.innerText;
        let characterCount = getCountCharactersBefore(subjectInput!);
        const characterCountDup = characterCount;

        if (characterCount < ("@generatedText".length)) {
            return;
        }

        subjectInput!.innerText = "";

        let lastAppended: boolean = false;
        let i = 0;
        let currentContentCount = 0;
        let contentAtStart: boolean = false
        let contentBeforeCursor = 0;
        for(i = 0; i <= (text!.length - "@generatedText".length); i++) {
            if (text!.slice(i, i+("@generatedText".length)) === "@generatedText") {
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
            } else if ((text![i] === " " || text![i] === "\n") && text!.slice(i+1, i+("@generatedText".length) + 1) === "@generatedText") {
                continue;
            } else {
                subjectInput!.appendChild(document.createTextNode(text![i]));
            }
        }

        if (!lastAppended) {
            subjectInput!.appendChild(document.createTextNode(text!.slice(i)));
        } else {
            subjectInput!.appendChild(document.createTextNode("\xA0"));
        }

        if (prevContentCount === currentContentCount) {
            const selection = window.getSelection();
            selection!.removeAllRanges();
            selection!.selectAllChildren(subjectInput!);
            selection!.collapseToStart();
            for(let a = 0; a < (characterCount - contentBeforeCursor); a++) {
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

        prevContentCountArray[divNo-1] = currentContentCount;
    }

    function addNewContentDiv(event: KeyboardEvent, divNo: number) {
        let subjectInput = document.getElementById(`newTemplateContentDiv${divNo}`);
        console.log(event.key)
        console.log(divNo);
        if (event.key === "Enter") {
            event.preventDefault();
            const d = document.getElementById("newTemplateContent");
            const newDiv = document.createElement("div");
            newDiv.id = `newTemplateContentDiv${currentContentDiv+1}`;
            currentContentDiv++;
            newDiv.className = "w-max max-w-full h-[24px] flex items-center focus:outline-none text-[#121212]";
            newDiv.contentEditable = "true";
            newDiv.onclick = () => {
                currentContentDiv = divNo+1;

            }
            d!.appendChild(newDiv);
            subjectInput = newDiv;
            subjectInput.focus();
            subjectInput.addEventListener("input", (e) => {
                generatedTextNameTagEventListener(e, currentContentDiv)
            });
            subjectInput.addEventListener("keydown", (e) => {
                addNewContentDiv(e, currentContentDiv);
            })
            prevContentCountArray.push(0);
        } else if (event.key === "Backspace" && (subjectInput!.innerText === "" || subjectInput!.innerText === "\n")) {
            event.preventDefault();
            console.log("lmao")
            if (divNo != 1) {
                subjectInput!.removeEventListener("input", (event) => {
                    generatedTextNameTagEventListener(event, divNo);
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
                        currentContentDiv = i;
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
                    currentContentDiv = i;
                    break;
                }
                i--;
            }
        } else if (event.key === "ArrowDown") {
            let i = divNo+1;
            while (i <= prevContentCountArray.length) {
                const newSubject = document.getElementById(`newTemplateContentDiv${i}`);
                if (newSubject != null) {
                    newSubject!.focus();
                    const selection = window.getSelection();
                    selection!.selectAllChildren(newSubject);
                    selection!.collapseToEnd();
                    currentContentDiv = i;
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
            newDiv.id = `newTemplateContentDiv${currentContentDiv+1}`;
            currentContentDiv++;
            newDiv.className = "w-max max-w-full h-[24px] flex items-center focus:outline-none text-[#121212]";
            newDiv.contentEditable = "true";
            newDiv.onclick = () => {
                currentContentDiv = divNo+1;

            }
            d!.appendChild(newDiv);
            subjectInput = newDiv;
            subjectInput.focus();
            subjectInput.addEventListener("input", (e) => {
                generatedTextNameTagEventListener(e, currentContentDiv)
            });
            subjectInput.addEventListener("keydown", (e) => {
                addNewContentDiv(e, currentContentDiv);
            })
            prevContentCountArray.push(0);
        }
    }

    useEffect(() => {
        let subjectInput = document.getElementById("newTemplateSubjectDiv1");
        let contentInput = document.getElementById("newTemplateContentDiv1");

        subjectInput!.addEventListener("keydown", (event) => {
            addNewSubjectDiv(event, 1);
        })
        
        subjectInput!.addEventListener("input", (event) => {
            companyNametagEventListener(event, 1)
        })

        contentInput!.addEventListener("keydown", (event) => {
            addNewContentDiv(event, 1);
        })

        contentInput!.addEventListener("input", (event) => {
            generatedTextNameTagEventListener(event, 1);
        })
    }, [])

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
                                <div id="newTemplateSubject" className="min-h-[40px] w-full border-1 border-zinc-300 p-[10px] pt-0 pb-0 text-zinc-300 rounded-[2.5px] flex flex-col justify-center focus:outline-zinc-400 focus:outline-offset-5 text-wrap" contentEditable="false" onClick={() => {
                                    
                                    if (!subjectActive) {
                                        const d = document.getElementById("newTemplateSubjectDiv1")
                                        d!.innerText = ""
                                        d!.style.color = "#121212";
                                        subjectActive = true;
                                    }

                                }}><div id="newTemplateSubjectDiv1" className="w-max max-w-full flex items-center focus:outline-none" contentEditable="true">Enter the subject of your email</div></div>
                                <br />
                                <p className="text-[#121212] text-sm mb-[10px]">Message Content</p>
                                <div className="h-[300px] w-full pl-[10px] pt-[10px] text-zinc-300 border-1 border-zinc-300 rounded-[2.5px] p-[10px] focus:outline-offset-5 focus:outline-zinc-400" id="newTemplateContent" contentEditable="false" onClick={() => {
                                    if (!contentActive) {
                                        const d = document.getElementById("newTemplateContentDiv1");
                                        d!.innerText = "";
                                        d!.style.color = "#121212";
                                        contentActive = true;
                                    }
                                    
                                }}><div id="newTemplateContentDiv1" className="w-max max-w-full flex items-center focus:outline-none" contentEditable="true">Enter the content of your email</div></div>
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