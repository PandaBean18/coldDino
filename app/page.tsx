"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
export default function Home() {
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

  return (
    <div className="h-full w-full select-none">
      <div className="flex w-full h-[75px] bg-white justify-between select-none">
        <div className="h-full w-min flex justify-center items-center ml-[20px]">
          <p className="text-black text-2xl font-bold">ColdDino</p>
        </div>
        <div className="flex justify-between h-full w-fit items-center">
          <div className="justify-evenly hidden sm:flex">
            <div className="p-[5px] flex justify-center items-center color-black text-black"><p className="border-b-1 border-white hover:border-black hover:cursor-pointer">Features</p></div>
            <div className="p-[5px] flex justify-center items-center color-black text-black"><p className="border-b-1 border-white hover:border-black hover:cursor-pointer">Pricing</p></div>
            <div className="p-[5px] pr-0 flex justify-center items-center color-black text-black"><p className="border-b-1 border-white hover:border-black hover:cursor-pointer">Login</p></div>
          </div>
          <div className="ml-[10px] h-[70%] pl-[15px] pr-[15px] flex justify-center items-center text-white bg-black font-medium rounded-md hover:cursor-pointer mr-[20px]">
            <p>Get Started</p>
          </div>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-50px)] mbp:h-[calc(100vh-75px)] bg-[#121212] mbp:flex mbp:pt-0 mbp:pb-0 pt-[40px] pb-[40px]">
        <div className="w-full mbp:h-full flex flex-col justify-around mbp:w-[calc(100vw*0.5)]">
          <div className="topText w-full flex flex-col items-center">
            <div className="text-3xl font-semibold mbp:text-4xl">
              <p>Use AI To <span className="bg-linear-to-r from-cyan-500 to-green-500 bg-clip-text text-transparent">Personalize</span></p>
              <p>Your Cold Emails To</p>
              <p><span id="slots" className="bg-linear-to-r from-green-500 to-cyan-500 bg-clip-text text-transparent">{currentValue}</span></p>
              <p className="text-[#121212] select-none">tastyBakedCookies.com</p>
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
      <div className="bg-white w-full">
        <div className="w-full h-max flex p-[10px] pt-[50px] pb-0">
          <div className="w-[60px] mbp:w-[30%] flex flex-col justify-center items-center grow-1">
            <div className="bg-[#121212] w-[50px] h-[50px] flex justify-center items-center rounded-[50%] border-zinc-300 border-1"><p className="text-white text-3xl">1</p></div>
            <div className="h-[calc(100%-40px)] w-[1px] border-zinc-300 border-r-1 border-l-1"></div>
          </div>
          <div className="w-[calc(100%-50px)] flex justify-center items-center">
            <div className="w-full mbp:w-[60%]">
              <p className="text-black text-xl mbp:text-3xl">Firstly start by creating an email template. This template is what will be sent to your cold contact and the AI generated content will be embeded into this.</p>
              <br />
            </div>
          </div>
        </div>
        <div className="w-full h-max flex p-[10px] pt-0 pb-0">
          <div className="w-[60px] mbp:w-[30%] flex flex-col justify-center items-center grow-1">
            <div className="bg-[#121212] w-[50px] h-[50px] flex justify-center items-center rounded-[50%] border-zinc-300 border-1"><p className="text-white text-3xl">2</p></div>
            <div className="h-[calc(100%-40px)] w-[1px] border-zinc-300 border-r-1 border-l-1"></div>
          </div>
          <div className="w-[calc(100%-50px)] flex justify-center items-center">
            <div className="w-full mbp:w-[60%]">
              <p className="text-black text-xl mbp:text-3xl">Then, upload the email id of the representative of the company that you wish to contact. Make sure that the mail that you upload is in the format of name@domainName.com!</p>
              <br />
            </div>
          </div>
        </div>
        <div className="w-full h-max flex p-[10px] pt-0 pb-0">
          <div className="w-[60px] mbp:w-[30%] flex flex-col justify-center items-center grow-1">
            <div className="bg-[#121212] w-[50px] h-[50px] flex justify-center items-center rounded-[50%] border-zinc-300 border-1"><p className="text-white text-3xl">3</p></div>
            <div className="h-[calc(100%-40px)] w-[1px] border-zinc-300 border-r-1 border-l-1"></div>
          </div>
          <div className="w-[calc(100%-50px)] flex justify-center items-center">
            <div className="w-full mbp:w-[60%]">
              <p className="text-black text-xl mbp:text-3xl">Now sit back and let our AI agent figure out what the company does and prepare a brief summary that looks just like you wrote it! Once done searching, the application will paste this into your email template, and the email will be ready to be sent.</p>
              <br />
            </div>
          </div>
        </div>
        <div className="w-full h-max flex p-[10px] pt-0 pb-0">
          <div className="w-[60px] mbp:w-[30%] flex flex-col items-center grow-1">
            <div className="bg-[#121212] w-[50px] h-[50px] flex justify-center items-center rounded-[50%] border-zinc-300 border-1"><p className="text-white text-3xl">4</p></div>
          </div>
          <div className="w-[calc(100%-50px)] flex justify-center items-center">
            <div className="w-full mbp:w-[60%]">
              <p className="text-black text-xl mbp:text-3xl">Once done, you can proof read the email and send it directly from our app, or save it to your drafts and send it later from your mailbox.</p>
              <br />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:h-[300px] bg-[#121212] pt-[30px] flex justify-around items-center">
        <div className="h-full w-[95%] flex items-center justify-between flex-col lg:flex-row">
          <div className="w-full lg:w-[30%] lg:h-[90%] flex flex-col items-center">
            <p className="text-neutral-300 text-2xl text-center font-bold">Automate Email Personalization</p>
            <br />
            <p className="text-neutral-100 text-xl text-left">Even though you may know what the company does, it might be hard for you to put into perspective why you want to be working with them, and while cold mailing multiple companies, its easy to loose track.</p>
          </div>
          <div className="w-[90%] h-[1px] lg:w-[1px] lg:h-[90%] border-zinc-300 border-t-1 border-b-1 mt-[20px] mb-[20px] lg:border-r-1 lg:border-l-1 lg:border-t-0 lg:border-b-0 lg:mr-[20px] lg:ml-[20px]"></div>
          <div className="w-full lg:w-[30%] lg:h-[90%] flex flex-col grow-1  items-center">
            <p className="text-neutral-300 text-2xl text-center font-bold">Send emails straight from the site</p>
            <br />
            <p className="text-neutral-100 text-xl text-left">You can send the emails after they have been generated straight from this site! No need to copy the message and send it from your mailbox, or you can save it in your drafts.</p>
          </div>
          <div className="w-[90%] h-[1px] lg:w-[1px] lg:h-[90%] border-zinc-300 border-t-1 border-b-1 mt-[20px] mb-[20px] lg:border-r-1 lg:border-l-1 lg:border-t-0 lg:border-b-0 lg:mr-[20px] lg:ml-[20px]"></div>
          <div className="w-full lg:w-[30%] lg:h-[90%] grow-1 flex flex-col items-center">
            <p className="text-neutral-300 text-2xl text-center font-bold">Send emails in batches</p>
            <br />
            <p className="text-neutral-100 text-xl text-left">Instead of sending the emails one at a time, you can upload a CSV file containing upto 20 emails of contacts that you wish to send cold emails to. The app will automatically parse them! (Coming soon)</p>
          </div>  
        </div>
      </div>
    </div>
  );
}
