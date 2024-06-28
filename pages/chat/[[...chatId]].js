import Head from 'next/head';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Chat() {
    const { user } = useUser();
    return <>
        <Head>
            <title>New Chat</title>
        </Head>
        <div className='grid h-screen grid-cols-[260px_1fr]'>
            <div>chat bar</div>
            <div className='flex flex-col bg-gray-600'>
                <div className='flex-1'></div>
                <footer className='bg-gray-800 p-10'>Footer</footer>
            </div>
            {/* {!!user && <Link href="/api/auth/logout">Logout</Link>} */}
        </div>
    </>;
}