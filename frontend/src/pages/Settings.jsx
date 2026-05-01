import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { 
    Globe, 
    Languages, 
    Clock, 
    Calendar, 
    CheckCircle, 
    Eye, 
    Palette, 
    Volume2, 
    Type, 
    MousePointer2, 
    Subtitles,
    Save,
    ChevronDown
} from "lucide-react"
import API from "../api/api"
import toast from "react-hot-toast"
import Toggle from "../components/Toggle"

function Settings() {
    const [settings, setSettings] = useState({
        language: "English",
        timezone: "(GMT+05:30) Mumbai, Kolkata",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "12-hour",
        accessibility: {
            reduceMotion: false,
            highContrast: false,
            screenReader: false,
            keyboardNav: false,
            alwaysShowCaptions: false
        }
    })

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await API.get("/users/me")
                if (res?.data?.settings) {
                    setSettings({
                        ...settings,
                        ...res.data.settings,
                        accessibility: {
                            ...settings.accessibility,
                            ...(res.data.settings.accessibility || {})
                        }
                    })
                }
            } catch (error) {
                console.error("Failed to load settings", error)
                toast.error("Failed to load settings")
            } finally {
                setIsLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleToggle = (key, value) => {
        setSettings(prev => ({
            ...prev,
            accessibility: {
                ...prev.accessibility,
                [key]: value
            }
        }))
    }

    const handleChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleSave = async () => {
        try {
            const res = await API.put("/users/settings", { settings })
            if (res.data) {
                toast.success("Settings updated successfully")
            }
        } catch (error) {
            console.error("Failed to save settings", error)
            toast.error("Failed to save settings")
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-4xl mx-auto space-y-8 pb-20"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">Settings</h1>
                    <p className="text-slate-500 font-bold mt-1">Customize your experience, regional formats, and accessibility</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

            {/* Language & Region Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm p-8 sm:p-12 border border-slate-100 group hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                        <Globe className="text-2xl" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Language & Region</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Language Select */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[11px] px-1">
                            <Languages size={14} />
                            Language
                        </label>
                        <div className="relative">
                            <select 
                                value={settings.language}
                                onChange={(e) => handleChange("language", e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 text-slate-700 font-bold py-4 px-6 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all cursor-pointer"
                            >
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                                <option>Hindi</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Timezone Select */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[11px] px-1">
                            <Clock size={14} />
                            Timezone
                        </label>
                        <div className="relative">
                            <select 
                                value={settings.timezone}
                                onChange={(e) => handleChange("timezone", e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 text-slate-700 font-bold py-4 px-6 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all cursor-pointer"
                            >
                                <option>(GMT+05:30) Mumbai, Kolkata</option>
                                <option>(GMT-05:00) New York</option>
                                <option>(GMT+00:00) London</option>
                                <option>(GMT+09:00) Tokyo</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Date Format Select */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[11px] px-1">
                            <Calendar size={14} />
                            Date Format
                        </label>
                        <div className="relative">
                            <select 
                                value={settings.dateFormat}
                                onChange={(e) => handleChange("dateFormat", e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 text-slate-700 font-bold py-4 px-6 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all cursor-pointer"
                            >
                                <option>DD/MM/YYYY</option>
                                <option>MM/DD/YYYY</option>
                                <option>YYYY-MM-DD</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Time Format Select */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[11px] px-1">
                            <Clock size={14} />
                            Time Format
                        </label>
                        <div className="relative">
                            <select 
                                value={settings.timeFormat}
                                onChange={(e) => handleChange("timeFormat", e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 text-slate-700 font-bold py-4 px-6 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all cursor-pointer"
                            >
                                <option value="12-hour">12-hour (1:30 PM)</option>
                                <option value="24-hour">24-hour (13:30)</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Accessibility Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm p-8 sm:p-12 border border-slate-100 group hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-violet-50 rounded-2xl text-violet-600">
                        <Eye className="text-2xl" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Accessibility</h2>
                </div>

                <div className="space-y-2">
                    {[
                        { 
                            id: "reduceMotion", 
                            label: "Reduce Motion", 
                            desc: "Minimize animations and transitions", 
                            icon: Eye,
                            color: "bg-indigo-50 text-indigo-600" 
                        },
                        { 
                            id: "highContrast", 
                            label: "High Contrast Mode", 
                            desc: "Increase color contrast for readability", 
                            icon: Palette,
                            color: "bg-blue-50 text-blue-600" 
                        },
                        { 
                            id: "screenReader", 
                            label: "Screen Reader Optimization", 
                            desc: "Enhanced ARIA labels and announcements", 
                            icon: Volume2,
                            color: "bg-violet-50 text-violet-600" 
                        },
                        { 
                            id: "keyboardNav", 
                            label: "Keyboard Navigation Hints", 
                            desc: "Show keyboard shortcuts and focus rings", 
                            icon: MousePointer2,
                            color: "bg-rose-50 text-rose-600" 
                        },
                        { 
                            id: "alwaysShowCaptions", 
                            label: "Always Show Captions", 
                            desc: "Display captions in video sessions by default", 
                            icon: Subtitles,
                            color: "bg-amber-50 text-amber-600" 
                        }
                    ].map((item) => (
                        <div 
                            key={item.id}
                            className="flex items-center justify-between py-6 px-6 hover:bg-slate-50 rounded-[2rem] transition-all duration-300 border-b border-slate-50 last:border-0"
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${item.color} shadow-sm`}>
                                    <item.icon className="text-xl" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-extrabold text-slate-800 text-lg leading-tight">{item.label}</p>
                                    <p className="text-sm text-slate-400 font-bold mt-1 truncate">{item.desc}</p>
                                </div>
                            </div>
                            <Toggle 
                                enabled={settings.accessibility[item.id]} 
                                onChange={(val) => handleToggle(item.id, val)} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )

}

export default Settings;
