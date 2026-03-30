import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";
import { UserPlus, User, Mail, Lock, ArrowRight } from "lucide-react";
import LightPillar from "../components/LightPillar";
import ElectricBorder from "../components/ElectricBorder";

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student"); // ✅ NEW
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await API.post("/auth/register", { name, email, password, role });

            // ✅ UPDATED MESSAGE
            if (role === "counsellor") {
                toast.success("Registered successfully! Wait for admin approval");
            } else {
                toast.success("Account created successfully!");
            }

            navigate("/");
        } catch (error) {
            toast.error("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#060010]">
            <div className="absolute inset-0 z-0">
                <LightPillar
                    topColor="#5227FF"
                    bottomColor="#FF9FFC"
                    intensity={1}
                    rotationSpeed={0.3}
                    glowAmount={0.002}
                    pillarWidth={3}
                    pillarHeight={0.4}
                    noiseIntensity={0.5}
                    pillarRotation={25}
                    interactive={false}
                    mixBlendMode="screen"
                    quality="high"
                />
            </div>

            <div className="w-full max-w-md px-6 py-12 z-10 animate-fade">
                <ElectricBorder
                    color="#7df9ff"
                    speed={1}
                    chaos={0.12}
                    borderRadius={24}
                >
                    <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-10 sm:p-12">
                        <div className="text-center mb-10">
                            <div className="bg-emerald-600/20 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg border border-emerald-500/30">
                                <UserPlus className="h-8 w-8 text-emerald-400" />
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                                Create Account
                            </h2>
                            <p className="text-slate-300 font-medium">
                                Join our community today
                            </p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="space-y-4">

                                {/* Full Name */}
                                <div className="group relative">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1 tracking-wider">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="group relative">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1 tracking-wider">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="group relative">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1 tracking-wider">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* ✅ NEW: ROLE SELECT */}
                                <div className="group relative">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1 tracking-wider">
                                        Register As
                                    </label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    >
                                        <option value="student">Student</option>
                                        <option value="counsellor">Counsellor</option>
                                    </select>
                                </div>

                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full group rounded-2xl bg-emerald-600 px-4 py-4 text-base font-bold text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                            >
                                {isLoading ? "Creating account..." : (
                                    <>
                                        Register <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-sm text-slate-400 font-medium">
                                Already have an account?{" "}
                                <span
                                    onClick={() => navigate("/")}
                                    className="font-bold cursor-pointer text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                    Sign in here
                                </span>
                            </p>
                        </div>
                    </div>
                </ElectricBorder>
            </div>
        </div>
    );
};

export default Register;