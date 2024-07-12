import { faMessage, faPlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ChatSidebar = ({ chatId }) => {
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
    }, [chatId]);

    return <div className="flex flex-col overflow-hidden bg-gray-900 text-white">
        <Link className="side-menu-item bg-emerald-500 hover:bg-emerald-600" href="/chat">
            <FontAwesomeIcon icon={faPlus} />
            <span>New Chat</span></Link>
        <div className="flex-1 overflow-auto bg-gray-950">
            {!!chatList && chatList.map(chat =>
                <Link className={`side-menu-item ${chatId === chat._id ? "bg-gray-700 hover:bg-gray-700" : ""}`} key={chat._id} href={`/chat/${chat._id}`}>
                    <FontAwesomeIcon icon={faMessage} />
                    <span title={chat.title} className="overflow-hidden text-ellipsis whitespace-nowrap">{chat.title}</span>
                </Link>
            )}
        </div>
        <Link className="side-menu-item" href="/api/auth/logout">
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Logout</span>
        </Link>
    </div>
}