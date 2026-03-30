import React, { useState } from "react"

const SupportModal = ({ onClose }) => {
    const [message, setMessage] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        alert("Support request sent!") // later connect backend
        setMessage("")
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
                <h2 className="text-xl font-semibold mb-4">Contact Support</h2>

                <p className="text-sm mb-2">📧 Email:p9464888@gmail.com</p>
                <p className="text-sm mb-4">📞 Phone: +91 9105131502</p>

                <form onSubmit={handleSubmit}>
                    <textarea
                        className="w-full border p-2 rounded mb-4"
                        rows="4"
                        placeholder="Describe your issue..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded"
                        >
                            Close
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SupportModal;