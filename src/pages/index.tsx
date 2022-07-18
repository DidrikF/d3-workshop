import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
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

      <h1>Welcome to the D3 Workshop!</h1>
    </>
  );
};

export default Home;
