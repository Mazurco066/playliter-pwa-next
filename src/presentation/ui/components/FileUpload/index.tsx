// Dependencies
import { FC, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

// Components
import {
  Box,
  FormControl,
  FormLabel,
  useColorModeValue
} from '@chakra-ui/react'

// Component
export const FileUpload: FC = () => {
  // Events
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    console.log('[file]', acceptedFiles)
  }, [])

  // Hooks
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    multiple: false
  })

  // Color hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // JSX
  return (
    <FormControl mb="5">
      <FormLabel>Logotipo da banda</FormLabel>
      <Box
        bgGradient="linear(to-b, secondary.500, primary.500)"
        borderRadius="lg"
        p="2"
        {...getRootProps()}
      >
        <Box
          border="2px dashed"
          borderRadius="lg"
          borderColor="gray.50"
          p="3"
        >
          <input {...getInputProps()} />
          {
            acceptedFiles.length > 0 ?
              <p>Arquivo selecionado</p>
              : isDragActive ?
               <p>Solte os arquivos aqui ...</p> :
                <p>Arraste seus arquivos aqui, ou clique para selecionar os arquivos</p>
          }
        </Box>
      </Box>
    </FormControl>
  )
}
