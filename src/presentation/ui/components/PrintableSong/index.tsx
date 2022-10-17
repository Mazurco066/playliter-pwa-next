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
            <div className="song-info" style={{ marginBottom: '1rem' }}>
              <h1 className="song-title">
                {chordsheet.title}
              </h1>
              <span className="song-artist">
                Por {chordsheet.artist}
              </span>
              <span className="song-tone" style={{ fontSize: '14px!important' }}>
                <small>Tom: <strong>{song.tone}</strong></small>
              </span>
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
                                          {
                                            item.transposed && (
                                              <div className="chord">
                                                {item.transposed.replace(/\s/g, '')}
                                              </div>
                                            )
                                          }
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
