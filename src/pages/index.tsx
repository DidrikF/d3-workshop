import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>D3 Workshop</title>
        <meta
          name="description"
          content="Workshop about building data visualizations with D3"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-4xl">Welcome to the D3 Workshop!</h1>

      {!session?.user ? (
        <>
          <p className="my-4 ">Sign in to access the material and problems.</p>
          <button
            className="bg-sky-500 highlight-white/20 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg flex items-center justify-center"
            onClick={() => signIn()}
          >
            Sign in
          </button>
        </>
      ) : (
        <p className="my-4">
          Navigate the course using the side navigation. Happy hacking 🤓
        </p>
      )}
    </>
  );
};

export default Home;
