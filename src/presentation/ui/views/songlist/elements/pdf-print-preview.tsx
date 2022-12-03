// Dependencies
import { FC } from 'react'
import { formatDate } from 'presentation/utils'
import { useTranslation } from 'next-i18next'

//Types
import type { ShowType } from 'domain/models'

// Component
export const PDFPrintPreview: FC<{ show: ShowType }> = ({ show }) => {
  // Hooks
  const { t } = useTranslation('songList')

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
              {t('presentation_date')}<strong>{ formatDate(date) }</strong>
            </p>
            <p className="credits">
              {t('generated_by')}<strong>Playliter</strong>{t('generated_at')}<strong>{ formatDate(new Date().toISOString()) }</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
