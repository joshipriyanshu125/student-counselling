import { useState } from "react"
import toast from "react-hot-toast"
import { User } from "lucide-react"

function ProfileForm() {

    const [name, setName] = useState("John Doe")
    const [email, setEmail] = useState("john@example.com")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState(null)

    const handleSubmit = (e) => {

        e.preventDefault()

        toast.success("Profile updated successfully")

    }

    return (

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">

            {/* Profile Image */}

            <div className="flex items-center gap-6">

                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">

                    {image ? (
                        <img src={image} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                        <User size={32} className="text-indigo-600" />
                    )}

                </div>

                <input
                    type="file"
                    onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
                />

            </div>


            {/* Form */}

            <form onSubmit={handleSubmit} className="space-y-6">

                <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Name
                    </label>

                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />

                </div>


                <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Email
                    </label>

                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />

                </div>


                <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Change Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />

                </div>


                <button
                    type="submit"
                    className="bg-[#4F46E5] hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                    Save Changes
                </button>

            </form>

        </div>

    )
}

export default ProfileForm;