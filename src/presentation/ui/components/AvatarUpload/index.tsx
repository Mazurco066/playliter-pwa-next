// Dependencies
import { FC, useCallback, useState} from 'react'
import { useDropzone } from 'react-dropzone'
import { requestClient } from 'infra/services/http'

// Components
import { Icon } from '@chakra-ui/icons'
import { FaPhotoVideo } from 'react-icons/fa'
import { Avatar, AvatarBadge, Box, Spinner } from '@chakra-ui/react'

// Component
export const AvatarUpload: FC<{
  onUploadError?: () => void,
  onUploadSuccess?: (params : { file: File, url: string }) => void,
  source: string,
  name: string
}> = ({
  onUploadError = () => {},
  onUploadSuccess = () => {},
  source,
  name
}) => {
  // Hooks
  const [ isLoading, setLoadingState ] = useState<boolean>(false)

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
  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    onDrop,
    multiple: false
  })

  // JSX
  return (
    <Box mb="3" {...getRootProps()}>
      <Avatar
        src={source}
        name={name}
        size="xl"
        position="relative"
        _hover={{
          cursor: 'pointer'
        }}
      >
        <input {...getInputProps()} />
        {
          isLoading && (
            <Spinner
            position="absolute"
            size="lg"
            color="primary.500"
          />
          )
        }
        <AvatarBadge
          borderColor='primary.500'
          bgColor='primary.500'
          boxSize='0.85em'
          display="flex"
          alignItems="center"
          justifyContent="center"
          _hover={{
            bgColor: 'primary.600',
            borderColor: 'primary.600'
          }}
        >
          <Icon as={FaPhotoVideo}
            fontSize="0.45em"
            color="gray.100"
          />
        </AvatarBadge>
      </Avatar>
    </Box>
  )
}
