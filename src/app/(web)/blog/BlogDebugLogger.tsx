"use client";

import { useEffect } from "react";

export default function BlogDebugLogger({ posts }: { posts: unknown }) {
  useEffect(() => {
    console.log("[Blog] posts recibidos del backend:", posts);
  }, [posts]);

  return null;
}
