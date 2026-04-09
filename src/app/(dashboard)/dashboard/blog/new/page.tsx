"use client";

import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { useBlog } from "@/hooks/useBlog";
import { BlogPostForm } from "@/components/BlogPostForm";
import Loader from "@/components/Loader";
import { toast } from "@/hooks/use-Toast";
import { useTranslation } from "@/hooks/useTranslation";
import { CreateBlogPostData } from "@/types/blog";
import { useState } from "react";

export default function NewBlogPostPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { createPost } = useBlog();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateBlogPostData) => {
    try {
      setIsLoading(true);
      await createPost(data);
      toast({ title: t("blog.createSuccess"), variant: "default" });
      router.push("/dashboard/blog");
    } catch {
      toast({ title: t("blog.createError"), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loader text={t("common.saving")} />}

      <div className="border-b bg-playGrey">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-px bg-playBlueLight" />
            <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
              <BookOpen className="h-7 w-7 text-brand-primary" />
              {t("blog.newPost")}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white border border-playBlueLight/20 rounded-xl p-8">
          <BlogPostForm
            onSubmit={handleSubmit}
            onCancel={() => router.push("/dashboard/blog")}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
