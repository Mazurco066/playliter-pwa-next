// Dependencies
import { FC, useEffect, useState } from 'react'
import { getTransposedSong } from 'presentation/utils'

// Types
import type { SongType } from 'domain/models'

// Component
export const PrintableSong: FC<{ song: SongType  }> = ({ song }) => {
  // Hooks
  const [ chordsheet, setChordsheet ] = useState<any | null>(null)

  // Effects
  useEffect(() => {
    const cs = getTransposedSong(song.body || '', 0)
    setChordsheet(cs)
  }, [song])

  // JSX
  return (
    <div className="printable-songsheet">
      {
        chordsheet && (
          <>
            <div>
              <h3 className="song-title">
                {chordsheet.title}
              </h3>
              <p className="song-artist">
                Por {chordsheet.artist}
              </p>
              <p className="song-tone">
                Tom: <strong>{song.tone}</strong> 
              </p>
            </div>
            <div className="song-section">
              <div className="chord-sheet">
                {
                  chordsheet.paragraphs.map((paragraph: any, i: number) => (
                    <div className={`paragraph ${paragraph.type}`} key={paragraph.type + i}>
                      {
                        paragraph.lines.map((line: any, idx: number) => (
                          <div key={idx} className="row">
                            {
                              line.hasRenderableItems() && (
                                line.items.map((item: any, idx2: number) => (
                                    item.isRenderable() && (
                                      item.name === 'comment' ? (
                                        <div key={'inner-' + idx2} className="comment">
                                          <small>
                                            { item.value }
                                          </small>
                                        </div>
                                      ) : (
                                        <div key={'inner-' + idx2} className="column">
                                          <div className="chord">
                                            {item.transposed}
                                          </div>
                                          <div className="lyrics">
                                            {item.lyrics}
                                          </div>
                                        </div>
                                      )
                                    )  
                                  )
                                )
                              )
                            }
                          </div>
                        ))
                      }            
                    </div>
                  ))
                }
              </div>
            </div>
          </>
        )
      }
    </div>
  )
}
