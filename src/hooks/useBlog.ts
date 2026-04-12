import useSWR, { mutate as globalMutate } from "swr";
import { BlogPost, CreateBlogPostData, UpdateBlogPostData } from "@/types/blog";
import { BlogService } from "@/services/blog.service";
import { HttpClient } from "@/services/http-client";
import { ApiError } from "@/interfaces/api-response";

const BLOG_KEY = "/api/blog/all";

const blogService = new BlogService(new HttpClient());

export const useBlog = () => {
  const {
    data: posts = [],
    mutate,
    error: swrError,
    isValidating,
  } = useSWR<BlogPost[]>(
    BLOG_KEY,
    async () => {
      const response = await blogService.getAll();
      return Array.isArray(response.data) ? response.data : [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    }
  );

  const handleError = (err: unknown): ApiError => {
    return err as ApiError;
  };

  const getPostById = async (id: string): Promise<BlogPost | null> => {
    try {
      const response = await blogService.getById(id);
      return response.data;
    } catch (err) {
      handleError(err);
      return null;
    }
  };

  const createPost = async (data: CreateBlogPostData): Promise<BlogPost> => {
    try {
      const response = await blogService.create(data);
      await mutate([...posts, response.data]);
      return response.data;
    } catch (err) {
      mutate(posts, false);
      throw handleError(err);
    }
  };

  const updatePost = async (
    id: string,
    data: UpdateBlogPostData
  ): Promise<BlogPost> => {
    try {
      const response = await blogService.update(id, data);
      await mutate();
      return response.data;
    } catch (err) {
      mutate(posts, false);
      throw handleError(err);
    }
  };

  const deletePost = async (id: string): Promise<void> => {
    try {
      const optimistic = posts.filter((p) => p.id !== id);
      mutate(optimistic, false);
      await blogService.delete(id);
      await mutate();
    } catch (err) {
      mutate(posts, false);
      throw handleError(err);
    }
  };

  const publishPost = async (id: string): Promise<BlogPost> => {
    try {
      const response = await blogService.publish(id);
      await mutate();
      fetch("/api/revalidate/blog", { method: "POST" }).catch(() => {});
      return response.data;
    } catch (err) {
      throw handleError(err);
    }
  };

  const unpublishPost = async (id: string): Promise<BlogPost> => {
    try {
      const response = await blogService.unpublish(id);
      await mutate();
      fetch("/api/revalidate/blog", { method: "POST" }).catch(() => {});
      return response.data;
    } catch (err) {
      throw handleError(err);
    }
  };

  const refreshPosts = async () => {
    await mutate();
  };

  return {
    posts,
    loading: isValidating,
    error: swrError,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
    refreshPosts,
  };
};

export const revalidateBlog = () => globalMutate(BLOG_KEY);
