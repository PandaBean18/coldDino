'use client'
import Image from "next/image";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function Allow() {
    async function handleAuthorizeGmail() {
        try {
            const response = await axios.post("/api/getGmailAuthToken");
            window.location.href = "/dashboard/generate"
        } catch (e: any) {
            if (e.status === 401) {
                window.location.href = e.response.data.authUrl;
            } else {
                alert("Gmail authorization failed");
            }
        }
    }

    return (
        <div className="h-full w-full bg-gray-50 flex justify-center items-center select-none">
            <div className="w-[95%] h-full mbp:w-[500px] flex flex-col justify-around items-center">
                <div className="w-[80%] bg-white p-[15px] flex flex-col justify-evenly items-center border-1 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] rounded-[10px]">
                    <div className="h-[50px] w-full flex justify-center items-center m-[20px]">
                        <div className="bg-gray-300 h-[50px] w-[50px] rounded-[25px] flex justify-center items-center">
                            <Image 
                                src="/logo.svg"
                                height={40}
                                width={40}
                                alt="logo"
                            />
                        </div>
                        <div className="h-[50px] w-[50px] p-[5px]">
                            <Image
                                src="/bidirectional.svg"
                                height={40}
                                width={40}
                                alt="bidir"
                            />
                        </div>
                        <div className="h-[50px] w-[50px] p-[5px]">
                            <Image
                                src="/gmail_icon.svg"
                                height={40}
                                width={40}
                                alt="bidir"
                            />
                        </div>
                    </div>
                    <p className="font-bold text-3xl text-[#121212]">Authorize Gmail</p>
                    <p className="text-base text-gray-500 text-center">Please allow ColdDino to compose and send emails through your gmail account.</p>
                    <div className="h-[30px]"></div>
                    <div className="h-[50px] w-[150px] bg-white rounded-[5px] border-1 border-zinc-300 hover:cursor-pointer hover:bg-zinc-100 duration-100 flex justify-center items-center" onClick={handleAuthorizeGmail}>
                        <p className="text-[#121212]">Authorize</p>
                    </div>
                    <div className="h-[15px]"></div>
                </div>
            </div>
        </div>
    );
}