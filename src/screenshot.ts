import * as CaptureWebsite from 'capture-website'

export function capture(url: string): Promise<Buffer> {
  return CaptureWebsite.buffer(url, { width: 1920, height: 1080, delay: 5, scaleFactor: 1 });
}