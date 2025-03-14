import Image from "next/image";

export default function signin() {
    return (
        <div className="h-full w-full bg-gray-50 flex justify-center items-center select-none">
            <div className="w-full h-full mbp:w-[500px] flex flex-col justify-around items-center">
                <div className="w-full flex flex-col items-center">
                    <div className="bg-gray-300 h-[50px] w-[50px] rounded-[25px] flex justify-center items-center m-[20px]">
                        <Image 
                            src="/logo.svg"
                            height={40}
                            width={40}
                            alt="logo"
                        />
                    </div>
                    <p className="font-bold text-3xl text-[#121212]">Welcome Back</p>
                    <p className="text-base text-gray-500">Sign in to your google account to continue</p>
                </div>
                <div className="w-full h-[100px] bg-white border-1 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] rounded-[10px]"></div>
            </div>
        </div>
    );
}