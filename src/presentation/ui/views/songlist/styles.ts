// PDF preview styles
export const pdfPreviewStyles: string = `
  @page {
    size: A4;
  }
  #ghost-preview {
    page-break-after: always;
  }
  #pdf-preview {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: #1C1C1C;
    border: 1px solid #1C1C1C;
    margin: auto;
    margin-top: 0!important;
    overflow: hidden;
    border-radius: 8px;
    z-index: 0;
  }
  .svg-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: auto;
    margin-top: 0!important;
    margin-bottom: 0!important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-size: contain;
    background-image: url("/img/pdf-prev.svg");
    background-repeat: no-repeat;
    background-position: bottom;
    z-index: 1;
  }
  .show-info {
    position: absolute;
    top: 35%;
    left: 0;
    margin: 0 auto;
    left: 0;
    right: 0;
    width: 500px!important;
    min-height: 200px;
    border-radius: 8px;
    padding: 1rem 1.5rem;
    background-color: rgba(0, 0, 0, 0.2)!important;
    display: flex;
    flex-direction: column;
    gap: 16px;
    z-index: 2;
  }
  .show-title {
    color: #F5F5F5;
    text-transform: uppercase;
    text-align: center;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }
  .show-desc {
    color: #F5F5F5;
    text-align: center;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }
  .credits {
    color: #F5F5F5;
    text-align: center;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }
  .show-date {
    color: #F5F5F5;
    text-align: center;
    font-weight: bold;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }
  .show-date strong,
  .credits strong {
    color: #4963f7;
  }
`

// PDF song styles
export const pdfPrintStyles: string = `
  .printable-songsheet{
    page-break-after:always;
    -webkit-print-color-adjust:exact;
    -moz-print-color-adjust:exact;
    -ms-print-color-adjust:exact;
    print-color-adjust:exact
  }
  .song-info{
    margin-bottom:1rem
  }
  .song-artist,
  .song-title{
    margin-bottom:6px;
    display:block!important;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"
  }
  .song-title{
    font-weight:700;
    text-transform:uppercase;
    color:#8257e5
  }
  .song-tone{
    display:block!important;
    margin-bottom:0;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"
  }
  .column,
  .row{
    display:flex!important
  }
  .song-tone strong{
    color:#4963f7
  }
  .song-section{
    overflow:hidden;
    max-width:100%;
    overflow-x:auto
  }
  .chord,.lyrics{
    max-height:28px;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    white-space:pre
  }
  .chord{
    margin-right:4px
  }
  .paragraph+.paragraph{
    margin-top:16px
  }
  .row{
    flex-direction:row;
    align-items: flex-end;
    position:relative;
    break-inside:avoid;
    page-break-inside:avoid
  }
  .column{
    flex-direction:column
  }
  .comment{
    color:#ccc;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"
  }
  .chorus:before,
  .comment,
  .verse::before{
    font-weight:700;
    font-style:italic;
    break-after:avoid;
    page-break-inside:avoid
  }
  .chord-sheet :not(.tab) .chord{
    color:#4963f7;
    font-weight:700
  }
  .chorus{
    border-left:4px solid #8257e5;
    padding-left:1.5em
  }
  .chorus::before{
    content:"Refrão:";
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"
  }
  .verse::before{
    counter-increment:verse;
    content:"Verso " counter(verse) ":";
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"
  }
  .chord:after,
  .lyrics:after{
    content:'\\200b'
  }
`
