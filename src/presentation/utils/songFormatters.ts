export function removeLeadingTrailingNewlines(input: string): string {
  // Remove leading newlines until a blank line
  const leadingRegex = /^\n*/
  const withoutLeadingNewlines = input.replace(leadingRegex, '')

  // Remove trailing newlines
  const trailingRegex = /\n*$/
  const withoutTrailingNewlines = withoutLeadingNewlines.replace(trailingRegex, '')

  return withoutTrailingNewlines
}

export function removeMusicalTabs(input: string): string {
  // Replace all occurrences of musical tablature notation
  const withoutMusicalTabs = input.replace(/^(E\|.*$|B\|.*$|G\|.*$|D\|.*$|A\|.*$|E\|.*$|)\n*/gm, '')
  return withoutMusicalTabs
}

export function removeTextPatternsFromSong(input: string): string {
  const patternsToRemove = [
    /\[Intro\]/gi,
    /\[Refrão\]/gi,
    /\[Final\]/gi,
    /\[Solo\]/gi,
    /\[Primeira Parte\]/gi,
    /\[Segunda Parte\]/gi,
    /\[Terceira Parte\]/gi,
  ]

  let result = input
  patternsToRemove.forEach(pattern => {
    result = result.replace(pattern, '')
  })

  return result
}

export function removeToneText(input: string): string {
  const variableLineRegex = new RegExp(`tom:.*$`, 'gm')
  const result = input.replace(variableLineRegex, '')
  return result
}
