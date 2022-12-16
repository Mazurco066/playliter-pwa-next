// PDF preview styles
export const pdfPreviewStyles: string = `
  @page {
    size: A4;
    margin: 0;
    padding: 0;
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
    background: #8257E5!important;
    border: 1px solid #8257E5!important;
    color: #FFFFFF!important;
    margin: auto;
    margin-top: 0!important;
    overflow: hidden;
    z-index: 0;
  }
  .svg-container {
    position: absolute;
    height: 809px!important;
    width: 496px!important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1;
    right: 0;
    bottom: 0;
  }
  .svg-container img {
    object-fit: cover;
    height: 100%!important;
    width: 100%!important;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  .show-info {
    position: absolute;
    top: 16px;
    left: 16px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-left: 16px;
    z-index: 3;
  }
  .credits-container {
    position: absolute;
    bottom: 8px;
    left: 16px;
    padding-left: 16px;
    z-index: 4;
  }
  .show-title {
    width: 500px!important;
    font-size: 72px!important;
    margin-bottom: 32px;
    color: #FFFFFF;
    text-transform: uppercase;
    text-align: left;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }
  .band-info {
    color: #FFFFFF;
    text-align: left;
    text-transform: uppercase;
    font-weight: bold;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }
  .show-desc {
    width: 300px!important;
    color: #FFFFFF;
    text-align: left;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }
  .show-add-text {
    width: 450px!important;
    color: #FFFFFF;
    text-align: left;
    white-space: break-spaces;
    text-align: justify;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }
  .credits {
    color: #FFFFFF;
    text-align: left;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  }
  .show-date strong,
  .credits strong {
    color: #FFFFFF;
  }
`

// PDF song styles
export const pdfPrintStyles: string = `
  .printable-songsheet{
    page-break-after:always;
    -webkit-print-color-adjust:exact;
    -moz-print-color-adjust:exact;
    -ms-print-color-adjust:exact;
    print-color-adjust:exact;
    padding: 16px;
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
