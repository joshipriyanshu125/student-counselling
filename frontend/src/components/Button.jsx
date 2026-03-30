function Button({ text, loading, type = "submit", onClick, className = "", variant = "primary" }) {
    const baseStyles = "w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] outline-none focus:ring-4 relative overflow-hidden group";

    const variants = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 focus:ring-indigo-500/30",
        secondary: "bg-white text-indigo-900 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 shadow-sm focus:ring-indigo-100",
        danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 focus:ring-rose-500/30",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className={`${baseStyles} ${variants[variant]} ${loading ? "opacity-70 cursor-not-allowed" : ""} ${className}`}
        >
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-700 pointer-events-none"></div>

            {loading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </>
            ) : text}
        </button>
    )
}

export default Button
