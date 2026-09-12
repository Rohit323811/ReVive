/**
 * Client-side image preparation before upload.
 *
 * Camera photos are 3–8 MB; base64 inflates them another ~33% and Vercel
 * rejects request bodies over ~4.5 MB. Downscaling to a 1024 px long edge and
 * re-encoding as JPEG keeps payloads well under 1 MB — plenty for object
 * recognition — and strips EXIF metadata as a bonus.
 */

const MAX_EDGE = 1024
const JPEG_QUALITY = 0.85

export interface PreparedImage {
  imageBase64: string
  mimeType: string
}

function base64FromBytes(bytes: Uint8Array): string {
  let binary = ''
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  return btoa(binary)
}

function drawScaled(
  source: ImageBitmap | HTMLImageElement,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')
  ctx.drawImage(source, 0, 0, width, height)
  return canvas
}

function canvasToJpeg(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Re-encode failed'))),
      'image/jpeg',
      JPEG_QUALITY,
    )
  })
}

async function blobToPrepared(blob: Blob): Promise<PreparedImage> {
  const buf = await blob.arrayBuffer()
  return { imageBase64: base64FromBytes(new Uint8Array(buf)), mimeType: 'image/jpeg' }
}

/**
 * Decode, downscale and re-encode any supported image (JPEG/PNG/HEIC in
 * Safari) to a compact base64 JPEG.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  // Fast path: createImageBitmap decodes off the main thread.
  if ('createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file)
      const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
      const w = Math.max(1, Math.round(bitmap.width * scale))
      const h = Math.max(1, Math.round(bitmap.height * scale))
      const canvas = drawScaled(bitmap, w, h)
      bitmap.close()
      return await blobToPrepared(await canvasToJpeg(canvas))
    } catch {
      /* fall through to the <img> path */
    }
  }

  // Fallback: decode via an <img> element (covers Safari HEIC, older browsers).
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('Could not decode image'))
      el.src = url
    })
    const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight))
    const w = Math.max(1, Math.round(img.naturalWidth * scale))
    const h = Math.max(1, Math.round(img.naturalHeight * scale))
    const canvas = drawScaled(img, w, h)
    return await blobToPrepared(await canvasToJpeg(canvas))
  } finally {
    URL.revokeObjectURL(url)
  }
}
