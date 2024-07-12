import Head from 'next/head';
import { ChatSidebar } from '../../components/ChatSidebar';
import { Footer } from '../../components/Footer';
import { use, useEffect, useState } from 'react';
import { streamReader } from 'openai-edge-stream';
import { v4 as uuid } from 'uuid';
import { Message } from '../../components/Message';
import { useRouter } from 'next/router';
import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default function Chat({ chatId, title, messages = [] }) {
    const [newChatId, setNewChatId] = useState();
    const [incomingMessage, setincomingMessage] = useState("");
    const [chatMessage, setChatMessage] = useState("");
    const [newChatMessages, setNewChatMessages] = useState([]);
    const [fullMessage, setFullMessage] = useState("");
    const [generatingResponse, setGeneratingResponse] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!generatingResponse && fullMessage) {
            setNewChatMessages(prev => [...prev, { _id: uuid(), role: "assistant", content: fullMessage }]);
            setFullMessage("");
        }
    }, [generatingResponse, fullMessage]);

    useEffect(() => {
        setNewChatMessages([]);
        setNewChatId(null);
    }, [chatId]);

    useEffect(() => {
        if (!generatingResponse && newChatId) {
            setNewChatId(null);
            router.push(`/chat/${newChatId}`);
        }
    }, [newChatId, generatingResponse, router]);

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

        setGeneratingResponse(true);
        const response = await fetch('/api/chat/send_message', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                message: chatMessage,
                chatId
            })
        });
        const data = response.body;
        if (!data) {
            return;
        }
        const reader = data.getReader();
        let content = "";
        await streamReader(reader, (message) => {

            if (message.event === "newChatId") {
                setChatMessage("");
                setNewChatId(message.content);
            } else {
                setincomingMessage(s => `${s}${message.content}`);
                content = content + message.content;
            }
        });
        setFullMessage(content);
        setincomingMessage("");
        setGeneratingResponse(false);
    }

    const allMessages = [...messages, ...newChatMessages];

    return <>
        <Head>
            <title>New Chat</title>
        </Head>
        <div className='grid h-screen grid-cols-[260px_1fr]'>
            <ChatSidebar chatId={chatId} />
            <div className='flex flex-col overflow-hidden bg-gray-600'>
                <div className='flex-1 overflow-scroll text-white'>
                    {allMessages.map(message => <Message key={message._id} role={message.role} content={message.content} />)}
                    {!!incomingMessage && <Message role="assistant" content={incomingMessage} />}
                </div>
                <Footer generatingResponse={generatingResponse} message={chatMessage} setMessage={setChatMessage} onSubmit={onSubmit} />
            </div>
        </div>
    </>;
}

export const getServerSideProps = async (ctx) => {
    const chatId = ctx?.params?.chatId?.[0] || null;
    if (chatId) {
        const { user } = await getSession(ctx.req, ctx.res);
        const client = await clientPromise;
        const db = client.db("ChattyPette");
        const chat = await db.collection("chats").findOne({
            userId: user.sub,
            _id: new ObjectId(chatId)
        });
        return {
            props: {
                chatId, title: chat.title, messages: chat.messages.map(message => ({
                    ...message,
                    _id: uuid()
                }))
            }
        };
    }
    return { props: {} };
}