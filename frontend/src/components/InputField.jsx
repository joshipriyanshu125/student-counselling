import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

function InputField({ label, type = "text", placeholder, value, onChange, icon: Icon }) {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const inputType = type === "password" && showPassword ? "text" : type

    return (
        <div className="mb-5">
            {label && (
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                    {label}
                </label>
            )}

            <div className={`relative flex items-center bg-slate-50 border rounded-xl overflow-hidden transition-all duration-300 ${isFocused ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-sm' : 'border-slate-300 hover:border-indigo-300'}`}>

                {Icon && (
                    <div className="pl-4 text-slate-400">
                        <Icon className={`text-lg transition-colors ${isFocused ? "text-indigo-500" : ""}`} />
                    </div>
                )}

                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full bg-transparent p-3 outline-none text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal ${Icon ? 'pl-3' : 'px-4'}`}
                />

                {type === "password" && (
                    <button
                        type="button"
                        className="absolute right-2 p-2 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none rounded-full hover:bg-indigo-50"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                    </button>
                )}
            </div>
        </div>
    )
}

export default InputField
