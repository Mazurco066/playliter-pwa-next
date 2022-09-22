// Dependencies
import { FC, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
// import { fetchJsonFromOrigin } from 'infra/services/http'

// Components
import { Icon } from '@chakra-ui/icons'
import { FaPhotoVideo } from 'react-icons/fa'
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Text
} from '@chakra-ui/react'

// Component
export const FileUpload: FC<{
  onUploadError?: () => void,
  onUploadSuccess?: (params : { file: File, url: string }) => void
}> = ({
  onUploadError = () => {},
  onUploadSuccess = () => {}
}) => {
  // Events
  const onDrop = useCallback(async (acceptedFiles: any) => {
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

  // JSX
  return (
    <FormControl mb="5">
      <FormLabel>Logotipo da banda</FormLabel>
      <Box
        bgGradient="linear(to-b, secondary.500, primary.500)"
        cursor="pointer"
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
          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <input {...getInputProps()} />
            {
              acceptedFiles.length > 0
                ? <Text>Arquivo selecionado</Text>
                : isDragActive
                  ? (
                    <>
                      <Icon as={FaPhotoVideo} mb="2" />
                      <Text>Solte os arquivos aqui</Text>
                    </> 
                  ) 
                  : (
                    <>
                      <Icon as={FaPhotoVideo} mb="2" />
                      <Text textAlign="center">Arraste seus arquivos aqui, ou clique para selecionar os arquivos</Text>
                    </>
                  ) 
            }
          </Flex>
        </Box>
      </Box>
    </FormControl>
  )
}
