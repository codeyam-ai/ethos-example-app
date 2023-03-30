import { ReactNode } from "react";

const ErrorMessage = ({ reset, children }: { reset: () => void, children: ReactNode }) => {
    return (
        <div className='p-3 pr-12 bg-red-200 text-black text-sm text-center relative'>
            <div 
                className='cursor-pointer rounded-full flex justify-center items-center bg-white w-6 h-6 text-sm absolute top-2 right-2'
                onClick={reset}
            >
                ✕
            </div>
            {children}
        </div>
    )
}

export default ErrorMessage;