/* eslint-disable @next/next/no-img-element */

import Head from "next/head";
import NextLink from "next/link";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Workshop about building data visualizations with D3"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-stretch min-h-screen bg-slate-900 text-white font-mono">
        <nav className="w-48 border-blue-900 border-r-2">
          <div className="border-blue-900 border-b-2">
            <NextLink href="/">
              <img
                src="/assets/default_200_percent/200-error-offline.png"
                className="hover:cursor-pointer"
                width={48}
                height={48}
                alt="Logo"
              />
            </NextLink>
          </div>

          <ul>
            <Link href="/workshop">Material</Link>

            <div className="pl-8">
              <Link href="/workshop/1-intro">Introduction</Link>
            </div>

            <Link href="/problems" reload>
              Problems
            </Link>
          </ul>
        </nav>

        <main className="flex-grow p-8">{children}</main>
      </div>
    </>
  );
}

const Link: React.FC<{
  href: string;
  children: React.ReactNode;
  reload?: boolean;
}> = ({ href, children, reload }) => {
  return (
    <li>
      {!reload ? (
        <NextLink href={href}>
          <a className={"active:to-blue-400"}>{children}</a>
        </NextLink>
      ) : (
        <a href={href} className={"active:to-blue-400"}>
          {children}
        </a>
      )}
    </li>
  );
};
