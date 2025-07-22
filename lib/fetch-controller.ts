"use client";

import { BACKEND_API_URL } from "@/constants/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "./auth-client";

const API_URL = BACKEND_API_URL;

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type RequestMode = "cors" | "no-cors" | "same-origin" | "navigate";

interface RequestConfig {
  mode?: RequestMode;
  bodyType?: "json" | "formdata";
  endpoint?: string;
  exact?: boolean;
  queryKey?: string[];
  method?: RequestMethod;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  options?: Record<string, any>;
  enabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: {
    name: string;
    message: string;
    cause?: any;
    stack?: string;
  }) => void;
  baseUrl?: string;
  queryString?: string;
  invalidateKeys?: { queryKey: string[]; exact?: boolean }[];
}

export default function useApiRequest<T = any>({
  bodyType = "json",
  endpoint,
  exact = true,
  mode = "cors",
  queryKey = [],
  method = "GET",
  params,
  headers,
  options,
  enabled = true,
  onSuccess,
  onError,
  baseUrl,
  queryString,
  invalidateKeys,
}: RequestConfig) {
  const queryClient = useQueryClient();
  const BASE_URL = baseUrl ?? API_URL;
  const cookies = authClient.getCookie();
  const fetchData = async (
    body: any = null
  ): Promise<{
    data?: T;
    error?: string;
    status: number;
  }> => {
    const search = queryString ?? new URLSearchParams(params).toString();
    const url = `${BASE_URL}${endpoint ?? ""}${search ? `?${search}` : ""}`;
    
    const config: RequestInit = {
      mode,
      method,
      headers: headers ?? {
        "Content-Type": "application/json",
        "Cookie": cookies,
      },
      credentials: "include",
      ...options,
    };

    if (body && method !== "GET" && bodyType === "json") {
      config.body = JSON.stringify(body);
    }

    if (bodyType === "formdata") {
      config.body = body;
    }

    try {
      const response = await fetch(url, config);
      const statusCode = response.status;

      if (statusCode === 204) {
        return { data: null as any, status: statusCode };
      }

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");

      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        throw new Error(`${JSON.stringify(data?.error || data)}`, {
          cause: statusCode,
        });
      }

      return { data, status: statusCode };
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error in fetchData:", err.message);
        return {
          error: err?.message ?? JSON.stringify(err),
          status: Number(err?.cause) || 500,
        };
      }
      return { error: "Internal error", status: 500 };
    }
  };

  // Handle GET query
  if (enabled && method === "GET") {
    const query = useQuery({
      queryKey,
      queryFn: () => fetchData(),
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    });
    console.log(query.isError);
    return {
      data: query.data?.data as T,
      error: query.error,
      isPending: query.isPending,
      isError: query.isError,
      isSuccess: query.isSuccess,
    };
  }

  // Handle mutation
  const {
    data,
    error,
    mutate,
    mutateAsync,
    isPending,
    isSuccess,
    isError,
    reset,
  } = useMutation({
    mutationFn: async (data?: Record<string, any> | FormData) => {
      const response = await fetchData(data);
      return response;
    },
    onSuccess: async ({ status }) => {
      if ([200, 201].includes(status)) {
        // Invalidate base key
        if (queryKey.length) queryClient.invalidateQueries({ queryKey, exact });

        // Invalidate extra keys
        if (invalidateKeys?.length) {
          for (const k of invalidateKeys) {
            queryClient.invalidateQueries(k);
          }
        }
        onSuccess?.();
      }
    },
    onError: ({ message, name, cause, stack }) => {
      console.log({ message, name, cause, stack });
      onError?.({ message, name, cause, stack });
    },
  });

  return {
    data: data?.data as T,
    error,
    isPending,
    isError,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
  };
}
