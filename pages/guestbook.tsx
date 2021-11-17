const Guestbook = () => {
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const inputEl = useRef(null);
  const { data: entries } = useSWR("/api/guestbook", fetcher);

  const leaveEntry = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/guestbook", {
      body: JSON.stringify({
        body: inputEl.current.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();
    if (error) {
      console.error({ error });
      return;
    }

    inputEl.current.value = "";
    mutate("/api/guestbook");
  };

  if (session)
    return (
      <form onSubmit={leaveEntry}>
        <input ref={inputEl} type="text" />
        <button>Submit</button>
      </form>
    );

  return (
    <div>
      <a
        href="/api/auth/signin/github"
        onClick={(e) => {
          e.preventDefault();
          signIn("github");
        }}
      >
        Login
      </a>
    </div>
  );
};

export default Guestbook;

import { useRef } from "react";
import useSWR, { useSWRConfig } from "swr";
import { signIn, useSession } from "next-auth/react";

import fetcher from "@/lib/fetcher";
