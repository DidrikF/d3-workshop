/* eslint-disable @next/next/no-img-element */
import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";

export default function AuthStatus() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-start">
      {session?.user ? (
        <>
          <div className="flex items-center gap-4 my-2">
            {session.user.image && (
              <img
                src={session.user.image}
                width="32"
                height="32"
                alt="profile picture"
                className="rounded-full"
              />
            )}
            <span className="text-sm">{session.user.name}</span>
          </div>

          <button className="underline inline-block" onClick={() => signOut()}>
            Sign out
          </button>
        </>
      ) : (
        <button className="underline inline-block" onClick={() => signIn()}>
          Sign in
        </button>
      )}
    </div>
  );
}
