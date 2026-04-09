"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { BookOpen } from "lucide-react";
import { useBlog } from "@/hooks/useBlog";
import { BlogPostForm } from "@/components/BlogPostForm";
import Loader from "@/components/Loader";
import { toast } from "@/hooks/use-Toast";
import { useTranslation } from "@/hooks/useTranslation";
import { BlogPost, CreateBlogPostData } from "@/types/blog";

export default function EditBlogPostPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { getPostById, updatePost } = useBlog();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [fetching, setFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getPostById(id);
      setPost(data);
      setFetching(false);
    };
    load();
  }, [id]);

  const handleSubmit = async (data: CreateBlogPostData) => {
    try {
      setIsLoading(true);
      await updatePost(id, data);
      toast({ title: t("blog.updateSuccess"), variant: "default" });
      router.push("/dashboard/blog");
    } catch {
      toast({ title: t("blog.updateError"), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching) {
    return <Loader text={t("common.loading")} />;
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-64 text-brand-primary/50">
        {t("blog.postNotFound")}
      </div>
    );
  }

  return (
    <div>
      {isLoading && <Loader text={t("common.saving")} />}

      <div className="border-b bg-playGrey">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-px bg-playBlueLight" />
            <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
              <BookOpen className="h-7 w-7 text-brand-primary" />
              {t("blog.editPost")}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white border border-playBlueLight/20 rounded-xl p-8">
          <BlogPostForm
            post={post}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/dashboard/blog")}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
