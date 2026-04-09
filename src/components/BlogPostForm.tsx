"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { BlogPost, BlogStatus, CreateBlogPostData } from "@/types/blog";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { X } from "lucide-react";

interface BlogPostFormProps {
  post?: BlogPost;
  onSubmit: (data: CreateBlogPostData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function BlogPostForm({
  post,
  onSubmit,
  onCancel,
  isLoading,
}: BlogPostFormProps) {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!post);
  const [description, setDescription] = useState(post?.description ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [author, setAuthor] = useState(
    post?.author ?? user?.name ?? "PlayCAE"
  );
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [status, setStatus] = useState<BlogStatus>(post?.status ?? "Draft");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);

  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(slugify(title));
    }
  }, [title, slugManuallyEdited]);

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      slug,
      description,
      content,
      author,
      tags,
      coverImage: coverImage || undefined,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div className="space-y-1.5">
        <Label htmlFor="title">{t("blog.form.title")} *</Label>
        <Input
          id="title"
          uppercase={false}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("blog.form.titlePlaceholder")}
          required
        />
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <Label htmlFor="slug">{t("blog.form.slug")} *</Label>
        <Input
          id="slug"
          uppercase={false}
          value={slug}
          onChange={(e) => {
            setSlugManuallyEdited(true);
            setSlug(slugify(e.target.value));
          }}
          placeholder="mi-articulo"
          required
        />
        <p className="text-xs text-brand-primary/50">
          /blog/{slug || "mi-articulo"}
        </p>
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <Label htmlFor="description">{t("blog.form.description")} *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("blog.form.descriptionPlaceholder")}
          rows={3}
          required
        />
      </div>

      {/* Contenido */}
      <div className="space-y-1.5">
        <Label htmlFor="content">{t("blog.form.content")} *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("blog.form.contentPlaceholder")}
          rows={12}
          className="font-mono text-sm"
          required
        />
        <p className="text-xs text-brand-primary/50">{t("blog.form.markdownHint")}</p>
      </div>

      {/* Autor + Imagen de portada en fila */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="author">{t("blog.form.author")} *</Label>
          <Input
            id="author"
            uppercase={false}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="PlayCAE"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="coverImage">{t("blog.form.coverImage")}</Label>
          <Input
            id="coverImage"
            uppercase={false}
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="/assets/blog/portada.jpg"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <Label>{t("blog.form.tags")}</Label>
        <div className="flex gap-2">
          <Input
            uppercase={false}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={t("blog.form.tagsPlaceholder")}
          />
          <Button type="button" variant="outline" onClick={addTag}>
            {t("common.add")}
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs bg-playBlueLight/10 text-brand-primary rounded-full px-3 py-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-brand-secondary transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Estado */}
      <div className="space-y-1.5">
        <Label htmlFor="status">{t("blog.form.status")}</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as BlogStatus)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="Draft">{t("blog.status.draft")}</option>
          <option value="Published">{t("blog.status.published")}</option>
          <option value="Archived">{t("blog.status.archived")}</option>
        </select>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          variant="submit"
          className="bg-playOrange hover:bg-playOrange/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? t("common.saving") : t("common.save")}
        </Button>
      </div>
    </form>
  );
}
