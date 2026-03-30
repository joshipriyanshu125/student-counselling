function FormCard({ title, subtitle, children }) {
    return (
        <div className="w-full relative group">
            {/* Animated border glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative bg-white/95 backdrop-blur-2xl shadow-2xl p-8 sm:p-10 rounded-2xl border border-white">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-slate-500 mt-2 font-medium">{subtitle}</p>
                    )}
                </div>

                {children}
            </div>
        </div>
    )
}

export default FormCard
