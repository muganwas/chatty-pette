import Link from "next/link";
import { useEffect, useState } from "react";

export const ChatSidebar = () => {
    const [chatList, setChatList] = useState([]);
    useEffect(() => {
        const loadChatList = async () => {
            const response = await fetch("/api/chat/get_chat_list", {
                method: "POST"
            });
            const json = await response.json();
            json.chats && setChatList(json.chats);
        };
        loadChatList();
    }, [])
    return <div className="flex flex-col overflow-hidden bg-gray-900 text-white">
        <Link className="side-menu-item" href="/chat">New Chat</Link>
        <div className="flex flex-1 overflow-auto bg-gray-950">
            {!!chatList && chatList.map(chat => <Link className="side-menu-item" key={chat._id} href={`/chat/${chat.id}`}>{chat.title}</Link>)}
        </div>
        <Link className="side-menu-item" href="/api/auth/logout">Logout</Link>
    </div>
}