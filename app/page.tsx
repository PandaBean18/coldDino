"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { jwtVerify } from "jose";
import Cookies from "js-cookie";
import axios from "axios";

declare global {
  interface Window {
      handleRedirect:any;
  }
}

interface individualKeyInterface {
  kid: string,
  n: string,
}

interface keysInterface {
  keys: Array<individualKeyInterface>
}

interface googleCertsResp {
  data: keysInterface,
  status: number,
}

function mobileView(authUri: string, currentValue: string, currentEmail: string, currentSubject: string, currentText: string) {

  function handleRedirect() {
    window.location.href = authUri;
  }

  return (
    <div className="w-full h-full">
      {/* navbar */}
      <div className="h-[60px] w-full bg-white p-[10px] flex justify-between items-center">
        <div className="h-full flex items-center">
          <Image
            src="/logo.svg"
            height={40}
            width={40}
            alt="logo"
          />
          <p className="text-[#121212] font-semibold text-2xl ml-[10px]">ColdDino</p>
        </div>
        <div className="w-[150px] h-full pl-[15px] pr-[15px] flex justify-center items-center text-white bg-black font-medium rounded-md hover:cursor-pointer" onClick={handleRedirect}>
          <p>Get Started</p>
        </div>
      </div>
      <div className="w-full p-[10px] pt-[44px]">
        <div className="w-full flex justify-center"><p className="text-3xl font-[300]" style={{fontFamily: "Poppins"}}>Use AI to <span className="bg-linear-to-r from-cyan-500 to-green-500 bg-clip-text text-transparent">Personalize</span></p></div>
        <div className="w-full flex justify-center"><p className="text-2xl font-[300]" style={{fontFamily: "Poppins"}}>Your Cold Emails To</p></div>
        <div className="w-full flex justify-center"><p className="text-3xl font-[300]" style={{fontFamily: "Poppins"}}><span id="slots" className="bg-linear-to-r from-green-500 to-cyan-500 bg-clip-text text-transparent">{currentValue}</span></p></div>
        <p className="text-transparent select-none font-[300]" style={{fontFamily: "Poppins"}}>tastyBakedCookies.comm</p>
      </div>
      {/* demo mail */}
      <div className="w-full h-[150vw] max-h-[500px] flex flex-col items-center justify-center">
        <div className="w-full h-full p-[10px] max-h-[500px] max-w-[500px]">
          <div className="bg-blue-100 w-full h-[45px] rounded-t-md flex justify-between">
            <div className="p-[10px] flex items-center font-medium"><p className="text-black">New Message</p></div>
            <div className="p-[10px] flex justify-between w-[120px]">
              <Image 
                src="/underline.svg"
                width={15}
                height={20}
                style={{objectFit: "contain"}}
                alt="underline"
              />
              <Image 
                src="/expand.svg"
                width={15}
                height={20}
                style={{objectFit: "contain"}}
                alt="underline"
              />
              <Image 
                src="/cross.svg"
                width={20}
                height={20}
                style={{objectFit: "contain"}}
                alt="underline"
              />
            </div>
          </div>
          <div className="h-[calc(100%-90px)] bg-white w-full overflow-y-hidden">
            <div className="w-full p-[15px] ">
              <p className="text-[#1a1919] text-sm">{currentEmail}</p>
              <div className="mt-[5px] mb-[5px] w-full h-px border-t-1"></div>
              <p className="text-[#1a1919] text-sm mt-[10px]">{currentSubject}</p>
              <div className="mt-[5px] mb-[5px] w-full h-px border-t-1"></div>

              <p className="text-[#1a1919] text-sm mt-[10px] text-wrap">Respected Sir/Ma'am,</p>
              <div className="h-[10px]"></div>
              <p className="text-[#1a1919] text-sm text-wrap">I am Abhishek, full stack freelance developer currently in my second year of college. More information about my experience and techstack is available in my <a className="text-[#15c] underline">portfolio</a>.</p>
              <div className="h-[10px]"></div>
              <p className="text-transparent text-sm text-wrap bg-linear-to-r from-cyan-700 to-green-800 bg-clip-text">{currentText}</p>
              <div className="h-[10px]"></div>
              <p className="text-[#1a1919] text-sm text-wrap">I am writing this mail to show my interest in working with your company, either part time as a freelancer, or fulltime as an intern. I have also attached my resume below for your reference</p>
              <div className="h-[10px]"></div>
              <p className="text-[#1a1919] text-sm text-wrap">Looking forwards to connecting with you,</p>
              <p className="text-[#1a1919] text-sm text-wrap">Abhishek</p>
            </div>
          </div>
          <div className="h-[45px] w-full flex justify-between items-center bg-white rounded-b-md">
            <div className="ml-[10px] w-[100px] h-[80%] bg-blue-500 rounded-[20px] flex justify-center items-center">
              <p className="text-white">Send</p>
            </div>
            <Image
              src="/dustbin.svg"
              height={25}
              width={25}
              alt="bin"
              className="mr-[10px]"
            />
          </div>
          <br />
          <div className="flex justify-center items-center hover:cursor-pointer" onClick={()=>{window.location.href = "/waitlist"}}>
            <p className="text-4xl font-[500]" style={{fontFamily: "Bebas Neue"}}>Join The Waitlist</p>
            <div className="w-[20px]"></div>
            <Image
              src="/arrow_white.svg"
              height={30}
              width={30}
              alt="arrow"
            />
          </div>
        </div>
      </div>
      {/* How it works */}
      <div className="w-full p-[10px] mt-[75px]">
        <div className="w-full min-h-[100px] flex items-center border-b-5 border-[#121212]">
          <div className="w-[20%] flex flex-col items-center">
            <p className="text-7xl font-bold" style={{fontFamily: "Bebas Neue"}}>1</p>
          </div>
          <div className="w-[80%] min-h-[100px] bg-white flex-1 p-[10px]">
            <p className="text-[#121212] text-xl" style={{fontFamily: "Bebas Neue"}}>Firstly, start by creating an email template. This is the email that will be sent to your cold contacts.</p>
          </div>
        </div>
        <div className="w-full min-h-[100px] flex items-center border-b-5 border-[#121212] border-t-5 border-[#121212]">
          <div className="w-[80%] min-h-[100px] bg-white flex-1 p-[10px]">
            <p className="text-[#121212] text-xl" style={{fontFamily: "Bebas Neue"}}>After this, just move to our generate content tab, and type in the email of the person you wish to contact. Make sure to keep their email ID in the user@domainName.com format.</p>
          </div>
          <div className="w-[20%] h-full min-h-[100px] flex flex-col items-center">
            <p className="text-7xl font-bold" style={{fontFamily: "Bebas Neue"}}>2</p>
          </div>
        </div>
        <div className="w-full min-h-[100px] flex items-center border-b-5 border-[#121212] border-t-5 border-[#121212]">
          <div className="w-[20%] flex flex-col items-center">
            <p className="text-7xl font-bold" style={{fontFamily: "Bebas Neue"}}>3</p>
          </div>
          <div className="w-[80%] min-h-[100px] bg-white flex-1 p-[10px]">
            <p className="text-[#121212] text-xl" style={{fontFamily: "Bebas Neue"}}>Now sit back and let our AI agent figure out what the company does and prepare a brief summary that looks just like you wrote it! The application will paste this into your template, and the email will be ready to be sent.</p>
          </div>
        </div>
        <div className="w-full min-h-[100px] flex items-center border-b-5 border-[#121212] border-t-5 border-[#121212]">
          <div className="w-[80%] min-h-[100px] bg-white flex-1 p-[10px]">
            <p className="text-[#121212] text-xl" style={{fontFamily: "Bebas Neue"}}>Once done, you can proof read the email and send it directly from our app, or save it to your drafts and send it later from your mailbox.</p>
          </div>
          <div className="w-[20%] h-full min-h-[100px] flex flex-col items-center">
            <p className="text-7xl font-bold" style={{fontFamily: "Bebas Neue"}}>4</p>
          </div>
        </div>
      </div>
      {/* Features */}
      <div className="w-full">
        <div className="w-full bg-white flex flex-col justify-center items-center p-[20px]">
          <div className="w-full flex justify-start"><p className="text-[#121212] text-7xl font-bold" style={{fontFamily: "Bebas Neue"}}>WHAT</p></div>
          <div className="w-full flex justify-center"><p className="text-[#121212] text-7xl font-bold" style={{fontFamily: "Bebas Neue"}}>DO WE<span className="text-transparent">R.</span></p></div>
          <div className="w-full flex justify-end"><p className="text-[#121212] text-7xl font-bold" style={{fontFamily: "Bebas Neue"}}>OFFER?</p></div>
        </div>
        <div className="w-full bg-black p-[20px] flex flex-col justify-center">
          <p className="text-white text-3xl font-bold" style={{fontFamily: "Bebas Neue"}}>Automated Email Personalization</p>
          <br />
          <p className="text-white text-xl" style={{fontFamily: "Poppins"}}>Even though you may know what the company does, it might be hard for you to put into perspective why you want to be working with them, and while cold mailing multiple companies, its easy to loose track.</p>
        </div>
        <div className="w-full bg-white p-[20px] flex flex-col justify-center border-l-1">
          <p className="text-[#121212] text-3xl font-bold" style={{fontFamily: "Bebas Neue"}}>Sending emails straight from the site</p>
          <br />
          <p className="text-[#121212] text-xl" style={{fontFamily: "Poppins"}}>You can send the emails after they have been generated straight from this site. No need to copy the message and send it from your mailbox, or you can save it in your drafts.</p>
        </div>
        <div className="w-full bg-black p-[20px] flex flex-col justify-center">
          <p className="text-white text-3xl font-bold" style={{fontFamily: "Bebas Neue"}}>Send emails in batches</p>
          <br />
          <p className="text-white text-xl" style={{fontFamily: "Poppins"}}>Instead of sending the emails one at a time, you can upload a CSV file containing upto 20 emails of contacts that you wish to send cold emails to. The app will automatically parse them.</p>
        </div>
      </div>
    </div>
  )
}

function desktopView(authUri: string, currentValue: string, currentEmail: string, currentSubject: string, currentText: string) {
  
  function handleRedirect() {
    window.location.href = authUri;
  }

  return (
    <div className="h-full w-full select-none">
      <div className="flex w-full h-[75px] bg-white justify-between select-none">
        <div className="h-full w-min flex justify-center items-center ml-[20px]">
          <Image 
            src="/logo.svg"
            height={30}
            width={30}
            alt="logo"
            className="mr-[10px] ml-[10px]"
          />
          <p className="text-black text-2xl font-bold">ColdDino</p>
        </div>
        <div className="flex justify-between h-full w-fit items-center">
          <div className="justify-evenly hidden sm:flex">
            <div className="p-[5px] flex justify-center items-center color-black text-black"><p className="border-b-1 border-white hover:border-black hover:cursor-pointer" onClick={()=>{document.getElementById("features")?.scrollIntoView({behavior: "smooth"})}}>Features</p></div>
            <div className="p-[5px] flex justify-center items-center color-black text-black"><p className="border-b-1 border-white hover:border-black hover:cursor-pointer" onClick={()=>{window.location.href = "/waitlist"}}>Waitlist</p></div>
            <div className="p-[5px] pr-0 flex justify-center items-center color-black text-black"><p className="border-b-1 border-white hover:border-black hover:cursor-pointer" onClick={handleRedirect}>Login</p></div>
          </div>
          <div className="ml-[10px] h-[70%] pl-[15px] pr-[15px] flex justify-center items-center text-white bg-black font-medium rounded-md hover:cursor-pointer mr-[20px]" onClick={handleRedirect}>
            <p>Get Started</p>
          </div>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-50px)] h-[100vw] max-mbp:h-[calc(100vh-75px)] bg-black mbp:flex mbp:pt-0 mbp:pb-0 pt-[40px] pb-[40px]">
        <div className="w-full mbp:h-full flex flex-col justify-around mbp:w-[calc(100vw*0.5)]">
          <div className="topText w-full flex flex-col items-center">
            <div className="text-3xl font-[300] mbp:text-4xl">
              <p style={{fontFamily: "Poppins"}}>Use AI To <span className="bg-linear-to-r from-cyan-500 to-green-500 bg-clip-text text-transparent">Personalize</span></p>
              <p style={{fontFamily: "Poppins"}}>Your Cold Emails To</p>
              <p style={{fontFamily: "Poppins"}}><span id="slots" className="bg-linear-to-r from-green-500 to-cyan-500 bg-clip-text text-transparent">{currentValue}</span></p>
              <p className="text-transparent select-none font-[300]" style={{fontFamily: "Poppins"}}>tastyBakedCookies.comm</p>
              <div className="flex justify-start items-center hover:cursor-pointer" onClick={()=>{window.location.href = "/waitlist"}}>
                <p className="text-5xl font-[500]" style={{fontFamily: "Bebas Neue"}}>Join The Waitlist</p>
                <div className="w-[20px]"></div>
                <Image
                  src="/arrow_white.svg"
                  height={50}
                  width={50}
                  alt="arrow"
                />
              </div>
            </div>
            
          </div>
        </div>
        <div className="w-[95vw] h-[80%] flex flex-col mbp:flex-row mbp:h-full p-[15px] mbp:justify-around mbp:w-[450px] mbp:items-center items-center">
          <div className="bg-white w-[70%] h-full mbp:h-[70%] mbp:w-full rounded-md relative">
            <div className="bg-blue-100 w-full h-[45px] absolute rounded-t-md flex justify-between">
              <div className="p-[10px] flex items-center font-medium"><p className="text-black">New Message</p></div>
              <div className="p-[10px] flex justify-between w-[120px]">
                <Image 
                  src="/underline.svg"
                  width={15}
                  height={20}
                  style={{objectFit: "contain"}}
                  alt="underline"
                />
                <Image 
                  src="/expand.svg"
                  width={15}
                  height={20}
                  style={{objectFit: "contain"}}
                  alt="underline"
                />
                <Image 
                  src="/cross.svg"
                  width={20}
                  height={20}
                  style={{objectFit: "contain"}}
                  alt="underline"
                />
              </div>
            </div>
            <div className="h-[calc(100%-90px)] w-full absolute top-[45px] overflow-y-scroll">
              <div className="w-full p-[15px] ">
                <p className="text-[#1a1919] font-thin text-sm">{currentEmail}</p>
                <div className="mt-[5px] mb-[5px] w-full h-px border-t-1"></div>
                <p className="text-[#1a1919] font-thin text-sm mt-[10px]">{currentSubject}</p>
                <div className="mt-[5px] mb-[5px] w-full h-px border-t-1"></div>

                <p className="text-[#1a1919] font-thin text-sm mt-[10px] text-wrap">Respected Sir/Ma'am,</p>
                <div className="h-[10px]"></div>
                <p className="text-[#1a1919] font-thin text-sm text-wrap">I am Abhishek, full stack freelance developer currently in my second year of college. More information about my experience and techstack is available in my <a className="text-[#15c] underline">portfolio</a>.</p>
                <div className="h-[10px]"></div>
                <p className="text-transparent font-thin text-sm text-wrap bg-linear-to-r from-cyan-700 to-green-800 bg-clip-text">{currentText}</p>
                <div className="h-[10px]"></div>
                <p className="text-[#1a1919] font-thin text-sm text-wrap">I am writing this mail to show my interest in working with your company, either part time as a freelancer, or fulltime as an intern. I have also attached my resume below for your reference</p>
                <div className="h-[10px]"></div>
                <p className="text-[#1a1919] font-thin text-sm text-wrap">Looking forwards to connecting with you,</p>
                <p className="text-[#1a1919] font-thin text-sm text-wrap">Abhishek</p>
              </div>
            </div>
            <div className="h-[45px] w-full bottom-[0] absolute flex justify-between items-center">
              <div className="ml-[10px] w-[100px] h-[80%] bg-blue-500 rounded-[20px] flex justify-center items-center">
                <p className="text-white">Send</p>
              </div>
              <Image
                src="/dustbin.svg"
                height={25}
                width={25}
                alt="bin"
                className="mr-[10px]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black w-full h-full flex justify-center items-center">
        <div className="h-[calc(100%-100px)] w-[calc(100%-100px)] flex flex-col justify-between">
          <div className="w-[100%] h-[calc(50%-12.5px)] flex justify-between">
            <div className="w-[calc(33%-12.5px)] h-full bg-white flex">
              <div className="w-[25%] h-full">
                <div className="w-full aspect-square bg-black rounded-br-[100%] flex justify-center items-center pr-[20px] pb-[20px]">
                  <p className="text-5xl font-bold" style={{fontFamily: "Bebas Neue"}}>1</p>
                </div>
              </div>
              <div className="w-[75%] flex flex-col justify-around items-around pr-[10px]">
                <p className="text-[#121212] text-2xl" style={{fontFamily: "Bebas Neue"}}>Firstly, start by creating an email template. This is the email that will be sent to your cold contacts.</p>
              </div>
            </div>
            <div className="w-[calc(67%-12.5px)] h-full bg-white flex">
              <div className="w-[75%] flex flex-col justify-around items-around pl-[10px]">
                <p className="text-[#121212] text-2xl" style={{fontFamily: "Bebas Neue"}}>After this, just move to our generate content tab, and type in the email of the person you wish to contact. Make sure to keep their email ID in the user@domainName.com format.</p>
              </div>
              <div className="w-[25%] h-full">
                <div className="w-full max-h-[50%] aspect-square bg-black rounded-bl-[100%] flex justify-center items-center pl-[20px] pb-[20px]">
                  <p className="text-5xl font-bold" style={{fontFamily: "Bebas Neue"}}>2</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[100%] h-[calc(50%-12.5px)] flex justify-between">
            <div className="w-[calc(67%-12.5px)] h-full bg-white flex">
              <div className="w-[25%] h-full relative">
                <div className="w-full max-h-[50%] aspect-square bg-black rounded-tr-[100%] flex justify-center items-center pr-[20px] pt-[20px] absolute bottom-0">
                  <p className="text-5xl font-bold" style={{fontFamily: "Bebas Neue"}}>3</p>
                </div>
              </div>
              <div className="w-[75%] flex flex-col justify-around items-around pr-[10px]">
                <p className="text-[#121212] text-2xl" style={{fontFamily: "Bebas Neue"}}>Now sit back and let our AI agent figure out what the company does and prepare a brief summary that looks just like you wrote it! Once done searching, the application will paste this into your email template, and the email will be ready to be sent.</p>
              </div>
            </div>
            <div className="w-[calc(33%-12.5px)] h-full bg-white flex">
              <div className="w-[75%] flex flex-col justify-around items-around pl-[10px]">
                <p className="text-[#121212] text-2xl" style={{fontFamily: "Bebas Neue"}}>Once done, you can proof read the email and send it directly from our app, or save it to your drafts and send it later from your mailbox.</p>
              </div>
              <div className="w-[25%] h-full relative">
                <div className="w-full max-h-[50%] aspect-square bg-black rounded-tl-[100%] flex justify-center items-center pl-[20px] pt-[20px] absolute bottom-0">
                  <p className="text-5xl font-bold" style={{fontFamily: "Bebas Neue"}}>4</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-full w-full flex" id="features">
        <div className="w-[30%] h-full bg-white flex flex-col justify-center items-center">
          <p className="text-[#121212] text-7xl font-bold" style={{fontFamily: "Bebas Neue"}}>WHAT</p>
          <p className="text-[#121212] text-7xl font-bold" style={{fontFamily: "Bebas Neue"}}>DO WE</p>
          <p className="text-[#121212] text-7xl font-bold" style={{fontFamily: "Bebas Neue"}}>OFFER?</p>
        </div>
        <div className="w-[70%] h-full">
          <div className="h-[33%] w-full bg-black p-[30px] flex flex-col justify-center">
            <p className="text-white text-3xl font-bold" style={{fontFamily: "Bebas Neue"}}>Automated Email Personalization</p>
            <br />
            <p className="text-white text-xl" style={{fontFamily: "Poppins"}}>Even though you may know what the company does, it might be hard for you to put into perspective why you want to be working with them, and while cold mailing multiple companies, its easy to loose track.</p>
          </div>  
          <div className="h-[33%] w-full bg-white p-[30px] flex flex-col justify-center border-l-1">
            <p className="text-[#121212] text-3xl font-bold" style={{fontFamily: "Bebas Neue"}}>Sending emails straight from the site</p>
            <br />
            <p className="text-[#121212] text-xl" style={{fontFamily: "Poppins"}}>You can send the emails after they have been generated straight from this site. No need to copy the message and send it from your mailbox, or you can save it in your drafts.</p>
          </div>
          <div className="h-[33%] w-full bg-black p-[30px] flex flex-col justify-center">
            <p className="text-white text-3xl font-bold" style={{fontFamily: "Bebas Neue"}}>Send emails in batches</p>
            <br />
            <p className="text-white text-xl" style={{fontFamily: "Poppins"}}>Instead of sending the emails one at a time, you can upload a CSV file containing upto 20 emails of contacts that you wish to send cold emails to. The app will automatically parse them.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  let [authUri, setAuthUri] = useState("/waitlist");

  const values = ["coolCoffeeStartup.com", "greatIndianBirds.in", "tastyBakedCookies.com", "crazyCandies.org", "fabulousFintech.com", "amazingAerospace.com", "poshPublishers.com"];
  const emails = ["hr@coolCoffeeStartup.com", "people@greatIndianBirds.in", "natasha@tastyBakedCookies.com", "cook@crazyCandies.org", "cto@fabulousFintech.com", "kevin@amazingAerospace.com", "editor@poshPublishers.com"]
  const subjects = [
    "Eager to work with coolCoffeeStartup",
    "Looking for opportunities at greatIndianBirds",
    "Looking for freelance work at tastyBakedCookies",
    "Seeking opportunities at crazyCandies",
    "Want to contribute to fabulousFintech",
    "Interested in working with amazingAerospace", 
    "Website development services for poshPublishers"
  ];
  const generatedTexts = [
    "I have been a coffee enthusiast all my life. My days usually start with coffee, and if they dont my day doesnt go well. I really like what your company is doing with regards to coffee.",
    "As an avid bird watcher, and someone who has been interested in birds since a very young age, I am deeply impressed by what your company does.",
    "Baking has been a hobby of mine since childhood, it has been one of the few things that I enjoy thoroughly. I have been following your company for a while and I really like the quality of your products.",
    "I have been following your company for a long time, and have been consuming your products for the same. The quality of your products never ceases to amaze me.",
    "As someone who has always been interested in finance and fintech, your company really amazes me. The work that your company is doing in the domain is revolutionary.",
    "Ever since I was young, I have had an interest in aerospace. Everything about aeronautics and space amazes me. The work that your company is doing in this domain is amazing.",
    "I have always had a keen interest in reading books, they have been a source of extreme joy and knowledge for me. Because of this, I hold special connection to your publishing house."
  ]
  
  var currentIndex = 0;
  const [currentValue, setCurrentValue] = useState<string>(values[currentIndex]);
  const [currentEmail, setCurrentEmail] = useState<string>(emails[currentIndex]);
  const [currentSubject, setCurrentSubject] = useState<string>(subjects[currentIndex]);
  const [currentText, setCurrentText] = useState<string>(generatedTexts[currentIndex]);

  function animateSlots() {
    const totalIterations = (10 * values.length) + (currentIndex % values.length);
    const fastIterations = 5*values.length;
    const midIterations = fastIterations + (4*values.length);
    const slowIterations = midIterations + values.length + (currentIndex % values.length);
    var currentIteration = 0;

    function updateVal() {
      
      if (currentIteration < fastIterations) {
        currentIteration += 1;
        setCurrentValue(values[currentIteration % values.length])
        setTimeout(() => {
          updateVal();
        }, 10)
      } else if (currentIteration < midIterations) {
        currentIteration += 1;
        setCurrentValue(values[currentIteration % values.length])
        setTimeout(() => {
          updateVal();
        }, 30)
      } else if (currentIteration <= slowIterations) {
        currentIteration += 1;
        setCurrentValue(values[currentIteration % values.length])
        setTimeout(() => {
          updateVal()
        }, 70)
      } else {
        setCurrentEmail(emails[currentIteration % emails.length]);
        setCurrentSubject(subjects[currentIteration % subjects.length]);
        setCurrentText(generatedTexts[currentIteration % generatedTexts.length]);
        return;
      }
    }
    
    updateVal();
    currentIndex+=1;
  }

  useEffect(() => {
    const interval = setInterval(animateSlots, 6000);
    return () => clearInterval(interval);
}, []);

  useEffect(() => {
    window.onload = async function () {
      const jwt = Cookies.get("coldDinoJwt");

      if (jwt === undefined || jwt === null) {
        return;
      }

      try {
        await axios.post("/api/verify", {"token": jwt});
        
        //setAuthUri("/dashboard/generate");
      } catch {
        return
      }
    }

  }, [])
  return (
    <div className="w-full h-full select-none">
      <div className="w-full h-full hidden mbp:block">
        {desktopView(authUri, currentValue, currentEmail, currentSubject, currentText)}
      </div>
      <div className="w-full h-full block mbp:hidden">
        {mobileView(authUri, currentValue, currentEmail, currentSubject, currentText)}
      </div>
    </div>
  )
}
