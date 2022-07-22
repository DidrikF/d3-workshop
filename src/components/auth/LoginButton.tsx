/* eslint-disable @next/next/no-img-element */
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div>
        <span>Signed in as</span>
        <div className="flex items-center gap-4 my-2">
          {session.user.image && (
            <img
              src={session.user.image}
              width="48"
              height="48"
              alt="profile picture"
            />
          )}
          <span>{session.user.name}</span>
        </div>

        <button className="underline inline-block" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
