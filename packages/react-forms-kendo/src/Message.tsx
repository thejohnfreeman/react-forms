export function errorsToMessage(errors: (string | React.ReactNode)[]): string {
  return errors
    .filter((error: React.ReactNode) => typeof error === 'string')
    .join('\n')
}
