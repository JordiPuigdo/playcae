"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Plus } from "lucide-react";
import { useBlog } from "@/hooks/useBlog";
import { BlogTable } from "@/components/BlogTable";
import { Button } from "@/components/ui/Button";
import Loader from "@/components/Loader";
import { toast } from "@/hooks/use-Toast";
import { useTranslation } from "@/hooks/useTranslation";
import { BlogPost } from "@/types/blog";

export default function BlogManagementPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { posts, loading, deletePost, publishPost, unpublishPost } = useBlog();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleEdit = (post: BlogPost) => {
    router.push(`/dashboard/blog/${post.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("blog.confirmDelete"))) return;
    try {
      setProcessingId(id);
      await deletePost(id);
      toast({ title: t("blog.deleteSuccess"), variant: "default" });
    } catch {
      toast({ title: t("blog.deleteError"), variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      setProcessingId(id);
      await publishPost(id);
      toast({ title: t("blog.publishSuccess"), variant: "default" });
    } catch {
      toast({ title: t("blog.publishError"), variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      setProcessingId(id);
      await unpublishPost(id);
      toast({ title: t("blog.unpublishSuccess"), variant: "default" });
    } catch {
      toast({ title: t("blog.unpublishError"), variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      {(loading || processingId) && <Loader text={t("common.loading")} />}

      <div className="border-b bg-playGrey">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-px bg-playBlueLight" />
            <div className="flex w-full justify-between items-center">
              <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
                <BookOpen className="h-7 w-7 text-brand-primary" />
                {t("blog.title")}
              </h1>
              <Button
                onClick={() => router.push("/dashboard/blog/new")}
                className="flex items-center bg-playOrange hover:bg-playOrange/90 text-white"
                variant="submit"
              >
                <Plus className="h-4 w-4 mr-1" />
                {t("blog.newPost")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <BlogTable
          posts={posts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
        />
      </div>
    </div>
  );
}
