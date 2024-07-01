import Head from 'next/head';
import { ChatSidebar } from '../../components/ChatSidebar';
import { Footer } from '../../components/Footer';

export default function Chat() {
    return <>
        <Head>
            <title>New Chat</title>
        </Head>
        <div className='grid h-screen grid-cols-[260px_1fr]'>
            <ChatSidebar />
            <div className='flex flex-col bg-gray-600'>
                <div className='flex-1'></div>
                <Footer />
            </div>
        </div>
    </>;
}