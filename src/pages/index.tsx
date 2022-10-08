import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import S3 from 'aws-sdk/clients/s3';
import { sign } from "crypto";
import Link from "next/link";

export const Header = () => {
  const { data: sessionData } = useSession();
  return <div className="flex flex-col bg-gray-200">
    <div className="flex flex-row justify-end h-12 p-4 px-20">
      <>
        {sessionData && (
          <span className="text-2xl text-blue-500">
            {sessionData?.user?.name}
          </span>
        )}
        {!sessionData && (
          <button onClick={() => signIn()} className="text-2xl text-blue-500">
            Sign in
          </button>
        )}
      </>
    </div>
    <h1 className="font-serif text-center text-5xl font-extrabold leading-normal text-gray-600 md:text-[7rem]">
      <Link href="/"><a>Tiers With <span className="text-sky-500 font-sans">Friends</span></a></Link>
    </h1>
  </div>;
}

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  const topImages = trpc.frontPage.getImages.useQuery().data ?? [];
  console.log(topImages.length);

  return (
    <>
      <Head>
        <title>Tiers With Friends</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="bg-gray-200">
        <div className="w-3/4 mx-auto flex min-h-screen flex-col items-center justify-begin p-4 space-y-10">

          <h2 className="font-bold md:text-[3rem] text-gray-600">Suggested Tierlists</h2>
          <div className="flex flex-row justify-evenly basis-auto space-x-5 flex-nowrap bg-sky-500 bg-opacity-50">
            {topImages.map(() => {
              return <img src="example1.png" alt="image 1" className="w-full scale-90" />
            })}
          </div>
          <div className="flex flex-row space-x-10">
            <h2 className="font-bold md:text-[3rem] text-gray-600">Join a tierlist:</h2>
            <input type="text" placeholder="enter a join code here!"
              className="font-semibold bg-gray-300 rounded-lg md:text-[2rem] text-sky-500 border-sky-600 border-2
            placeholder:text-gray-600 placeholder:font-normal placeholder:md:text-[2rem]"></input>
          </div>
          <AuthShowcase />
        </div>
      </main>
    </>
  );


};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery();

  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sessionData && (
        <p className="text-2xl text-blue-500">
          Logged in as {sessionData?.user?.name}. <Link href="/lists"><a className="underline">My tier lists</a></Link>
        </p>
      )}
      {secretMessage && (
        <p className="text-2xl text-blue-500">{secretMessage}</p>
      )}
      <button
        className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
