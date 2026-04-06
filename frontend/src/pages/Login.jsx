import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";
import LightPillar from "../components/LightPillar";
import ElectricBorder from "../components/ElectricBorder";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await API.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("role", res.data.user.role);
            toast.success("Welcome back!");


            const role = res.data.user.role;
            if (role === "counsellor") {
                navigate("/counsellor-dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            toast.error("Invalid email or password");
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

            <div className="w-full max-w-md px-6 z-10 animate-fade">
                <ElectricBorder
                    color="#7df9ff"
                    speed={1}
                    chaos={0.12}
                    borderRadius={24}
                >
                    <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-10 sm:p-12">
                        <div className="text-center mb-10">
                            <div className="bg-indigo-600/20 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg border border-indigo-500/30">
                                <LogIn className="h-8 w-8 text-indigo-400" />
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                                Welcome Back
                            </h2>
                            <p className="text-slate-300 font-medium">
                                Sign in to your account
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-4">
                                <div className="group relative">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1 tracking-wider">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

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
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                disabled={isLoading}
                                className="w-full group rounded-2xl bg-indigo-600 px-4 py-4 text-base font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? "Signing in..." : (
                                    <>
                                        Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-sm text-slate-400 font-medium">
                                Don't have an account?{" "}
                                <span
                                    onClick={() => navigate("/register")}
                                    className="font-bold cursor-pointer text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    Create one now
                                </span>
                            </p>
                        </div>
                    </div>
                </ElectricBorder>
            </div>
        </div>
    );
};

export default Login;