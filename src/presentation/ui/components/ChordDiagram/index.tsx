// Dependencies
import { FC } from 'react'
import { Chord } from 'chordsheetjs'
import { ChordData } from 'presentation/utils'

// Component
export const ChordDiagram: FC<{
  instrument?: 'guitar' | 'ukulele' | 'keyboard'
  position?: number,
  name: string,
  width?: string | number,
  height?: string | number
}> = ({
  instrument = 'guitar',
  position = 0,
  name,
  width = '50',
  height ='65'
}) => {
  // Actions
  const generateDiagram = (data: ChordData) => {
    // const el = document.createElement('div')
    // new ChordBox(el, {
    //   numStrings: data.strings,
    //   showTuning: false,
    //   width: width,
    //   height: height,
    //   defaultColor: 'currentColor'
    // }).draw({
    //   chord: data.fingerings,
    //   position: data.data.baseFret,
    //   barres: data.barres
    // })
    // return el.querySelector('svg')?.innerHTML
    console.log(chordData)
    return ''
  }

  // Computed data
  const chord = Chord.parse(name)
  const chordData = ChordData.find(chord, instrument, position)
  const diagram = chordData
    ? generateDiagram(chordData)
    : ''

  // JSX
  return (
    <symbol
      id={`chord-${name}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {diagram}
    </symbol>
  )
}
