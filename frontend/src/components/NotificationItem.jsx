import React from "react";
import { Bell } from "lucide-react";

const NotificationItem = ({ message, time }) => {
  return (
    <div className="flex items-start gap-3 p-3 border-b last:border-none hover:bg-gray-50 transition">

      <Bell size={18} className="text-blue-500 mt-1" />

      <div>
        <p className="text-sm">{message}</p>
        <span className="text-xs text-gray-400">{time}</span>
      </div>

    </div>
  );
};

export default NotificationItem;