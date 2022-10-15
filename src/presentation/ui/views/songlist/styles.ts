// PDF styles
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
    min-height:28px;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    white-space:pre
  }
  .chord{
    margin-right:4px
  }
  .paragraph+.paragraph{
    margin-top:1rem
  }
  .row{
    flex-direction:row;
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
