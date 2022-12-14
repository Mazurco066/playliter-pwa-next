const RE = /\[([A-G][#b]?.*?)\]/gi

export default class ChordCompleter {
  find (text: any) {
    return [...text.matchAll(RE)].reduce((chords, [_, chord]) => {
      chords[chord] = chords[chord] + 1 || 1
      return chords
    }, {})
  }

  getCompletions (editor: any, session: any, pos: any, prefix: any, callback: any) {
    const chords = this.find(editor.getValue())
    callback(null, Object.entries(chords).map(([name, score]) => {
      return {
        name,
        value: `[${name}]`,
        score,
        meta: 'chord'
      }
    }))
  }
}
