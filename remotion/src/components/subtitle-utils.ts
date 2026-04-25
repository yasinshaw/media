const REMOVED_PUNCTUATION = /[，,。,.、；;：:！!]/g

export function cleanSubtitleText(text: string): string {
  return text.replace(REMOVED_PUNCTUATION, '')
}
