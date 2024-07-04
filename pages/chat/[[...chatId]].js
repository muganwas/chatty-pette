import Head from 'next/head';
import { ChatSidebar } from '../../components/ChatSidebar';
import { Footer } from '../../components/Footer';
import { useState } from 'react';
import { streamReader } from 'openai-edge-stream';
import { v4 as uuid } from 'uuid';
import { Message } from '../../components/Message';

export default function Chat() {
    const [incomingMessage, setincomingMessage] = useState("");
    const [chatMessage, setChatMessage] = useState("");
    const [newChatMessages, setNewChatMessages] = useState([]);
    const [generatingResponse, setGeneratingResponse] = useState(false);
    const onSubmit = async (e) => {
        e.preventDefault();

        setNewChatMessages(prev => {
            const newMessage = [...prev, {
                _id: uuid(),
                role: "user",
                content: chatMessage
            }];
            return newMessage;
        });

        // setChatMessage("");
        setGeneratingResponse(true);
        const response = await fetch("/api/chat/create_new_chat", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ message: chatMessage })
        });
        const json = await response.json();
        console.log("New chat ", json)
        // const response = await fetch('/api/chat/send_message', {
        //     method: 'POST',
        //     headers: {
        //         "content-type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         message: chatMessage
        //     })
        // });
        // const data = response.body;
        // if (!data) {
        //     return;
        // }
        // const reader = data.getReader();
        // await streamReader(reader, (message) => {
        //     setincomingMessage(s => `${s}${message.content}`);
        // });
        setGeneratingResponse(false);
    }

    return <>
        <Head>
            <title>New Chat</title>
        </Head>
        <div className='grid h-screen grid-cols-[260px_1fr]'>
            <ChatSidebar />
            <div className='flex flex-col overflow-hidden bg-gray-600'>
                <div className='flex-1 overflow-scroll text-white'>
                    {newChatMessages.map(message => <Message key={message._id} role={message.role} content={message.content} />)}
                    {!!incomingMessage && <Message role="assistant" content={incomingMessage} />}
                </div>
                <Footer generatingResponse={generatingResponse} message={chatMessage} setMessage={setChatMessage} onSubmit={onSubmit} />
            </div>
        </div>
    </>;
}