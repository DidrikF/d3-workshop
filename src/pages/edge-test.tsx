import { NextConfig, NextPageContext, PageConfig } from "next";

export async function getServerSideProps({ req, res }: NextPageContext) {
  return {
    props: {
      name: "Didrik",
    },
  };
}

const SsrTest = ({ name }: { name: string }) => {
  return <div>Hello {name}</div>;
};

export default SsrTest;

export const config: NextConfig = {
  runtime: "experimental-edge",
};
