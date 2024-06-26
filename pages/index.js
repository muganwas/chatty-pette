import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return <div>
    <Head>
      <title>Welcome to the ChatGPT starter</title>
    </Head>
    <h1>Welcome to NextJs & ChatGPT starter</h1>
    <Link href="/api/auth/login">Login</Link>
  </div>;
}