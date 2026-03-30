function AuthLayout({ children }) {
    return (
        <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-900/40 mix-blend-screen filter blur-[100px] opacity-70 animate-blob"></div>
                <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-violet-900/40 mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-purple-900/30 mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="z-10 w-full max-w-md">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout