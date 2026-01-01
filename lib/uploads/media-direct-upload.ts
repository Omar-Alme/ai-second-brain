"use client";

import {
  createSignedMediaUploadUrlAction,
  finalizeMediaUploadAction,
} from "@/app/workspace/media/actions";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

/**
 * Upload a file directly from the browser to Supabase Storage (signed upload URL),
 * then persist the DB record via a server action.
 */
export async function uploadMediaDirect(file: File) {
  const signed = await createSignedMediaUploadUrlAction({
    filename: file.name,
    mimeType: file.type,
    size: file.size,
  });

  const supabase = getSupabaseBrowserClient();
  const { error: uploadError } = await supabase.storage
    .from(signed.bucket)
    .uploadToSignedUrl(signed.objectPath, signed.token, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  return await finalizeMediaUploadAction({
    bucket: signed.bucket,
    objectPath: signed.objectPath,
    name: signed.name,
    mimeType: signed.mimeType,
    size: signed.size,
  });
}


