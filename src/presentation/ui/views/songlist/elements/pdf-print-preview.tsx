// Dependencies
import { FC } from 'react'
import { formatDate } from 'presentation/utils'

//Types
import type { ShowType } from 'domain/models'

// Component
export const PDFPrintPreview: FC<{ show: ShowType }> = ({ show }) => {
  // Destruct show data
  const { title, description, date } = show

  // JSX
  return (
    <span></span>
  )
}
