"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BlogPost, BlogStatus } from "@/types/blog";
import { useTranslation } from "@/hooks/useTranslation";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface BlogTableProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
}

const statusVariant: Record<
  BlogStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Published: "default",
  Draft: "outline",
  Archived: "destructive",
};

const statusTranslationKey: Record<
  BlogStatus,
  "blog.status.draft" | "blog.status.published" | "blog.status.archived"
> = {
  Draft: "blog.status.draft",
  Published: "blog.status.published",
  Archived: "blog.status.archived",
};

export function BlogTable({
  posts,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
}: BlogTableProps) {
  const { t } = useTranslation();

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-brand-primary/50">
        {t("blog.noPosts")}
      </div>
    );
  }

  return (
    <div className="bg-white border border-playBlueLight/20 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-playBlueLight/20">
          <tr>
            <th className="text-left px-6 py-3 font-semibold text-brand-primary">
              {t("blog.table.title")}
            </th>
            <th className="text-left px-6 py-3 font-semibold text-brand-primary">
              {t("blog.table.status")}
            </th>
            <th className="text-left px-6 py-3 font-semibold text-brand-primary">
              {t("blog.table.tags")}
            </th>
            <th className="text-left px-6 py-3 font-semibold text-brand-primary">
              {t("blog.table.date")}
            </th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-playBlueLight/10">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-brand-primary">{post.title}</p>
                  <p className="text-xs text-brand-primary/50 mt-0.5">
                    /{post.slug}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge variant={statusVariant[post.status]}>
                  {t(statusTranslationKey[post.status])}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-playBlueLight/10 text-brand-primary rounded-full px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-brand-primary/40">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-brand-primary/60 text-xs">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("es-ES")
                  : new Date(post.createdAt).toLocaleDateString("es-ES")}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  {post.status === "Published" ? (
                    <button
                      onClick={() => onUnpublish(post.id)}
                      title={t("blog.actions.unpublish")}
                      className="p-1.5 rounded-lg text-brand-primary/50 hover:text-brand-primary hover:bg-gray-100 transition-colors"
                    >
                      <EyeOff className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onPublish(post.id)}
                      title={t("blog.actions.publish")}
                      className="p-1.5 rounded-lg text-playGreen hover:text-playGreen/80 hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(post)}
                    title={t("common.edit")}
                    className="p-1.5 rounded-lg text-brand-primary/50 hover:text-brand-primary hover:bg-gray-100 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(post.id)}
                    title={t("common.delete")}
                    className="p-1.5 rounded-lg text-brand-secondary/60 hover:text-brand-secondary hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
