"use client";

import { uploadMediaFileAction } from "@/app/workspace/media/actions";

/**
 * Uploads an image for use inside Notes (Tiptap) and returns the public URL.
 * Uses the existing Supabase-backed server action.
 */
export async function uploadNoteImage(
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string> {
  if (!file) throw new Error("No file provided");
  if (abortSignal?.aborted) throw new Error("Upload cancelled");

  // We don't have streaming progress from the server action, but we can provide UX progress milestones.
  onProgress?.({ progress: 5 });

  const formData = new FormData();
  formData.set("file", file);

  onProgress?.({ progress: 20 });
  const created = await uploadMediaFileAction(formData);
  onProgress?.({ progress: 95 });

  if (!created?.url) throw new Error("Upload failed: No URL returned");
  if (abortSignal?.aborted) throw new Error("Upload cancelled");

  onProgress?.({ progress: 100 });
  return created.url;
}


