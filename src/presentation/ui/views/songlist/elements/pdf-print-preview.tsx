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
    <>
      <div id="ghost-preview">
        <span>{' '}</span>
      </div>
      <div id="pdf-preview">
        <div className="svg-container">
          <img src="/img/pdf-prev.svg" alt="PDF Preview" />
          <div className="show-info">
            <h3 className="show-title">
              { title }
            </h3>
            <p className="show-desc">
              { description }
            </p>
            <p className="show-date">
              Apresentação ocorrerá no dia: <strong>{ formatDate(date) }</strong>
            </p>
            <p className="credits">
              Documento gerado pelo app <strong>Playliter</strong> em <strong>{ formatDate(new Date().toISOString()) }</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
