/* eslint-disable @next/next/no-img-element */

import { useSession } from "next-auth/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import LoginButton from "../auth/LoginButton";
import { TabName } from "../problems";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

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
        <nav className="flex flex-col w-72 border-blue-900 border-r-2">
          <div className="border-blue-900 border-b-2 p-4 pt-0">
            <NextLink href="/">
              <a className="inline-flex items-end gap-2 hover:cursor-pointer hover:underline">
                <img
                  src="/assets/default_200_percent/200-error-offline.png"
                  width={48}
                  height={48}
                  alt="Logo"
                />
                <span>D3 Workshop</span>
              </a>
            </NextLink>
          </div>

          <ul className="flex-grow p-4 list-none">
            {session?.user && (
              <>
                <Link href="/material">Material</Link>

                <div className="pl-8">
                  <Link href="/material/1-intro">Introduction</Link>
                </div>

                <div className="mt-6">
                  <Link href={`/problems/${TabName.Top10}`} reload>
                    Problems
                  </Link>
                </div>
              </>
            )}
          </ul>

          <div className="p-4">
            <LoginButton />
          </div>
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
  const router = useRouter();

  return (
    <li>
      {!reload ? (
        <NextLink href={href}>
          <a
            className={`underline transition-colors active:text-blue-400 ${
              router.asPath === href ? "text-blue-500" : "hover:text-blue-300"
            }`}
          >
            {children}
          </a>
        </NextLink>
      ) : (
        <a
          href={href}
          className={`underline transition-colors active:text-blue-400 ${
            router.asPath === href ? "text-blue-500" : "hover:text-blue-300"
          }`}
        >
          {children}
        </a>
      )}
    </li>
  );
};
