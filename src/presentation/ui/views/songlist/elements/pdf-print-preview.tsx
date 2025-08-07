// Dependencies
import { FC } from 'react'
import { formatDate } from 'presentation/utils'
import { useTranslation } from 'next-i18next'

//Types
import type { ShowType } from 'domain/models'

// Component
export const PDFPrintPreview: FC<{
  show: ShowType,
  color: string
}> = ({ color, show }) => {
  // Hooks
  const { t } = useTranslation('songList')

  // Destruct show data
  const { title, description, date, band: { title: bandTitle }, observations = [] } = show

  const hasText = observations.find(obs => obs.title === 'Evangelho')

  // JSX
  return (
    <>
      <div id="ghost-preview">
        <span>{' '}</span>
      </div>
      <div id="pdf-preview" className={`${color}`}>
        <div className="svg-container">
          <img
            src={`/img/playliter-bg-${color}.png`}
            alt="PDF Preview"
          />
        </div>
        <div className="show-info">
          <h3 className="show-title">
            { title }
          </h3>
          <h4 className="band-info">
            {formatDate(date)} - { bandTitle }
          </h4>
          <p className="show-desc">
            { description }
          </p>
          {hasText ? (
            <p className="show-add-text">
              { hasText.data }
            </p>
          ) : null}
        </div>
        <div className="credits-container">
          <p className="credits">
            {t('generated_by')}<strong>Playliter</strong>{t('generated_at')}<strong>{ formatDate(new Date().toISOString()) }</strong>
          </p>
        </div>
      </div>
    </>
  )
}
