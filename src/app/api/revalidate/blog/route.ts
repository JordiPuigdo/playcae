import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Called from the dashboard after publishing/unpublishing a blog post.
// Invalidates all blog-related fetch cache so pages update immediately.
export async function POST() {
  revalidateTag("blog");
  return NextResponse.json({ revalidated: true });
}
