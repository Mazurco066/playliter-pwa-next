// Dependencies
import guitar from '@tombatossals/chords-db/lib/guitar.json'
import { Chord } from 'chordsheetjs'

// Available instrument chords SVG
const instruments: { [key: string]: any } = { guitar }

// Chord aliases
const keyAliases: { [key: string]: string } = {
  Asharp: 'Bb',
  Db: 'Csharp',
  Dsharp: 'Eb',
  Gb: 'Fsharp',
  Gsharp: 'Ab'
}

// Chord suffix aliases
const suffixAliases: { [key: string]: string } = {
  '': 'major',
  m: 'minor',
  '+': 'aug'
}

export class ChordData {
  chord: Chord
  data: any

  static translate (chord: Chord) {
    let key: any = chord.root.note
    let modifier = chord.root.modifier
    let suffix = chord.suffix

    // Normalize and append modifier to key
    if (modifier === '#') modifier = 'sharp'
    if (modifier) key = key + modifier

    // Normalize A7M, A7m... cases
    if (
      suffix &&
      suffix.length >= 2 &&
      ['5', '7', '8', '9'].includes(suffix.substring(0,1)) &&
      ['M', 'm'].includes(suffix.substring(1,2))
    ) {
      suffix = suffix.substring(1,2).toLowerCase() + suffix.substring(0,1)
    } 

    // Aliases
    key = keyAliases[key] || key
    suffix = suffix ? suffixAliases[suffix] || suffix : 'major'

    return { key, suffix }
  }

  static find (chord: Chord, instrument = 'guitar', position = 0) {
    try {
      const { key, suffix } = this.translate(chord)

      const chordData = instruments[instrument].chords[key]
      const suffixData = chordData.find((c: any) => c.suffix === suffix)
      const positionData = suffixData.positions[position]

      if (positionData) {
        return new this(chord, positionData)
      }
    } catch (_) {
      return null
    }
  }

  constructor (chord: Chord, data: any) {
    this.chord = chord
    this.data = data
  }

  get strings () {
    return this.data.frets.length
  }

  get fingerings () {
    let string = this.strings
    return this.data.frets.map((fret: any) => [string--, fret >= 0 ? fret : 'x'])
  }

  get barres () {
    return this.data.barres.map((fret: any) => {
      const fromString = this.strings - this.data.frets.findIndex((f: any) => f >= fret)
      const toString = this.data.frets.slice().reverse().findIndex((f: any) => f >= fret) + 1
      return { fret, fromString, toString }
    })
  }
}
