import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";


import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video,
  MessageCircle,
  User as UserIcon,
  Users,
  Check,

  CheckCheck,
  ArrowLeft,
  Plus
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";
import toast from "react-hot-toast";

const SOCKET_URL = "http://localhost:5000";

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);


  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState(null);
  
  const scrollRef = useRef();
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const myId = currentUser?.id || currentUser?._id;
  const myRole = localStorage.getItem("role");


  // Initialize Socket and User
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    const fetchMe = async () => {
      if (!myId) {
        try {
          const res = await API.get("/users/me");
          setCurrentUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        } catch (err) {
          console.error("Failed to fetch user profile", err);
        }
      }
    };
    fetchMe();

    return () => newSocket.disconnect();
  }, [myId]);


  // Fetch Conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await API.get("/messages/conversations/all");
        let fetchedConversations = res.data.data;
        
        // Check if we're coming from the directory with a counsellor
        if (location.state?.counsellor) {
          const targetCounsellor = location.state.counsellor;
          const roomId = [myId, targetCounsellor._id].sort().join("_");
          
          const existing = fetchedConversations.find(c => c.roomId === roomId);
          
          if (existing) {
            setActiveChat(existing);
          } else {
            // Create a temporary conversation entry
            const tempConv = {
              partner: targetCounsellor,
              roomId: roomId,
              lastMessage: "Start a conversation...",
              lastMessageTime: new Date().toISOString(),
              unreadCount: 0
            };
            fetchedConversations = [tempConv, ...fetchedConversations];
            setActiveChat(tempConv);
          }
        }
        
        setConversations(fetchedConversations);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
        setLoading(false);
      }
    };

    fetchConversations();
  }, [location.state, myId]);


  // Handle Socket Events for Active Chat
  useEffect(() => {
    if (socket && activeChat) {
      socket.emit("join_room", activeChat.roomId);

      const handleMessage = (message) => {
        // Update active chat messages
        if (activeChat && message.roomId === activeChat.roomId) {
          setMessages((prev) => [...prev, message]);
        }

        // Update conversations list
        setConversations((prev) => {
          const updated = [...prev];
          const index = updated.findIndex((c) => c.roomId === message.roomId);
          
          if (index !== -1) {
            // Update existing conversation
            updated[index] = {
              ...updated[index],
              lastMessage: message.message,
              lastMessageTime: message.createdAt
            };
            // Move to top
            const conv = updated.splice(index, 1)[0];
            return [conv, ...updated];
          } else {
             // If we don't have this conversation in list yet, it will be fetched on next reload
             // or we could fetch user info here and add it. For now, just let it be.
             return updated;
          }
        });
      };


      socket.on("receive_message", handleMessage);

      return () => {
        socket.off("receive_message", handleMessage);
      };
    }
  }, [socket, activeChat]);

  // Fetch Messages for Active Chat
  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          const res = await API.get(`/messages/${activeChat.roomId}`);
          setMessages(res.data.data);
          // Mark as read
          await API.patch(`/messages/read/${activeChat.roomId}`);
        } catch (err) {
          console.error("Failed to fetch messages", err);
        }
      };

      fetchMessages();
    }
  }, [activeChat]);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !socket) return;

    const messageData = {
      roomId: activeChat.roomId,
      senderId: myId,
      receiverId: activeChat.partner._id,
      message: newMessage,
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
  };

  const filteredConversations = conversations.filter(conv => 
    conv.partner?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-500">
      
      {/* Sidebar - Conversation List */}
      <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/30 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-800">Messages</h2>
            <button 
              onClick={() => navigate("/counsellors")}
              className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              title="Start New Chat"
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-6 space-y-1">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <button
                key={conv.roomId}
                onClick={() => setActiveChat(conv)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                  activeChat?.roomId === conv.roomId 
                    ? "bg-white shadow-md border-indigo-100 ring-1 ring-indigo-50" 
                    : "hover:bg-white/60 text-slate-600"
                }`}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    activeChat?.roomId === conv.roomId ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}>
                    {conv.partner.fullName.charAt(0)}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="font-bold text-slate-800 truncate">{conv.partner.fullName}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate font-medium">
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-10 px-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="text-slate-300" size={24} />
              </div>
              <p className="text-slate-400 text-sm font-medium mb-6">No conversations found</p>
              <button 
                onClick={() => navigate("/counsellors")}
                className="w-full py-3 bg-white border border-indigo-100 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all text-sm shadow-sm"
              >
                Find Counsellors
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-white ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <header className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {activeChat?.partner?.fullName?.charAt(0)}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 leading-tight md:text-lg">
                    {activeChat?.partner?.fullName}
                  </h3>
                  <div className="flex items-center gap-1.5">

                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-3 text-slate-400">
                <button className="p-2 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all"><Phone size={20} /></button>
                <button className="p-2 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all"><Video size={20} /></button>
                <button className="p-2 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all"><MoreVertical size={20} /></button>
              </div>
            </header>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => {
                  const isMine = msg.senderId._id === myId || msg.senderId === myId;
                  return (
                    <motion.div
                      key={msg._id || idx}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] md:max-w-[70%] ${isMine ? "order-1" : "order-2"}`}>
                        <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
                          isMine 
                            ? "bg-indigo-600 text-white rounded-tr-none" 
                            : "bg-slate-100 text-slate-800 rounded-tl-none"
                        }`}>
                          {msg.message}
                        </div>
                        <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isMine ? "justify-end" : "justify-start"}`}>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMine && (
                            <CheckCheck size={14} className={msg.isRead ? "text-indigo-400" : "text-slate-300"} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={scrollRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 md:p-6 border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3 md:gap-4 bg-slate-50 p-2 md:p-3 rounded-[2rem] border border-slate-200 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100 transition-all duration-300">
                <button type="button" className="p-2 md:p-2.5 text-slate-400 hover:text-indigo-600 transition-colors">
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 font-medium text-sm px-2"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <div className="flex items-center gap-1 pr-1">
                  <button type="button" className="hidden sm:block p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Smile size={20} />
                  </button>
                  <button 
                    type="submit" 
                    className="p-2 md:p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md shadow-indigo-200 active:scale-95 transition-all"
                  >
                    <Send size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/30">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 mb-8 animate-bounce duration-[3000ms]">
              <Send className="text-indigo-500" size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">Start a conversation</h3>
            <p className="max-w-xs text-slate-500 font-medium leading-relaxed mb-8">
              Select a counsellor to begin chatting before you book your session.
            </p>
            <button 
              onClick={() => navigate("/counsellors")}
              className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Find Counsellors
            </button>
          </div>

        )}
      </div>
    </div>
  );
};

export default Messages;
