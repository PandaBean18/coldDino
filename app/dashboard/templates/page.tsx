'use client'
import Image from "next/image"
import { RefObject, useEffect, useRef } from "react";
import { useState } from "react";
import Cookies from "js-cookie"

declare const gapi: any;

declare global {
    interface HTMLElement {
        src: string,
        value: string,
        href: string,
        disabled: string,
        selectionStart: number,
        selectionEnd: number,
    }

    interface Event {
        inputType: string,
        data: string,
        key: string
    }

    interface EventTarget {
        value: string
    }

    interface Window {
        gapi: any;
        google: any;
        pickerCallback: any,
    }
}

interface InvdividualTemplate {
    templateName: string, 
    subject: string,
    message: string,
}

interface InvdividualTemplate {
    templateName: string, 
    subject: string,
    message: string,
}

interface FileObj {
    fileId: string,
    fileName: string,
    mimeType: string,
}

export default function Templates() {

    const [accessToken, setAccessToken] = useState(null);
    const [pickerInited, setPickerInited] = useState(false);
    const [gisInited, setGisInited] = useState(false);
    const [tokenClient, setTokenClient]: Array<any> = useState(null);

    function onApiLoad() {
        if (window.gapi) {
            gapi.load('picker', onPickerApiLoad);
        }
    }

    function onPickerApiLoad() {
        setPickerInited(true);
    }

    async function gisLoaded() {
        const resp = window.google.accounts.oauth2.initTokenClient({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/drive.readonly',
            callback: '',
        });
        setTokenClient(resp);
        setGisInited(true);
    }

    useEffect(() => {
        const loadGooglePickerScript = () => {
            const script = document.createElement('script');
            script.src = "https://apis.google.com/js/api.js";
            script.async = true;
            script.defer = true;
            script.onload = () => {
                onApiLoad()
            };
            document.body.appendChild(script);
        };

        const loadGsiScript = () => {
            const script = document.createElement('script');
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = () => {
                gisLoaded();
            };
            document.body.appendChild(script);
        };

        loadGooglePickerScript();
        loadGsiScript();
    }, []);

    function createPicker() {
        const showPicker = (a: string) => {
            const picker = new window.google.picker.PickerBuilder()
                .addView(window.google.picker.ViewId.DOCS)
                .setOAuthToken(a)
                .setDeveloperKey(process.env.NEXT_PUBLIC_GOOGLE_PICKER_API_KEY)
                .setCallback(pickerCallback)
                .setAppId(process.env.NEXT_PUBLIC_GOOGLE_PROJECT_APP_ID)
                .build();
            picker.setVisible(true);
        }
  
        tokenClient!.callback = async (response: any) => {
            if (response.error !== undefined) {
                throw (response);
            }
            setAccessToken(response.access_token);
            showPicker(response.access_token);
        };
  
        if (accessToken === null) {
            tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            tokenClient.requestAccessToken({prompt: ''});
        }
    }

    function pickerCallback(data: any) {
        let urls: Array<FileObj> = [];

        if (data.action == window.google.picker.Action.PICKED) {
            for(let i = 0; i < data.docs.length; i++) {
                const obj: FileObj = {
                    fileId: data.docs[i].id,
                    fileName: data.docs[i].name,
                    mimeType: data.docs[i].mimeType,
                }
                urls.push(obj);
            }
        }
    }

    let navBarImage: string = "/hamburger.svg"
    let [totalTemplateCount, setTotalTemplateCount] = useState(0);
    const [newTemplateName, setNewTemplateName] = useState(`Template ${totalTemplateCount+1}`)
    let [templates, setTemplates] = useState(Array<InvdividualTemplate>);

    function populateTemplates() {
        try {
          const templateData = Cookies.get("templates");
          if (!templateData) {
            setTotalTemplateCount(0);
            return;
          }
    
          const parsedTemplates = JSON.parse(decodeURIComponent(templateData));
          const templateArray = Object.values(parsedTemplates) as InvdividualTemplate[];
    
          setTemplates(templateArray);
          setTotalTemplateCount(templateArray.length);
          setNewTemplateName(`Template ${templateArray.length + 1}`);
        } catch (error) {
          console.error("Firefox cookie access error:", error);
          setTotalTemplateCount(0);
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
        let [visible, setVisible] = useState(false);
        let [rotated, setRotated] = useState(false);
        let [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
        let addLinkDivShowing = false;
        let cursorPositionBeforeLink;
        let linkCount = 0;
        let [subjectActive, setSubjectActive] = useState(false);
        let [contentActive, setContentActive] = useState(false);
        let applyLinkDiv: HTMLElement;

        function toggleSidebar() {
            const sidebar = document.getElementById("sidebar");
            const img = document.getElementById("navbarImage");
            const content = document.getElementById("sidebarContent")
            if (visible) {
                sidebar!.style.width = "0";
                img!.src = "/hamburger.svg";
                content!.style.display = "none";
                setVisible(false);
            } else {
                sidebar!.style.width = "80%";
                img!.src = "/cross.svg";
                content!.style.display = "flex"
                setVisible(true);
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
                setRotated(false);
            } else {
                img!.style.transform = "rotate(180deg)";
                setRotated(true);
                templateList!.style.height = "max-content";
                templateList!.style.padding = "10px";
            }
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

        function subjectTagListener() {
            const subjectDiv = document.getElementById("newTemplateSubjectContentMobile");
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

        function subjectKeyListener(event: KeyboardEvent) {
            if (event.key === "Enter") {
                //setTimeout(() => {}, 0)
                event.preventDefault();
                const selection = window.getSelection();
                const subjectDiv = document.getElementById("newTemplateSubjectContentMobile");
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

        function messageKeyListener(event: KeyboardEvent) {
            if (event.key === "Enter") {
                event.preventDefault();
                const selection = window.getSelection();
                const subjectDiv = document.getElementById("newTemplateMessageContentMobile");
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
                messageTagListener();
            } else if (event.key === " " || event.key === "," || event.key === ";" || event.key === ".") {
                messageTagListener();
            }
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

        function messageTagListener(urlToAdd: string | null = null) {
            const subjectDiv = document.getElementById("newTemplateMessageContentMobile");
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

        function handleChangeTemplateButton(str: string) {
            const templateName = document.getElementById("newTemplateNameMobile");
            document.getElementById("newTemplateSubjectMobile")?.click();
            document.getElementById("newTemplateContentMobile")?.click();

            const subject = document.getElementById("newTemplateSubjectContentMobile");
            const message = document.getElementById("newTemplateMessageContentMobile");

            if (str === "up") {
                if (currentTemplateIndex === 1) {
                    templateName!.value = "";
                    subject!.innerText = "";
                    message!.innerText = "";
                    setCurrentTemplateIndex(currentTemplateIndex-1);
                } else if (currentTemplateIndex !== 0) {
                    templateName!.value = templates[currentTemplateIndex-2]["templateName"];
                    subject!.innerText = templates[currentTemplateIndex-2]["subject"];
                    message!.innerText = templates[currentTemplateIndex-2]["message"];

                    messageTagListener();
                    subjectTagListener();
                    setCurrentTemplateIndex(currentTemplateIndex-1);
                }
            } else if (str === "down") {
                setSubjectActive(true);
                setContentActive(true);
                if (currentTemplateIndex < templates.length) {
                    console.log(templateName!.value)
                    subject!.innerHTML = templates[currentTemplateIndex]["subject"];
                    message!.innerText = templates[currentTemplateIndex]["message"];

                    messageTagListener();
                    subjectTagListener();
                    setCurrentTemplateIndex(currentTemplateIndex+1);
                    templateName!.value = templates[currentTemplateIndex]["templateName"];
                }
            }
        }

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

        function calculateApplyLinkDivPos(divHeight: number = 200, divWidth : number = 200) {
            const selection = window.getSelection();
            const range = selection!.getRangeAt(0).cloneRange();
            range.collapse(false);

            const e = document.createElement("span");
            range.insertNode(e);

            const rect = e.getBoundingClientRect();
            e.parentNode!.removeChild(e);

            const d = document.getElementById("newTemplateMessageContentMobile");
            const controlRect = d!.getBoundingClientRect();
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

        function getSelectedText(): string | null {
            const selection = window.getSelection();

            if (selection!.rangeCount === 0) {
                window.alert("Please select the text that you want to add link to.");
                return null;
            }

            return selection!.toString();
        }

        // function toggleAddlink() {
        //     const parentDiv = document.getElementById("newTemplateFormMobile")
        //     const messageDiv = document.getElementById("newTemplateMessageContentMobile")
            
        //     if (!addLinkDivShowing) {
        //         const [calculatedX, calculatedY] = calculateApplyLinkDivPos();
        //         applyLinkDiv = createApplyLinkDiv(calculatedX, calculatedY);
        //         linkCount += 1;
        //         parentDiv!.appendChild(applyLinkDiv)
                
        //         const displayText = getSelectedText();
        //         if (displayText === null) {
        //             addLinkDivShowing = false;
        //         } else {
        //             cursorPositionBeforeLink = getCountCharactersBefore(messageDiv!);
        //             const d = document.getElementById("applyLinkDisplayText");
        //             d!.value = displayText;
        //             d!.disabled = "true";
        //             const messageContent = messageDiv!.innerText;
        //             messageDiv!.innerHTML = ""
        //             for (let i = 0; i < messageContent!.length; i++) {
        //                 if (i === (cursorPositionBeforeLink - displayText.length)) {
                            
        //                     const ele = document.createElement("span");
        //                     ele.style.display = "inline-flex";
        //                     ele.style.width = "0";
        //                     ele.style.height = "0";
        //                     ele.style.overflow = "hidden";
        //                     ele.contentEditable = "false";
        //                     ele.innerHTML = `!!LINK!![${""},${displayText},${linkCount}]`;
        //                     messageDiv!.appendChild(ele);
        //                 }
        //                 messageDiv!.innerHTML += messageContent[i];
        //             }
        //             messageTagListener();
        //             document.getElementById("applyLinkGoToText")!.focus();
        //         }
        //     } else {
        //         parentDiv!.removeChild(applyLinkDiv);
        //         addLinkDivShowing = false;
        //     }
            
        // }

        function createNewTemplate(event: Event): boolean {
            event.preventDefault();
            const templateName = document.getElementById("newTemplateNameMobile");
            const subjectDiv = document.getElementById("subjectDivHiddenInputMobile");
            const contentDiv = document.getElementById("messageDivHiddenInputMobile");
            const linksMetadata = linksRef.current;
            const s: string | undefined = Cookies.get("templates");

            const obj = {
                templateName: templateName?.value || "",
                subject: subjectDiv?.value || "",
                message: contentDiv?.value || "", 
                linksMetadata: linksMetadata
            }

            if (s === undefined) {
                const t = {
                    0: obj
                }
        
                Cookies.set("templates", `${JSON.stringify(t)}`, {expires: 1000});
                window.location.href = "/dashboard/generate";
            } else {
                let t = JSON.parse(decodeURIComponent(s));
                let i = 0;

                for(const templateId in t) {
                    i = Number(templateId);
                }

                t[i+1] = obj;
                Cookies.set("templates", `${JSON.stringify(t)}`, {expires: 1000});
                window.location.href = "/dashboard/generate";
            }

            return false;
        }

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

        let linksRef = useRef<Record<number, {displayText: string, href: string}>>({});

        function toggleAddlink() {
            const visibleInput= document.getElementById("messageDivVisibleInputMobile"); 
            const parent = document.getElementById("newTemplateContentMobile");
            if (!addLinkDivShowing){
                const hiddenInput = document.getElementById('messageDivHiddenInputMobile');
                const count = hiddenInput!.selectionStart;
                const e = hiddenInput!.selectionEnd;
                const text = hiddenInput!.value.slice(count, e);

                if (text === null) {
                    alert("Please select the text to add link to.");
                    return;
                }

                const applyLinkDiv = createApplyLinkDiv(10, 10, count, text, parent!);
                parent!.appendChild(applyLinkDiv);
            }
        }

        function createApplyLinkDiv(x: number, y: number, offset: number, displayText: string, parentNode: HTMLElement) {
            const e = document.createElement("div");
            const inputEle1 = document.createElement("input");
            inputEle1.type = "text";
            inputEle1.id = "applyLinkDisplayText"
            inputEle1.className = "border-1 border-zinc-300 h-[40px] w-[180px] p-[10px] rounded-[2.5px] focus:outline-1 text-zinc-500";
            inputEle1.placeholder = "Display Text";
            inputEle1.disabled = true;
            inputEle1.value = displayText;

            const inputEle2 = document.createElement("input");
            inputEle2.type = "text";
            inputEle2.className = "border-1 border-zinc-300 h-[40px] w-[180px] p-[10px] rounded-[2.5px] focus:outline-1 text-zinc-500";
            inputEle2.placeholder = "Go To Link";
            inputEle2.id = "applyLinkGoToText";
            inputEle2.oninput = (event) => {
                if (event.target!.value !== '') {
                    document.getElementById('applyLinkButton')!.style.backgroundColor = '#121212';
                    document.getElementById('applyLinkButton')!.removeAttribute('disabled');  
                } else {
                    document.getElementById('applyLinkButton')!.style.backgroundColor = 'oklch(44.2% .017 285.786)';
                    document.getElementById('applyLinkButton')!.disabled = 'true';
                }
            }

            const inputButton = document.createElement("input");
            inputButton.type = "button";
            inputButton.className = "border-1 border-zinc-600 h-[40px] w-[80%] bg-zinc-500 text-white rounded-[2.5px] hover:cursor-pointer"
            inputButton.value = "Apply Link"
            inputButton.id = "applyLinkButton";
            inputButton.disabled = true;
            inputButton.onclick = ()=>{
                const e1 = document.getElementById('applyLinkDisplayText');
                const e2 = document.getElementById('applyLinkGoToText');

                linksRef.current[offset] = {
                    displayText: e1!.value,
                    href: e2!.value,
                }

                formatDiv(document.getElementById('messageDivVisibleInput')!);
                parentNode.removeChild(document.getElementById('applyLinkDiv')!);
            };

            const t = `absolute bg-white h-[200px] w-[200px] rounded-[5px] shadow-[0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)] p-[10px] flex flex-col items-center justify-evenly z-1001`;
            e.className = t;
            e.style.top = `${y}px`;
            e.style.left  = `${x}px`;
            e.id = 'applyLinkDiv';
            e.appendChild(inputEle1);
            e.appendChild(inputEle2);
            e.appendChild(inputButton);
            return e;
        }

        function handleMessageInputChange() {            
            const visibleInput= document.getElementById("messageDivVisibleInputMobile");
            const hiddenInput = document.getElementById('messageDivHiddenInputMobile');
            
            visibleInput!.innerText = hiddenInput!.value
            .replaceAll(/ {2,}/g, (match) => {
                return '\u00A0'.repeat(match.length - 1) + ' ';
            });
            
            formatDiv(visibleInput!);
        }

        function formatDiv(ele: HTMLElement, isSubjectDiv: boolean = false) {
            let text
            
            if (isSubjectDiv) {
                text = document.getElementById('subjectDivHiddenInputMobile')!.value
                .replaceAll(/ {2,}/g, (match) => {
                    return '\u00A0'.repeat(match.length - 1) + ' ';
                });
            } else {
                text = document.getElementById('messageDivHiddenInputMobile')!.value
                .replaceAll(/ {2,}/g, (match) => {
                    return '\u00A0'.repeat(match.length - 1) + ' ';
                });
            }

            ele.innerHTML = "";

            let currentWord = '';
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                
                if (linksRef.current[i] !== undefined && !isSubjectDiv) {
                    console.log(linksRef);
                    ele.innerHTML += currentWord;
                    const e = document.createElement('a');
                    e.className = "text-blue-500 underline"
                    e.innerText = linksRef.current[i].displayText;
                    e.href = linksRef.current[i].href;
                    ele.appendChild(e);
                    i += linksRef.current[i].displayText.length-1;
                    currentWord = '';
                } else if (char === '\n' ||char === '.' || char === '\u00A0' || char === ' ' || char === ',' || char === ';' || (i === text.length-1)) {
                    if (currentWord === '@companyName') {
                        const e = createCompanyNameSpan();
                        ele.appendChild(e);
                    } else if (currentWord === '@generatedText') {
                        const e = createGeneratedTextNameSpan();
                        ele.appendChild(e);
                    } else {
                        ele.innerHTML += currentWord;
                    }
                    
                    if (char === '\n' && (i === text.length-1)) {
                        const e = document.createElement('br');
                        ele.appendChild(e);
                    }
                    
                    ele.innerHTML += char; 
                    currentWord = '';
                } else {
                    currentWord += char;
                }

            }

        }

        function handleSubjectInput(event: React.KeyboardEvent<HTMLTextAreaElement>) {
            if (event.key === 'Insert' || event.key === 'Delete') {
                event.preventDefault();
                return;
            }

            const ele = document.getElementById('subjectDivHiddenInputMobile');
            const visibleInput= document.getElementById("subjectDivVisibleInputMobile");
            const ignoredKeys = new Set([
                'Shift',
                'Control',
                'Alt',
                'Meta',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Tab',
                'CapsLock',
                'Escape',
                'Home',
                'End',
                'PageUp',
                'PageDown',
                'NumLock',
                'ScrollLock',
                'Pause',
                'ContextMenu',
                'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
              ]);
            
            if (event.key === "Backspace") {
                const selStart = ele!.selectionStart;
                const selEnd = ele!.selectionEnd;

                let lenSelText = selEnd - selStart;
                const newLinks: Record<number, {displayText: string, href: string}> = {};

                if (selStart === 0) {
                    for(let [c, linkObj] of Object.entries(linksRef.current)) {
                        if (Number(c) >= selEnd-1) {
                            newLinks[Number(c)-(lenSelText)] = linkObj;
                        }
                    }
                    linksRef.current = newLinks;
                    formatDiv(visibleInput!, true);
                    return;
                }

                if (lenSelText === 0) {
                    lenSelText++;
                }

                for(let [c, linkObj] of Object.entries(linksRef.current)) {
                    if (Number(c) > selEnd-1) {
                        newLinks[Number(c)-(lenSelText)] = linkObj;
                    } else if (Number(c) < selEnd && (Number(c)+linkObj.displayText.length) > selEnd) {
                        if (lenSelText >= linkObj.displayText.length) {
                            continue;
                        } else {
                            let newDisplayText = '';

                            for(let i = 0; i < linkObj.displayText.length; i++){
                                if (i >= (selStart-1-Number(c)) && i <= (selEnd-1-Number(c))) {
                                    continue;
                                } else {
                                    newDisplayText += linkObj.displayText[i];
                                }
                            }

                            const newLinkObj = {
                                displayText: newDisplayText,
                                href: linkObj.href,
                            }

                            newLinks[Number(c)] = newLinkObj;
                        }
                    } else if (selStart === Number(c)+linkObj.displayText.length && selStart === selEnd) {
                        continue;
                    } else {
                        newLinks[Number(c)] = linkObj;
                    }
                }

                linksRef.current = newLinks;
                formatDiv(visibleInput!, true);
            } else if (!ignoredKeys.has(event.key)) {
                const selStart = ele!.selectionStart;
                const selEnd = ele!.selectionEnd;

                let lenSelText = selEnd - selStart;

                if (lenSelText === 0) {
                    lenSelText++;
                }

                const newLinks: Record<number, {displayText: string, href: string}> = {};
                for(let [c, linkObj] of Object.entries(linksRef.current)) {
                    if (Number(c) >= selEnd-1) {
                        if (lenSelText === 1) {
                            newLinks[Number(c)+1] = linkObj;
                        } else {
                            newLinks[Number(c)+1-lenSelText] = linkObj;
                        }   
                        
                    } else {
                        newLinks[Number(c)] = linkObj;
                    }
                }
                linksRef.current = newLinks;
            }
            
            
        }

        function handleSubjectInputChange() {           
            const visibleInput= document.getElementById("subjectDivVisibleInputMobile");
            const hiddenInput = document.getElementById('subjectDivHiddenInputMobile');
            
            visibleInput!.innerText = hiddenInput!.value
            .replaceAll(/ {2,}/g, (match) => {
                return '\u00A0'.repeat(match.length - 1) + ' ';
            });
            
            formatDiv(visibleInput!, true);
        }

        function handleMessageInput(event: React.KeyboardEvent<HTMLTextAreaElement>) {
            if (event.key === 'Insert' || event.key === 'Delete') {
                event.preventDefault();
                return;
            }

            const ele = document.getElementById('messageDivHiddenInputMobile');
            const visibleInput= document.getElementById("messageDivVisibleInputMobile");
            const ignoredKeys = new Set([
                'Shift',
                'Control',
                'Alt',
                'Meta',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Tab',
                'CapsLock',
                'Escape',
                'Home',
                'End',
                'PageUp',
                'PageDown',
                'NumLock',
                'ScrollLock',
                'Pause',
                'ContextMenu',
                'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
              ]);
            
            if (event.key === "Backspace") {
                const selStart = ele!.selectionStart;
                const selEnd = ele!.selectionEnd;

                let lenSelText = selEnd - selStart;
                const newLinks: Record<number, {displayText: string, href: string}> = {};

                if (selStart === 0) {
                    for(let [c, linkObj] of Object.entries(linksRef.current)) {
                        if (Number(c) >= selEnd-1) {
                            newLinks[Number(c)-(lenSelText)] = linkObj;
                        }
                    }
                    linksRef.current = newLinks;
                    formatDiv(visibleInput!);
                    return;
                }

                if (lenSelText === 0) {
                    lenSelText++;
                }

                for(let [c, linkObj] of Object.entries(linksRef.current)) {
                    if (Number(c) > selEnd-1) {
                        newLinks[Number(c)-(lenSelText)] = linkObj;
                    } else if (Number(c) < selEnd && (Number(c)+linkObj.displayText.length) > selEnd) {
                        if (lenSelText >= linkObj.displayText.length) {
                            continue;
                        } else {
                            let newDisplayText = '';

                            for(let i = 0; i < linkObj.displayText.length; i++){
                                if (i >= (selStart-1-Number(c)) && i <= (selEnd-1-Number(c))) {
                                    continue;
                                } else {
                                    newDisplayText += linkObj.displayText[i];
                                }
                            }

                            const newLinkObj = {
                                displayText: newDisplayText,
                                href: linkObj.href,
                            }

                            newLinks[Number(c)] = newLinkObj;
                        }
                    } else if (selStart === Number(c)+linkObj.displayText.length && selStart === selEnd) {
                        continue;
                    } else {
                        newLinks[Number(c)] = linkObj;
                    }
                }

                linksRef.current = newLinks;
                formatDiv(visibleInput!);
            } else if (!ignoredKeys.has(event.key)) {
                const selStart = ele!.selectionStart;
                const selEnd = ele!.selectionEnd;

                let lenSelText = selEnd - selStart;

                if (lenSelText === 0) {
                    lenSelText++;
                }

                const newLinks: Record<number, {displayText: string, href: string}> = {};
                for(let [c, linkObj] of Object.entries(linksRef.current)) {
                    if (Number(c) >= selEnd-1) {
                        if (lenSelText === 1) {
                            newLinks[Number(c)+1] = linkObj;
                        } else {
                            newLinks[Number(c)+1-lenSelText] = linkObj;
                        }   
                        
                    } else {
                        newLinks[Number(c)] = linkObj;
                    }
                }
                linksRef.current = newLinks;
            }
            
            
        }

        useEffect(()=>{
            const form = document.getElementById("newTemplateFormMobile");
            form!.addEventListener("submit", (event)=>{
                createNewTemplate(event);
            });

            document.addEventListener('mousedown', (event) => {
                const applyLinkDiv = document.getElementById('applyLinkDiv');
                const parent = document.getElementById('newTemplateContentMobile')
                if (applyLinkDiv !== null && !applyLinkDiv.contains(event.target as Node)) {
                    parent!.removeChild(applyLinkDiv);
                }
            })

            const messageDivHiddenInput = document.getElementById('messageDivHiddenInputMobile');
            const messageDivVisibleInput = document.getElementById('messageDivVisibleInputMobile');
            messageDivHiddenInput!.addEventListener('scroll', () => {
                messageDivVisibleInput!.scrollTop = messageDivHiddenInput!.scrollTop;

                if (messageDivHiddenInput!.scrollTop > messageDivHiddenInput!.scrollHeight - messageDivHiddenInput!.clientHeight) {
                    messageDivHiddenInput!.scrollTop = messageDivHiddenInput!.scrollHeight - messageDivHiddenInput!.clientHeight;
                    messageDivVisibleInput!.scrollTop = messageDivVisibleInput!.scrollHeight - messageDivVisibleInput!.clientHeight;
                  }
            });

            messageDivHiddenInput!.addEventListener('input', () => {
                messageDivHiddenInput!.scrollTop = messageDivHiddenInput!.scrollHeight;
                messageDivVisibleInput!.scrollTop = messageDivVisibleInput!.scrollHeight;
            });

            const subjectDivHiddenInput = document.getElementById('subjectDivHiddenInputMobile');
            const subjectDivVisibleInput = document.getElementById('subjectDivVisibleInputMobile');
            subjectDivHiddenInput!.addEventListener('scroll', () => {
                subjectDivVisibleInput!.scrollTop = subjectDivHiddenInput!.scrollTop;

                if (subjectDivHiddenInput!.scrollTop > subjectDivHiddenInput!.scrollHeight - subjectDivHiddenInput!.clientHeight) {
                    subjectDivHiddenInput!.scrollTop = subjectDivHiddenInput!.scrollHeight - subjectDivHiddenInput!.clientHeight;
                    subjectDivVisibleInput!.scrollTop = subjectDivVisibleInput!.scrollHeight - subjectDivVisibleInput!.clientHeight;
                  }
            });

            subjectDivHiddenInput!.addEventListener('input', () => {
                subjectDivHiddenInput!.scrollTop = subjectDivHiddenInput!.scrollHeight;
                subjectDivVisibleInput!.scrollTop =subjectDivVisibleInput!.scrollHeight;
            });

        }, [])

        return (
            <div className="w-full h-full">
                {/* navbar */}
                <div className="w-full h-[60px] bg-white flex items-center p-[10px] border-b-1 border-slate-200">
                    <div className="w-full h-[60px] z-0 flex justify-center items-center absolute top-0 left-0">
                        <p className="text-[#121212] text-2xl font-bold ml-[10px]">New Template</p>
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
                                alt="ai"
                            />
                            <p className="text-[#121212] text-xl font-normal ml-[10px]">Homepage</p>
                        </div>
                    </div>
                    <div className="h-[50px] w-[90%] flex justify-between items-center rounded-[5px] hover:cursor-pointer">
                        <div className="flex items-center">
                            <Image
                                src="/mail_draft.svg"
                                height={25}
                                width={25}
                                alt="ai"
                            />
                            <p className="text-[#121212] text-xl font-normal ml-[10px]">Email Templates</p>
                        </div>
                    </div>
                    <div className="h-[50px] w-[90%] flex justify-between items-center rounded-[5px] hover:cursor-pointer" onClick={()=>{window.location.href = "/dashboard/generate"}}>
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
                {/* Main content */}
                <div className="w-full h-max bg-white">
                    <div className="w-full p-[20px]">
                        <ul className="list-disc text-[#121212]">
                            <li><p className="text-xl"><span className="text-cyan-700">@companyName</span>: Placeholder for the company name.</p></li>
                            <li><p className="text-xl"><span className="text-green-700">@generatedText</span>: Placeholder for the generated text.</p></li>
                        </ul>
                    </div>
                

                {/* New template */}
                    {/* <input className="h-[70px] w-full text-3xl text-[#121212] font-semibold border-zinc-200 border-0 border-b-1 focus:outline-none focus:border-zinc-500" type="text" id="newTemplateName" value={`Template ${totalTemplateCount+1}`}/> */}
                    <div className="flex h-max w-full overflow-hidden p-[10px] flex flex-col items-center justify-center">
                        <div className="h-full pt-[20px] flex justify-center items-center">
                            <div className="flex flex-col justify-center items-center">
                                <div className="rounded-[5px] border-1 border-zinc-300 p-[10px] w-full flex flex-col flex-center items-center">
                                    <form className="w-full" id="newTemplateFormMobile">
                                        <input className="h-[50px] w-full text-3xl text-[#121212] font-semibold focus:outline-none" type="text" id="newTemplateNameMobile" value={currentTemplateIndex === 0 ? newTemplateName : templates[currentTemplateIndex-1]["templateName"]} onChange={(e)=>{setNewTemplateName(e.target.value)}} autoComplete="off"/>
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
                                        <div id="newTemplateSubjectMobile" className="min-h-[40px] w-full border-1 border-zinc-300 p-[10px] pt-0 pb-0 text-zinc-300 rounded-[2.5px] flex flex-col justify-center focus:outline-zinc-400 focus:outline-offset-5 text-wrap hover:cursor-text relative">
                                            <p className="absolute overflow-y-scroll text-black w-full h-full z-[999] top-0 left-0 p-[10px] break-words whitespace-wrap whitespace-pre-line" id='subjectDivVisibleInputMobile'></p>
                                            <textarea className="absolute text-transparent caret-black bg-transparent w-full h-full z-1000 top-0 left-0 p-[10px] text-wrap whitespace-normal break-words resize-none placeholder-zinc-300 overscroll-y-none" contentEditable={true} onKeyDown={handleSubjectInput} onChange={handleSubjectInputChange} id='subjectDivHiddenInputMobile' placeholder="Enter the subject of your mail"></textarea>
                                        </div>
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
                                        <div className="h-[300px] w-full pl-[10px] pt-[10px] text-zinc-300 border-1 border-zinc-300 overflow-y-scroll rounded-[2.5px] p-[10px] focus:outline-offset-5 text-wrap focus:outline-zinc-400 relative" id="newTemplateContentMobile">
                                            <p className="absolute text-black w-full h-full z-[999] top-0 left-0 p-[10px] overflow-y-scroll break-words whitespace-wrap whitespace-pre-line" id='messageDivVisibleInputMobile'></p>
                                            <textarea className="absolute text-transparent caret-black bg-transparent w-full h-full z-1000 top-0 left-0 p-[10px] text-wrap overflow-y-scroll whitespace-normal break-words resize-none placeholder-zinc-300 overscroll-y-none" contentEditable={true} onKeyDown={handleMessageInput} onChange={handleMessageInputChange} id='messageDivHiddenInputMobile' placeholder="Enter the content of your mail"></textarea>
                                        </div>
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
                                            <input className=" bg-[#121212] p-[10px] rounded-[10px] hover:cursor-pointer self-end" type="submit" value={currentTemplateIndex === 0 ? "Create new template" : "Update Template"}/>
                                        </div>
                                    </form>
                                    
                                </div>
                                <div className="w-full flex justify-around items-center">
                                    <div className="h-[50px] w-[70px] pr-[20px]">
                                        <Image 
                                            src="/down.svg"
                                            height={50}
                                            width={50}
                                            alt="up"
                                            className="transform-[rotate(90deg)] hover:cursor-pointer"
                                            onClick={()=>{handleChangeTemplateButton("up")}}
                                        />
                                    </div>
                                    <p className="text-[#121212] text-xl" style={{fontFamily: "Bebas Neue"}}>{currentTemplateIndex+1} / {totalTemplateCount+1}</p>
                                    <div className="h-[50px] w-[70px] pl-[20px]">
                                        <Image
                                            src="/down.svg"
                                            height={50}
                                            width={50}
                                            alt="down"
                                            className="transform-[rotate(-90deg)] hover:cursor-pointer"
                                            onClick={()=>{handleChangeTemplateButton("down")}}
                                        />
                                    </div>
                                </div>
                                <br />
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function desktopView() {
        let [visible, setVisible] = useState(false);
        let [rotated, setRotated] = useState(false);
        let [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
        let addLinkDivShowing = false;
        let cursorPositionBeforeLink;
        let linkCount = 0;
        let [subjectActive, setSubjectActive] = useState(false);
        let [contentActive, setContentActive] = useState(false);
        let applyLinkDiv: HTMLElement;

        function toggleSidebar() {
            const sidebar = document.getElementById("sidebar");
            const img = document.getElementById("navbarImage");
            const content = document.getElementById("sidebarContent")
            if (visible) {
                sidebar!.style.width = "0";
                img!.src = "/hamburger.svg";
                content!.style.display = "none";
                setVisible(false);
            } else {
                sidebar!.style.width = "80%";
                img!.src = "/cross.svg";
                content!.style.display = "flex"
                setVisible(true);
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
                setRotated(false);
            } else {
                img!.style.transform = "rotate(180deg)";
                setRotated(true);
                templateList!.style.height = "max-content";
                templateList!.style.padding = "10px";
            }
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

        function subjectTagListener() {
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
                messageTagListener();
            } else if (event.key === " " || event.key === "," || event.key === ";" || event.key === ".") {
                messageTagListener();
            }
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

        function handleChangeTemplateButton(str: string) {
            const templateName = document.getElementById("newTemplateName");
            document.getElementById("newTemplateSubject")?.click();
            document.getElementById("newTemplateContent")?.click();

            const subject = document.getElementById("newTemplateSubjectContent");
            const message = document.getElementById("newTemplateMessageContent");

            if (str === "up") {
                if (currentTemplateIndex === 1) {
                    templateName!.value = "";
                    subject!.innerText = "";
                    message!.innerText = "";
                    setCurrentTemplateIndex(currentTemplateIndex-1);
                } else if (currentTemplateIndex !== 0) {
                    templateName!.value = templates[currentTemplateIndex-2]["templateName"];
                    subject!.innerText = templates[currentTemplateIndex-2]["subject"];
                    message!.innerText = templates[currentTemplateIndex-2]["message"];

                    messageTagListener();
                    subjectTagListener();
                    setCurrentTemplateIndex(currentTemplateIndex-1);
                }
            } else if (str === "down") {
                setSubjectActive(true);
                setContentActive(true);
                if (currentTemplateIndex < templates.length) {
                    console.log(templateName!.value)
                    subject!.innerHTML = templates[currentTemplateIndex]["subject"];
                    message!.innerText = templates[currentTemplateIndex]["message"];

                    messageTagListener();
                    subjectTagListener();
                    setCurrentTemplateIndex(currentTemplateIndex+1);
                    templateName!.value = templates[currentTemplateIndex]["templateName"];
                }
            }
        }

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
            messageTagListener(url);
            const parentDiv = document.getElementById("newTemplateForm");
            //parentDiv!.removeChild(applyLinkDiv);
            addLinkDivShowing = false;
        }

        function createApplyLinkDiv(x: number, y: number, offset: number, displayText: string, parentNode: HTMLElement) {
            const e = document.createElement("div");
            const inputEle1 = document.createElement("input");
            inputEle1.type = "text";
            inputEle1.id = "applyLinkDisplayText"
            inputEle1.className = "border-1 border-zinc-300 h-[40px] w-[180px] p-[10px] rounded-[2.5px] focus:outline-1 text-zinc-500";
            inputEle1.placeholder = "Display Text";
            inputEle1.disabled = true;
            inputEle1.value = displayText;

            const inputEle2 = document.createElement("input");
            inputEle2.type = "text";
            inputEle2.className = "border-1 border-zinc-300 h-[40px] w-[180px] p-[10px] rounded-[2.5px] focus:outline-1 text-zinc-500";
            inputEle2.placeholder = "Go To Link";
            inputEle2.id = "applyLinkGoToText";
            inputEle2.oninput = (event) => {
                if (event.target!.value !== '') {
                    document.getElementById('applyLinkButton')!.style.backgroundColor = '#121212';
                    document.getElementById('applyLinkButton')!.removeAttribute('disabled');  
                } else {
                    document.getElementById('applyLinkButton')!.style.backgroundColor = 'oklch(44.2% .017 285.786)';
                    document.getElementById('applyLinkButton')!.disabled = 'true';
                }
            }

            const inputButton = document.createElement("input");
            inputButton.type = "button";
            inputButton.className = "border-1 border-zinc-600 h-[40px] w-[80%] bg-zinc-500 text-white rounded-[2.5px] hover:cursor-pointer"
            inputButton.value = "Apply Link"
            inputButton.id = "applyLinkButton";
            inputButton.disabled = true;
            inputButton.onclick = ()=>{
                const e1 = document.getElementById('applyLinkDisplayText');
                const e2 = document.getElementById('applyLinkGoToText');

                linksRef.current[offset] = {
                    displayText: e1!.value,
                    href: e2!.value,
                }

                formatDiv(document.getElementById('messageDivVisibleInput')!);
                parentNode.removeChild(document.getElementById('applyLinkDiv')!);
            };
    
            const t = `absolute bg-white h-[200px] w-[200px] rounded-[5px] shadow-[0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)] p-[10px] flex flex-col items-center justify-evenly z-1001`;
            e.className = t;
            e.style.top = `${y}px`;
            e.style.left  = `${x}px`;
            e.id = 'applyLinkDiv';
            e.appendChild(inputEle1);
            e.appendChild(inputEle2);
            e.appendChild(inputButton);
            return e;
        }

        function calculateApplyLinkDivPos(divHeight: number = 200, divWidth : number = 200) {
            const selection = window.getSelection();
            const range = selection!.getRangeAt(0).cloneRange();
            range.collapse(false);

            const e = document.createElement("span");
            range.insertNode(e);

            const rect = e.getBoundingClientRect();
            e.parentNode!.removeChild(e);

            const d = document.getElementById("newTemplateMessageContent");
            const controlRect = d!.getBoundingClientRect();
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

        function getSelectedText(): string | null {
            const selection = window.getSelection();

            if (selection!.rangeCount === 0) {
                window.alert("Please select the text that you want to add link to.");
                return null;
            }

            return selection!.toString();
        }

        // function toggleAddlink() {
        //     const parentDiv = document.getElementById("newTemplateForm")
        //     const messageDiv = document.getElementById("messageDivVisibleInput")
            
        //     if (!addLinkDivShowing) {
        //         const [calculatedX, calculatedY] = calculateApplyLinkDivPos();
        //         applyLinkDiv = createApplyLinkDiv(calculatedX, calculatedY);
        //         linkCount += 1;
        //         parentDiv!.appendChild(applyLinkDiv)
                
        //         const displayText = getSelectedText();
        //         if (displayText === null) {
        //             addLinkDivShowing = false;
        //         } else {
        //             cursorPositionBeforeLink = getCountCharactersBefore(messageDiv!);
        //             const d = document.getElementById("applyLinkDisplayText");
        //             d!.value = displayText;
        //             d!.disabled = "true";
        //             const messageContent = messageDiv!.innerText;
        //             messageDiv!.innerHTML = ""
        //             for (let i = 0; i < messageContent!.length; i++) {
        //                 if (i === (cursorPositionBeforeLink - displayText.length)) {
                            
        //                     const ele = document.createElement("a");
        //                     ele.style.display = "inline-flex";
        //                     ele.style.width = "0";
        //                     ele.style.height = "0";
        //                     ele.style.overflow = "hidden";
        //                     ele.contentEditable = "false";
        //                     ele.innerHTML = `!!LINK!![${""},${displayText},${linkCount}]`;
        //                     messageDiv!.appendChild(ele);
        //                 }
        //                 messageDiv!.innerHTML += messageContent[i];
        //             }
        //             formatDiv(messageDiv!);
        //             document.getElementById("applyLinkGoToText")!.focus();
        //         }
        //     } else {
        //         parentDiv!.removeChild(applyLinkDiv);
        //         addLinkDivShowing = false;
        //     }
            
        // }

        function createNewTemplate(event: Event): boolean {
            event.preventDefault();
            const templateName = document.getElementById("newTemplateName");
            const subjectDiv = document.getElementById("subjectDivHiddenInput");
            const contentDiv = document.getElementById("messageDivHiddenInput");
            const linksMetadata = linksRef.current;
            const s: string | undefined = Cookies.get("templates");

            const obj = {
                templateName: templateName?.value || "",
                subject: subjectDiv?.value || "",
                message: contentDiv?.value || "", 
                linksMetadata: linksMetadata,
            }

            if (s === undefined) {
                const t = {
                    0: obj
                }
        
                Cookies.set("templates", `${JSON.stringify(t)}`, {expires: 1000});
                window.location.href = "/dashboard/generate";
            } else {
                let t = JSON.parse(decodeURIComponent(s));
                let i = 0;

                for(const templateId in t) {
                    i = Number(templateId);
                }

                t[i+1] = obj;
                Cookies.set("templates", `${JSON.stringify(t)}`, {expires: 1000});
                window.location.href = "/dashboard/generate";
            }

            return false;
        }

        useEffect(()=>{
            const form = document.getElementById("newTemplateForm");
            form!.addEventListener("submit", (event)=>{
                createNewTemplate(event);
            })
            
            document.addEventListener('mousedown', (event) => {
                const applyLinkDiv = document.getElementById('applyLinkDiv');
                const parent = document.getElementById('newTemplateContent')
                if (applyLinkDiv !== null && !applyLinkDiv.contains(event.target as Node)) {
                    parent!.removeChild(applyLinkDiv);
                }
            })

            const messageDivHiddenInput = document.getElementById('messageDivHiddenInput');
            const messageDivVisibleInput = document.getElementById('messageDivVisibleInput');
            messageDivHiddenInput!.addEventListener('scroll', () => {
                messageDivVisibleInput!.scrollTop = messageDivHiddenInput!.scrollTop;

                if (messageDivHiddenInput!.scrollTop > messageDivHiddenInput!.scrollHeight - messageDivHiddenInput!.clientHeight) {
                    messageDivHiddenInput!.scrollTop = messageDivHiddenInput!.scrollHeight - messageDivHiddenInput!.clientHeight;
                    messageDivVisibleInput!.scrollTop = messageDivVisibleInput!.scrollHeight - messageDivVisibleInput!.clientHeight;
                  }
            });

            messageDivHiddenInput!.addEventListener('input', () => {
                messageDivHiddenInput!.scrollTop = messageDivHiddenInput!.scrollHeight;
                messageDivVisibleInput!.scrollTop = messageDivVisibleInput!.scrollHeight;
            });

            const subjectDivHiddenInput = document.getElementById('subjectDivHiddenInput');
            const subjectDivVisibleInput = document.getElementById('subjectDivVisibleInput');
            subjectDivHiddenInput!.addEventListener('scroll', () => {
                subjectDivVisibleInput!.scrollTop = subjectDivHiddenInput!.scrollTop;

                if (subjectDivHiddenInput!.scrollTop > subjectDivHiddenInput!.scrollHeight - subjectDivHiddenInput!.clientHeight) {
                    subjectDivHiddenInput!.scrollTop = subjectDivHiddenInput!.scrollHeight - subjectDivHiddenInput!.clientHeight;
                    subjectDivVisibleInput!.scrollTop = subjectDivVisibleInput!.scrollHeight - subjectDivVisibleInput!.clientHeight;
                  }
            });

            subjectDivHiddenInput!.addEventListener('input', () => {
                subjectDivHiddenInput!.scrollTop = subjectDivHiddenInput!.scrollHeight;
                subjectDivVisibleInput!.scrollTop =subjectDivVisibleInput!.scrollHeight;
            });

        }, [])

        function formatDiv(ele: HTMLElement, isSubjectDiv: boolean = false) {
            let text
            
            if (isSubjectDiv) {
                text = document.getElementById('subjectDivHiddenInput')!.value
                .replaceAll(/ {2,}/g, (match) => {
                    return '\u00A0'.repeat(match.length - 1) + ' ';
                });
            } else {
                text = document.getElementById('messageDivHiddenInput')!.value
                .replaceAll(/ {2,}/g, (match) => {
                    return '\u00A0'.repeat(match.length - 1) + ' ';
                });
            }

            ele.innerHTML = "";

            let currentWord = '';
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                
                if (linksRef.current[i] !== undefined && !isSubjectDiv) {
                    console.log(linksRef);
                    ele.innerHTML += currentWord;
                    const e = document.createElement('a');
                    e.className = "text-blue-500 underline"
                    e.innerText = linksRef.current[i].displayText;
                    e.href = linksRef.current[i].href;
                    ele.appendChild(e);
                    i += linksRef.current[i].displayText.length-1;
                    currentWord = '';
                } else if (char === '\n' ||char === '.' || char === '\u00A0' || char === ' ' || char === ',' || char === ';' || (i === text.length-1)) {
                    if (currentWord === '@companyName') {
                        const e = createCompanyNameSpan();
                        ele.appendChild(e);
                    } else if (currentWord === '@generatedText') {
                        const e = createGeneratedTextNameSpan();
                        ele.appendChild(e);
                    } else {
                        ele.innerHTML += currentWord;
                    }
                    
                    if (char === '\n' && (i === text.length-1)) {
                        const e = document.createElement('br');
                        ele.appendChild(e);
                    }
                    
                    ele.innerHTML += char; 
                    currentWord = '';
                } else {
                    currentWord += char;
                }

            }

        }

        function handleSubjectInputChange() {           
            const visibleInput= document.getElementById("subjectDivVisibleInput");
            const hiddenInput = document.getElementById('subjectDivHiddenInput');
            
            visibleInput!.innerText = hiddenInput!.value
            .replaceAll(/ {2,}/g, (match) => {
                return '\u00A0'.repeat(match.length - 1) + ' ';
            });
            
            formatDiv(visibleInput!, true);
        }

        function handleMessageInputChange() {            
            const visibleInput= document.getElementById("messageDivVisibleInput");
            const hiddenInput = document.getElementById('messageDivHiddenInput');
            
            visibleInput!.innerText = hiddenInput!.value
            .replaceAll(/ {2,}/g, (match) => {
                return '\u00A0'.repeat(match.length - 1) + ' ';
            });
            
            formatDiv(visibleInput!);
        }

        function handleSubjectInput(event: React.KeyboardEvent<HTMLTextAreaElement>) {
            if (event.key === 'Insert' || event.key === 'Delete') {
                event.preventDefault();
                return;
            }

            const ele = document.getElementById('subjectDivHiddenInput');
            const visibleInput= document.getElementById("subjectDivVisibleInput");
            const ignoredKeys = new Set([
                'Shift',
                'Control',
                'Alt',
                'Meta',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Tab',
                'CapsLock',
                'Escape',
                'Home',
                'End',
                'PageUp',
                'PageDown',
                'NumLock',
                'ScrollLock',
                'Pause',
                'ContextMenu',
                'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
              ]);
            
            if (event.key === "Backspace") {
                const selStart = ele!.selectionStart;
                const selEnd = ele!.selectionEnd;

                let lenSelText = selEnd - selStart;
                const newLinks: Record<number, {displayText: string, href: string}> = {};

                if (selStart === 0) {
                    for(let [c, linkObj] of Object.entries(linksRef.current)) {
                        if (Number(c) >= selEnd-1) {
                            newLinks[Number(c)-(lenSelText)] = linkObj;
                        }
                    }
                    linksRef.current = newLinks;
                    formatDiv(visibleInput!, true);
                    return;
                }

                if (lenSelText === 0) {
                    lenSelText++;
                }

                for(let [c, linkObj] of Object.entries(linksRef.current)) {
                    if (Number(c) > selEnd-1) {
                        newLinks[Number(c)-(lenSelText)] = linkObj;
                    } else if (Number(c) < selEnd && (Number(c)+linkObj.displayText.length) > selEnd) {
                        if (lenSelText >= linkObj.displayText.length) {
                            continue;
                        } else {
                            let newDisplayText = '';

                            for(let i = 0; i < linkObj.displayText.length; i++){
                                if (i >= (selStart-1-Number(c)) && i <= (selEnd-1-Number(c))) {
                                    continue;
                                } else {
                                    newDisplayText += linkObj.displayText[i];
                                }
                            }

                            const newLinkObj = {
                                displayText: newDisplayText,
                                href: linkObj.href,
                            }

                            newLinks[Number(c)] = newLinkObj;
                        }
                    } else if (selStart === Number(c)+linkObj.displayText.length && selStart === selEnd) {
                        continue;
                    } else {
                        newLinks[Number(c)] = linkObj;
                    }
                }

                linksRef.current = newLinks;
                formatDiv(visibleInput!, true);
            } else if (!ignoredKeys.has(event.key)) {
                const selStart = ele!.selectionStart;
                const selEnd = ele!.selectionEnd;

                let lenSelText = selEnd - selStart;

                if (lenSelText === 0) {
                    lenSelText++;
                }

                const newLinks: Record<number, {displayText: string, href: string}> = {};
                for(let [c, linkObj] of Object.entries(linksRef.current)) {
                    if (Number(c) >= selEnd-1) {
                        if (lenSelText === 1) {
                            newLinks[Number(c)+1] = linkObj;
                        } else {
                            newLinks[Number(c)+1-lenSelText] = linkObj;
                        }   
                        
                    } else {
                        newLinks[Number(c)] = linkObj;
                    }
                }
                linksRef.current = newLinks;
            }
            
            
        }

        function handleMessageInput(event: React.KeyboardEvent<HTMLTextAreaElement>) {
            if (event.key === 'Insert' || event.key === 'Delete') {
                event.preventDefault();
                return;
            }

            const ele = document.getElementById('messageDivHiddenInput');
            const visibleInput= document.getElementById("messageDivVisibleInput");
            const ignoredKeys = new Set([
                'Shift',
                'Control',
                'Alt',
                'Meta',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Tab',
                'CapsLock',
                'Escape',
                'Home',
                'End',
                'PageUp',
                'PageDown',
                'NumLock',
                'ScrollLock',
                'Pause',
                'ContextMenu',
                'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
              ]);
            
            if (event.key === "Backspace") {
                const selStart = ele!.selectionStart;
                const selEnd = ele!.selectionEnd;

                let lenSelText = selEnd - selStart;
                const newLinks: Record<number, {displayText: string, href: string}> = {};

                if (selStart === 0) {
                    for(let [c, linkObj] of Object.entries(linksRef.current)) {
                        if (Number(c) >= selEnd-1) {
                            newLinks[Number(c)-(lenSelText)] = linkObj;
                        }
                    }
                    linksRef.current = newLinks;
                    formatDiv(visibleInput!);
                    return;
                }

                if (lenSelText === 0) {
                    lenSelText++;
                }

                for(let [c, linkObj] of Object.entries(linksRef.current)) {
                    if (Number(c) > selEnd-1) {
                        newLinks[Number(c)-(lenSelText)] = linkObj;
                    } else if (Number(c) < selEnd && (Number(c)+linkObj.displayText.length) > selEnd) {
                        if (lenSelText >= linkObj.displayText.length) {
                            continue;
                        } else {
                            let newDisplayText = '';

                            for(let i = 0; i < linkObj.displayText.length; i++){
                                if (i >= (selStart-1-Number(c)) && i <= (selEnd-1-Number(c))) {
                                    continue;
                                } else {
                                    newDisplayText += linkObj.displayText[i];
                                }
                            }

                            const newLinkObj = {
                                displayText: newDisplayText,
                                href: linkObj.href,
                            }

                            newLinks[Number(c)] = newLinkObj;
                        }
                    } else if (selStart === Number(c)+linkObj.displayText.length && selStart === selEnd) {
                        continue;
                    } else {
                        newLinks[Number(c)] = linkObj;
                    }
                }

                linksRef.current = newLinks;
                formatDiv(visibleInput!);
            } else if (!ignoredKeys.has(event.key)) {
                const selStart = ele!.selectionStart;
                const selEnd = ele!.selectionEnd;

                let lenSelText = selEnd - selStart;

                if (lenSelText === 0) {
                    lenSelText++;
                }

                const newLinks: Record<number, {displayText: string, href: string}> = {};
                for(let [c, linkObj] of Object.entries(linksRef.current)) {
                    if (Number(c) >= selEnd-1) {
                        if (lenSelText === 1) {
                            newLinks[Number(c)+1] = linkObj;
                        } else {
                            newLinks[Number(c)+1-lenSelText] = linkObj;
                        }   
                        
                    } else {
                        newLinks[Number(c)] = linkObj;
                    }
                }
                linksRef.current = newLinks;
            }
            
            
        }

        let linksRef = useRef<Record<number, {displayText: string, href: string}>>({});

        function toggleAddlink() {
            const visibleInput= document.getElementById("messageDivVisibleInput"); 
            const parent = document.getElementById("newTemplateContent");
            if (!addLinkDivShowing){
                const hiddenInput = document.getElementById('messageDivHiddenInput');
                const count = hiddenInput!.selectionStart;
                const e = hiddenInput!.selectionEnd;
                const text = hiddenInput!.value.slice(count, e);

                if (text === null) {
                    alert("Please select the text to add link to.");
                    return;
                }

                const applyLinkDiv = createApplyLinkDiv(10, 10, count, text, parent!);
                parent!.appendChild(applyLinkDiv);
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
                        <div className="h-[50px] w-[90%] flex justify-between items-center rounded-[5px] hover:cursor-pointer">
                                <div className="flex items-center">
                                    <Image
                                        src="/home.svg"
                                        height={25}
                                        width={25}
                                        alt="home"
                                    />
                                    <p className="text-[#121212] font-normal ml-[10px]">Homepage</p>
                                </div>
                            </div>
                            <div className="h-[50px] w-[90%] flex justify-between items-center rounded-[5px] duration-100 ease-in-out hover:cursor-pointer">
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
                            <div className="h-[50px] w-[90%] flex justify-between items-center rounded-[5px] hover:cursor-pointer" onClick={()=>{window.location.href = "/dashboard/generate"}}>
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
                    {/* div for creating new email template */}
                    <div className="h-0 w-0 mbp:h-full mbp:w-[70%] mbp:min-w-[calc(100%-350px)] mbp:p-[20px] mbp:pb-0 flex flex-col justify-center items-center">
                        <div className="w-full h-[70px] border-zinc-300 border-0 border-b-1 flex items-center"><p className="text-3xl text-[#121212] font-semibold">Create New Template</p></div>
                        {/* <input className="h-[70px] w-full text-3xl text-[#121212] font-semibold border-zinc-200 border-0 border-b-1 focus:outline-none focus:border-zinc-500" type="text" id="newTemplateName" value={`Template ${totalTemplateCount+1}`}/> */}
                        <div className="flex h-full w-full">
                            <div className="h-full pt-[20px] flex justify-center items-center">
                                <div className="h-[50px] w-[70px] pr-[20px]">
                                    <Image 
                                        src="/down.svg"
                                        height={50}
                                        width={50}
                                        alt="up"
                                        className="transform-[rotate(180deg)] hover:cursor-pointer"
                                        onClick={()=>{handleChangeTemplateButton("up")}}
                                    />
                                </div>
                                <div className="flex flex-col justify-center items-center">
                                    <div className="rounded-[5px] border-1 border-zinc-300 p-[10px] w-[500px] flex flex-col flex-center items-center">
                                        <form className="w-ful" id="newTemplateForm">
                                            <input className="h-[50px] w-full text-3xl text-[#121212] font-semibold focus:outline-none" type="text" id="newTemplateName" value={currentTemplateIndex === 0 ? newTemplateName : templates[currentTemplateIndex-1]["templateName"]} onChange={(e)=>{setNewTemplateName(e.target.value)}} autoComplete="off"/>
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
                                            <div id="newTemplateSubject" className="min-h-[40px] w-full border-1 border-zinc-300 p-[10px] pt-0 pb-0 text-zinc-300 rounded-[2.5px] flex flex-col justify-center focus:outline-zinc-400 focus:outline-offset-5 text-wrap hover:cursor-text relative">
                                                <p className="absolute overflow-y-scroll text-black w-full h-full z-[999] top-0 left-0 p-[10px] break-words whitespace-wrap whitespace-pre-line" id='subjectDivVisibleInput'></p>
                                                <textarea className="absolute text-transparent caret-black bg-transparent w-full h-full z-1000 top-0 left-0 p-[10px] text-wrap whitespace-normal break-words resize-none placeholder-zinc-300 overscroll-y-none" contentEditable={true} onKeyDown={handleSubjectInput} onChange={handleSubjectInputChange} id='subjectDivHiddenInput' placeholder="Enter the subject of your mail"></textarea>
                                            </div>
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
                                            <div className="h-[300px] w-full pl-[10px] pt-[10px] text-zinc-300 border-1 border-zinc-300 overflow-y-scroll rounded-[2.5px] p-[10px] focus:outline-offset-5 text-wrap focus:outline-zinc-400 relative" id="newTemplateContent">
                                                <p className="absolute text-black w-full h-full z-[999] top-0 left-0 p-[10px] overflow-y-scroll break-words whitespace-wrap whitespace-pre-line" id='messageDivVisibleInput'></p>
                                                <textarea className="absolute text-transparent caret-black bg-transparent w-full h-full z-1000 top-0 left-0 p-[10px] text-wrap overflow-y-scroll whitespace-normal break-words resize-none placeholder-zinc-300 overscroll-y-none" contentEditable={true} onKeyDown={handleMessageInput} onChange={handleMessageInputChange} id='messageDivHiddenInput' placeholder="Enter the content of your mail"></textarea>
                                            </div>
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
                                                    <div className="h-[50px] w-[50px] flex justify-center items-center hover:cursor-pointer" onClick={createPicker}>
                                                        <Image
                                                            src="/attachment.svg"
                                                            height={30}
                                                            width={30}
                                                            alt="attachment"
                                                        />
                                                    </div>
                                                </div>
                                                <input className=" bg-[#121212] p-[10px] rounded-[10px] hover:cursor-pointer self-end" type="submit" value={currentTemplateIndex === 0 ? "Create new template" : "Update Template"}/>
                                            </div>
                                        </form>
                                        
                                    </div>
                                    <p className="text-[#121212] text-xl" style={{fontFamily: "Bebas Neue"}}>{currentTemplateIndex+1} / {totalTemplateCount+1}</p>
                                </div>
                                <div className="h-[50px] w-[70px] pl-[20px]">
                                    <Image
                                        src="/down.svg"
                                        height={50}
                                        width={50}
                                        alt="down"
                                        className="hover:cursor-pointer"
                                        onClick={()=>{handleChangeTemplateButton("down")}}
                                    />
                                </div>
                            </div>
                            <div className="flex-1 h-full hidden mbp:flex justify-center p-[10px] pl-[20px]">
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

    return (
        <div className="w-full h-full" style={{fontFamily: "Poppins"}}>
            <div className="w-full h-full hidden mbp:block">
                {desktopView()}
            </div>
            <div className="w-full h-full block mbp:hidden">
                {mobileView()}
            </div>
        </div>
    )
}