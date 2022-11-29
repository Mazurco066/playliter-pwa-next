// Dependencies
import { FC, useCallback, useState} from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'next-i18next'
import { requestClient } from 'infra/services/http'

// Components
import { Icon } from '@chakra-ui/icons'
import { FaPhotoVideo } from 'react-icons/fa'
import {
  Avatar,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Spinner,
  Text
} from '@chakra-ui/react'

// Component
export const FileUpload: FC<{
  onUploadError?: () => void,
  onUploadSuccess?: (params : { file: File, url: string }) => void,
  source: string
}> = ({
  onUploadError = () => {},
  onUploadSuccess = () => {},
  source
}) => {
  // Hooks
  const [ isLoading, setLoadingState ] = useState<boolean>(false)
  const { t: common } = useTranslation('common')

  // Events
  const onDrop = useCallback(async (acceptedFiles: any) => {
    if (acceptedFiles.length) {
      // Retrive file from event
      const file = acceptedFiles[0]

      // Append file to request data
      const formData = new FormData()
      formData.append('file', file)

      // Request upload service
      setLoadingState(true)
      const result = await requestClient('/api/upload_image', 'post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setLoadingState(false)
      
      // Verify upload response
      if (result.status === 200) {
        onUploadSuccess({
          file: file,
          url: result.data.secure_url
        })
      } else {
        onUploadError()
      }
    }
  }, [])

  // File input events
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })

  // JSX
  return (
    <FormControl mb="5">
      <FormLabel>
        {common('file_upload.label')}
      </FormLabel>
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
              (source !== '' && !isLoading) && (
                <Avatar
                  src={source}
                  name={common('file_upload.placeholder')}
                  size="xl"
                />
              )
            }
            {
              (isDragActive && !source && !isLoading) && (
                <>
                  <Icon as={FaPhotoVideo} mb="2" />
                  <Text>{common('file_upload.drag_here')}</Text>
                </> 
              )
            }
            {
              (!isDragActive && !source && !isLoading) && (
                <>
                  <Icon as={FaPhotoVideo} mb="2" />
                  <Text textAlign="center">
                    {common('file_upload.hint')}
                  </Text>
                </>
              )
            }
            {
              isLoading && (
                <Spinner size="xl" />
              )
            }
          </Flex>
        </Box>
      </Box>
    </FormControl>
  )
}
