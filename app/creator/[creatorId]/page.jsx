"use client";

import { use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StreamView from "@/app/components/StreamView";

export default function CreatorPage({ params }) {
  const { creatorId } = use(params); // ✅ unwrap params safely
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p className="text-white">Loading...</p>;

  if (status === "unauthenticated") {
    router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`);
    return null;
  }

  return <StreamView creatorId={creatorId} playVideo={false} />;
}
