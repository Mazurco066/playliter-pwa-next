// Dependencies
import { FC } from 'react'
import { plaintextToChordProFormat } from 'presentation/utils'

// Components
import AceEditor from 'react-ace'

// Ace Editor custom plugins
import ChordCompleter from './ace/chordCompleter'

// Themes and modes
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/theme-dracula'
import 'ace-builds/src-noconflict/ext-language_tools'

// Ace editor chordpro snippets
import './ace/modeChordpro'
import './ace/snipets/chordpro'

// Allow window to receive editor props
declare global {
  interface Window { editor: any }
}

// Component
const CustomAceEditor: FC<{
  onChange?: (value: string) => void,
  value: string,
  ref?: any
}> = ({
  onChange = (value) => console.log(value),
  value,
  ref = null
}) => {
  // Setup ace editor
  const setupEditor = (editor: any) => {
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    })
    editor.renderer.setScrollMargin(20, 20)

    // Add snipets and completers
    const { snippetCompleter } = ace.require('ace/ext/language_tools')
    editor.completers = [ new ChordCompleter(), snippetCompleter ]

    // Start autocomplete on [ or { characters
    editor.commands.addCommand({
      name: 'chordproStartAutocomplete',
      bindKey: '[|{',
      exec () {
        editor.commands.byName.startAutocomplete.exec(editor)
        return false
      }
    })

    // Expose ace editor for tests
    window.editor = editor
  }

  // Editor behavior actions
  const handlePaste = (pastedText: string) => {
    const formattedText = plaintextToChordProFormat(pastedText)
    console.log(formattedText)
  }

  // JSX
  return (
    <AceEditor
      ref={ref}
      mode="chordpro"
      theme="dracula"
      name="song-body"
      value={value}
      onChange={onChange}
      onLoad={setupEditor}
      
      onPaste={handlePaste}
      editorProps={{ $blockScrolling: true }}
      style={{
        width: '100%',
        borderRadius: '8px'
      }}
    />
  )
}

// Export default component
export default CustomAceEditor
