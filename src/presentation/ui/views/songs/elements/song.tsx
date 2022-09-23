// Dependencies
import { FC } from 'react'

// Types
import type { SongType } from 'domain/models'

// Component
export const SongItem: FC<{
  song: SongType,
  onClick?: () => void
}> = ({
  song,
  onClick = () => {}
}) => {
  // JSX
  return (
    <div
      onClick={onClick}
    >
      {song.title}
    </div>
  )
}
