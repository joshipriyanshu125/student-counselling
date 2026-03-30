import Button from "../components/Button"

function Appointments() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Appointments</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage your scheduled counseling appointments.</p>
                </div>
                <div className="w-full sm:w-auto">
                    <Button text="+ Book New Session" className="px-6 py-2.5 shadow-lg shadow-indigo-500/20" />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center mt-8 relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-50 rounded-full blur-3xl -z-10"></div>

                <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-indigo-100 border border-slate-50">
                    <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No upcoming appointments</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">You don't have any appointments scheduled at the moment. Book a new session to talk to a counselor.</p>
                <button className="text-indigo-600 font-bold hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-6 py-2.5 rounded-xl transition-colors">
                    Browse Counselors
                </button>
            </div>
        </div>
    )
}

export default Appointments