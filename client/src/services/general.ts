export const expandShortenedUrl = (longUrl: string): Promise<string> =>
  fetch(longUrl, { method: 'HEAD', redirect: 'follow' }).then(response => response.url)
