/* eslint-disable @next/next/no-img-element */

import { useSession } from "next-auth/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import AuthStatus from "../auth/AuthStatus";
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

      <div className="flex h-screen relative overflow-auto">
        <nav className="h-screen sticky top-0 flex flex-col w-72 border-slate-700 border-r-[1px] overflow-y-auto">
          <div className="p-4 pt-0 border-slate-700 border-b-[1px]">
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

          <div className="p-4 flex-grow">
            <NavSectionHeading>Material</NavSectionHeading>
            <NavSection>
              <Link href="/material/1-intro">Introduction</Link>
              <Link href="/material/10-visx">Visx example</Link>
            </NavSection>

            {session?.user && (
              <>
                <NavSectionHeading>Problems</NavSectionHeading>
                <NavSection>
                  <Link
                    href={`/problems/${TabName.Top10}`}
                    match={(currentPath) => /\/problems.*/.test(currentPath)}
                    reload
                  >
                    Problem sets
                  </Link>
                </NavSection>

                <NavSectionHeading>Solutions</NavSectionHeading>
                <NavSection>
                  <Link
                    href={`/solutions/${TabName.Top10}`}
                    match={(currentPath) => /\/solutions.*/.test(currentPath)}
                    reload
                  >
                    Problem solutions
                  </Link>
                </NavSection>
              </>
            )}
          </div>

          <div className="p-4">
            <AuthStatus />
          </div>
        </nav>

        <div className="flex-grow">
          <main className="max-w-6xl mx-auto p-4">{children}</main>
        </div>
      </div>
    </>
  );
}

const NavSectionHeading: React.FC<React.PropsWithChildren> = ({ children }) => (
  <h5 className="text-lg text-slate-500">{children}</h5>
);

const NavSection: React.FC<React.PropsWithChildren> = ({ children }) => (
  <ul className="list-none m-0 mb-6">{children}</ul>
);

const Link: React.FC<{
  href: string;
  match?: (currentPath: string) => boolean;
  children: React.ReactNode;
  reload?: boolean;
}> = ({ href, match, children, reload }) => {
  const router = useRouter();

  const isActive = match ? match(router.asPath) : router.asPath === href;

  return (
    <li>
      {!reload ? (
        <NextLink href={href}>
          <a
            className={`underline transition-colors active:text-blue-400 ${
              isActive ? "text-blue-500" : "hover:text-blue-300"
            }`}
          >
            {children}
          </a>
        </NextLink>
      ) : (
        <a
          href={href}
          className={`underline transition-colors active:text-blue-400 ${
            isActive ? "text-blue-500" : "hover:text-blue-300"
          }`}
        >
          {children}
        </a>
      )}
    </li>
  );
};
