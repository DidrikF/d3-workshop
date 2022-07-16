import { Typography } from "@mui/material";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Suspense } from "react";

import { trpc } from "../utils/trpc";

const TRexGame = dynamic(() => import("../components/t-rex-game"), {
  ssr: false,
  suspense: true,
});

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

      <Typography component="h1" variant="h4">
        Welcome to the D3 Workshop!
      </Typography>
    </>
  );
};

export default Home;
