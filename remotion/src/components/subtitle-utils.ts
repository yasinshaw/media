const TRAILING_PUNCTUATION = /[。！？.!?\s]+$/

export function cleanSubtitleText(text: string): string {
  return text.replace(TRAILING_PUNCTUATION, '')
}
