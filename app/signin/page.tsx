'use client'
import Image from "next/image";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";


declare global {
    interface Window {
        decodeJwtResponse:any;
    }
}

export default function Signin() {

    interface googleRespPayload {
        clientId: string, 
        client_id: string,
        credential: string,
        select_by: string
    }

    interface individualKeyInterface {
        kid: string,
        n: string,
        kty: string, 
        e: string,
    }

    interface keysInterface {
        keys: Array<individualKeyInterface>
    }

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        document.body.appendChild(script);
    
        return () => {
          document.body.removeChild(script);
        };
      }, []);

    useEffect(() => {
        window.decodeJwtResponse = async function (payload: googleRespPayload) {
            let token = payload.credential;
            try {
                const response = await axios.post("/api/verify", {"token": token});
                Cookies.remove("coldDinoJwt");
                Cookies.set("coldDinoJwt", token, {expires: 10});
                window.location.href = "/signin/allow";
            } catch {
                alert("login failed");
                window.location.href = "/signin";
            }
        }
    }, [])

    return (
        <div className="h-full w-full bg-gray-50 flex justify-center items-center select-none">
            <div className="w-[95%] h-full mbp:w-[500px] flex flex-col justify-around items-center">
                <div className="w-[80%] bg-white p-[15px] flex flex-col justify-evenly items-center border-1 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] rounded-[10px]">
                    <div className="bg-gray-300 h-[50px] w-[50px] rounded-[25px] flex justify-center items-center m-[20px]">
                        <Image 
                            src="/logo.svg"
                            height={40}
                            width={40}
                            alt="logo"
                        />
                    </div>
                    <p className="font-bold text-3xl text-[#121212]">Welcome Back</p>
                    <p className="text-base text-gray-500">Sign in using your google account to continue</p>
                    <div className="h-[30px]"></div>
                    <div id="g_id_onload"
                        data-client_id="806527561422-e18dq5d8m174nm5t6aruskmd3dqllpbc.apps.googleusercontent.com"
                        data-login_uri="http://localhost:3000/verify"
                        data-auto_prompt="false"
                        data-callback="decodeJwtResponse"
                        data-scope="email profile https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.compose"
                    >
                        <div className="g_id_signin"
                            data-type="standard"
                            data-size="large"
                            data-theme="outline"
                            data-text="sign_in_with"
                            data-shape="rectangular"
                            data-logo_alignment="left">
                        </div>
                    </div>
                    <div className="h-[15px]"></div>
                </div>
            </div>
        </div>
    );
}