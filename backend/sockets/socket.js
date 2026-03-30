const Message = require("../models/Message");

const socketHandler = (io) => {
    io.on("connection", (socket) => {

        socket.on("join_room", (roomId) => {
            socket.join(roomId)
        })

        socket.on("send_message", async (data) => {
            const newMessage = await Message.create(data)

            io.to(data.roomId).emit("receive_message", newMessage)
        })

    })
}

module.exports = socketHandler;