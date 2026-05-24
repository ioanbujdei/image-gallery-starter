import type { ImageProps } from "./types";

export default async function getBase64ImageUrl(
  image: ImageProps
): Promise<string> {
  const response = await fetch(
    // FIX: v${version} moved AFTER the formatting rules
    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_jpg,w_8,q_70/${image.version ? `v${image.version}/` : ''}${image.public_id}.${image.format}`
  );
  const buffer = await response.arrayBuffer();
  const data = Buffer.from(buffer).toString("base64");
  return `data:image/jpeg;base64,${data}`;
}
