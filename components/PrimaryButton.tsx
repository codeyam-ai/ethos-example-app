import { ReactNode } from "react";

const PrimaryButton = ({ children, onClick }: { children: ReactNode, onClick: () => void }) => {
    return (
        <button
            className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default PrimaryButton;