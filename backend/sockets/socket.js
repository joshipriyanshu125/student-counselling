import Message from "../models/Message.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join room for specific chat
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // Join catch-all room for any incoming messages
    socket.on("join_own_room", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${socket.id} joined personal room: user_${userId}`);
    });


    // Handle sending messages and saving to DB
    socket.on("send_message", async (data) => {
      try {
        const { roomId, senderId, receiverId, message, fileUrl, fileType } = data;

        // Create and save message
        const newMessage = new Message({
          roomId,
          senderId,
          receiverId,
          message,
          fileUrl,
          fileType,
        });

        const savedMessage = await newMessage.save();
        
        // Populate sender info for the frontend
        const populatedMessage = await Message.findById(savedMessage._id)
          .populate("senderId", "fullName email role")
          .lean();

        // Broadcast to the room and specifically to the receiver's catch-all room
        io.to(roomId).emit("receive_message", populatedMessage);
        io.to(`user_${receiverId}`).emit("receive_message", populatedMessage);
        
        console.log(`Message sent in room ${roomId} from ${senderId} to ${receiverId}`);
      } catch (err) {
        console.error("Socket message error:", err);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default socketHandler;