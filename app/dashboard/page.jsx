"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StreamView from "../components/StreamView";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin"); // default next-auth signin
    }
  }, [status, router]);

  if (status === "loading") return <p className="text-white">Loading...</p>;

  return <StreamView creatorId={session?.user?.id} playVideo={true} />;
}
