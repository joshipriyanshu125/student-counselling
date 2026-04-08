import { motion } from "framer-motion"

const Toggle = ({ enabled, onChange, disabled }) => {
    return (
        <button
            onClick={() => !disabled && onChange(!enabled)}
            className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2
                ${enabled ? "bg-indigo-600" : "bg-slate-700"}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
        >
            <span className="sr-only">Toggle notification</span>
            <motion.span
                animate={{ x: enabled ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                `}
            />
        </button>
    )
}

export default Toggle
