// Dependencies
import dynamic from 'next/dynamic'
import { Chord } from 'chordsheetjs'
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { requestClient } from 'infra/services/http'
import {
  detecteSongFormat,
  plaintextToChordProFormat,
  removeLeadingTrailingNewlines,
  removeMusicalTabs,
  removeTextPatternsFromSong,
  removeToneText
} from 'presentation/utils'

// Layout and Components
import { LoadingAlert } from 'presentation/ui/components'
import { Icon } from '@chakra-ui/icons'
import { FaMicrophone, FaMusic, FaPhotoVideo } from 'react-icons/fa'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Switch,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  UseToastOptions
} from '@chakra-ui/react'

// Dynamic components import
const CustomAceEditor = dynamic(() => import('./elements/ace-editor'), { ssr: false })

// Save song component
const SaveSongView: FC<{
  id?: string,
  bandId?: string
}> = ({
  id = '',
  bandId = ''
}) => {
    // Hooks
    const router = useRouter()
    const toast = useToast()
    const [transpositions, setTranspositions] = useState<Array<any>>([])
    const [isPublic, setPublicState] = useState<boolean>(true)
    const [importUrl, setImportUrl] = useState<string>('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { t: common } = useTranslation('common')
    const { t } = useTranslation('song')
    const {
      control,
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm()

    // Color hooks
    const bgBox = useColorModeValue('gray.50', 'gray.800')
    const colorBtn = useColorModeValue('gray.900', 'gray.100')

    // Requests
    const {
      data: song,
      isLoading: songLoading
    } = useQuery(
      ['save-song'],
      () => requestClient(`/api/songs/get?id=${id}`, 'get'),
      {
        enabled: id !== '',
        refetchOnWindowFocus: false
      }
    )

    // Generic error msg
    const genericMsg: UseToastOptions = {
      title: common('messages.internal_error_title'),
      description: common('messages.internal_error_msg'),
      status: 'error',
      duration: 5000,
      isClosable: true
    }

    // Set form values if an id was received
    useEffect(() => {
      if (song && song.data) {
        // Set default song fields
        const options = { shouldValidate: true, shouldDirty: true }
        setValue('title', song.data?.title, options)
        setValue('writter', song.data?.writter, options)
        setValue('tone', song.data?.tone, options)
        setValue('category', song.data?.category?.title, options)
        setValue('embeddedUrl', song.data?.embeddedUrl, {
          shouldValidate: false,
          shouldDirty: true
        })
        setPublicState(song.data?.isPublic)

        // Replace all metadata and set song body
        const body = song.data?.body.replaceAll('<br>', '\n')
          .replace(/{title:(.*)}\n/, '')
          .replace(/{artist:(.*)}\n/, '')
          .replace(/{key:(.*)}\n/, '')
        setValue('body', body, options)
      }
    }, [song])

    // Validate path params
    useEffect(() => {
      if (!id && !bandId) {
        toast({
          title: t('messages.invalid_parameters_title'),
          description: t('messages.invalid_parameters_msg'),
          status: 'info',
          duration: 3500,
          isClosable: true
        })
        router.push('../../bands')
      }
    }, [id, bandId])

    // Clear form on startup and calc transpositions
    useEffect(() => {
      const options = { shouldValidate: false, shouldDirty: true }
      setValue('title', '', options)
      setValue('writter', '', options)
      setValue('tone', '', options)
      setValue('embeddedUrl', '', options)
      setValue('category', '', options)
      setValue('body', '', options)

      // Transpositions calc
      const baseTone = 'B'
      const key = Chord.parse(baseTone)
      const steps = []
      for (let i = -11; i <= 11; i++) {
        steps.push({
          label: key.transpose(i),
          name: key.transpose(i)
        })
      }
      setTranspositions(steps)
    }, [])

    // Notify user about error while fetching his show data
    useEffect(() => {
      if (song && song?.status !== 200) {
        if ([404].includes(song.status)) {
          toast({
            title: t('messages.song_not_found_title'),
            description: t('messages.song_not_found_msg'),
            status: 'info',
            duration: 5000,
            isClosable: true
          })
        } else {
          toast(genericMsg)
        }
        router.push('../../bands')
      }
    }, [song])

    // Save song
    const { isLoading, mutateAsync } = useMutation((data: any) => {
      return requestClient('/api/songs/save', 'post', data)
    })

    // Song scrapper request
    const {
      mutateAsync: scrapAsync,
      isLoading: isScrapLoading
    } = useMutation((url: string) => {
      return requestClient(`/api/songs/scrap_song`, 'post', { url })
    })

    // Import song text from cifra club
    const scrapSong = async (url: string) => {
      if (!url) return toast({
        title: t('messages.no_url_title'),
        description: t('messages.no_url_msg'),
        status: 'warning',
        duration: 2000,
        isClosable: true
      })
      if (!url.includes('https://')) return toast({
        title: t('messages.invalid_url_title'),
        description: t('messages.invalid_url_msg'),
        status: 'warning',
        duration: 2000,
        isClosable: true
      })

      // Toggle screen loader
      onOpen()

      // Request scrapping endpoint
      const response = await scrapAsync(url)
      onClose()

      // Verify if request was successfull
      if ([200, 201].includes(response.status)) {

        // Retrieve song data
        const { loot, title, tone, writter } = response.data

        // Format raw data
        const obtainedTone = transpositions.find(t => t.value === tone) ? tone : tone.substring(0, 1)

        // Format song body to chordpro
        const withoutLeadingTrails = removeLeadingTrailingNewlines(loot)
        const withoutTabs = removeMusicalTabs(withoutLeadingTrails)
        const withoutPrefixes = removeTextPatternsFromSong(withoutTabs)
        const withoutTone = removeToneText(withoutPrefixes)
        const obtainedBody = plaintextToChordProFormat(withoutTone)

        // Update form values
        const options = { shouldValidate: true, shouldDirty: true }
        setValue('title', title, options)
        setValue('writter', writter, options)
        setValue('body', obtainedBody, options)
        setValue('tone', obtainedTone, options)

        // Clear url
        setImportUrl('')

      } else {
        toast({
          title: t('messages.import_error_title'),
          description: t('messages.import_error_msg'),
          status: 'warning',
          duration: 2000,
          isClosable: true
        })
      }
    }

    // Submit action
    const onSubmit = async (data: any) => {
      // Clone body text as a variable to update it
      const songFormat = detecteSongFormat(data.body)
      let bodyText = songFormat !== 'chordpro'
        ? plaintextToChordProFormat(data.body)
        : data.body

      // Define body metadata
      const hasTitle = bodyText.includes('{title:')
      const hasArtist = bodyText.includes('{artist:')
      const hasKey = bodyText.includes('{key:')

      // Add snippets tags if not present
      if (!hasKey) bodyText = `{key: ${data.tone}}\n` + bodyText
      if (!hasArtist) bodyText = `{artist: ${data.writter}}\n` + bodyText
      if (!hasTitle) bodyText = `{title: ${data.title}}\n` + bodyText

      // Define request payload
      const payload = {
        ...data,
        isPublic: isPublic,
        body: bodyText,
        bandId: bandId,
        id: id
      }

      // Save song response
      const response = await mutateAsync(payload)

      // Verify if request was successfull
      if ([200, 201].includes(response.status)) {
        // Notify user about created show
        toast({
          title: t('messages.save_success_title'),
          description: `${t('messages.save_success_msg_1')}${response?.data?.title}${t('messages.save_success_msg_2')}`,
          status: 'success',
          duration: 2000,
          isClosable: true
        })

        // Redirect to show page
        router.push(id ? `../../songs/${id}` : `../songs/${response.data.id}`)

      } else {
        if ([400].includes(response.status)) {
          toast({
            title: t('messages.invalid_fields_title'),
            description: t('messages.invalid_fields_msg'),
            status: 'warning',
            duration: 3500,
            isClosable: true
          })
        } else if ([401, 403].includes(response.status)) {
          toast({
            title: t('messages.forbidden_title'),
            description: t('messages.forbidden_msg'),
            status: 'info',
            duration: 3500,
            isClosable: true
          })
        } else {
          toast(genericMsg)
        }
      }
    }

    // View JSX
    return (
      <div>
        <Container maxWidth="6xl">
          <Box
            mb="5"
            bgGradient="linear(to-b, secondary.600, primary.600)"
            borderRadius="lg"
            px="3"
            py="3"
          >
            <Text
              color="gray.100"
              fontWeight="bold"
              fontSize="sm"
            >
              {t('save.import_label')}
            </Text>
            <Text
              color="gray.100"
              mb="3"
              fontSize="sm"
            >
              {t('save.import_desc')}
            </Text>
            <FormControl isDisabled={isLoading || (id != '' && songLoading)} mb="3">
              <InputGroup
                bgColor="gray.100"
                borderRadius="lg"
                color="gray.800"
                size="sm"
              >
                <InputLeftElement
                  pointerEvents="none"
                >
                  <Icon as={FaMusic} />
                </InputLeftElement>
                <Input
                  disabled={isLoading || (id != '' && songLoading)}
                  type="text"
                  placeholder="URL da música..."
                  value={importUrl}
                  onChange={e => setImportUrl(e.target.value)}
                  minLength={2}
                  _placeholder={{
                    color: 'gray.500'
                  }}
                />
              </InputGroup>
            </FormControl>
            <Button
              width="full"
              colorScheme="whiteAlpha"
              size="sm"
              color={colorBtn}
              onClick={isScrapLoading ? () => { } : () => scrapSong(importUrl)}
            >
              {t('save.import_btn')}
            </Button>
          </Box>
          <Box
            px="3"
            py="5"
            borderRadius="lg"
            bgColor={bgBox}
            mb="5"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                isDisabled={isLoading || (id != '' && songLoading)}
                mb="5"
              >
                <FormLabel htmlFor='isPublic' mb='0'>
                  {t('save.public_label')}
                </FormLabel>
                <Switch
                  id='isPublic'
                  size="md"
                  isChecked={isPublic}
                  onChange={(e) => setPublicState(e.target.checked === true)}
                />
              </FormControl>
              <FormControl
                isDisabled={isLoading || (id != '' && songLoading)}
                isRequired
                mb="5"
              >
                <FormLabel>{t('save.title_label')}</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                  >
                    <Icon as={FaMusic} />
                  </InputLeftElement>
                  <Input
                    disabled={isLoading || (id != '' && songLoading)}
                    variant="filled"
                    type="text"
                    placeholder={t('save.title_placeholder')}
                    minLength={2}
                    {...register('title', { required: true })}
                  />
                </InputGroup>
                {errors.title ? (
                  <FormHelperText color="red.500">{t('save.required_label')}</FormHelperText>
                ) : (
                  <FormHelperText>{t('save.title_hint')}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                isDisabled={isLoading || (id != '' && songLoading)}
                isRequired
                mb="5"
              >
                <FormLabel>{t('save.author_label')}</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                  >
                    <Icon as={FaMicrophone} />
                  </InputLeftElement>
                  <Input
                    disabled={isLoading || (id != '' && songLoading)}
                    variant="filled"
                    type="text"
                    placeholder={t('save.author_placeholder')}
                    minLength={2}
                    {...register('writter', { required: true })}
                  />
                </InputGroup>
                {errors.writter ? (
                  <FormHelperText color="red.500">{t('save.required_label')}</FormHelperText>
                ) : (
                  <FormHelperText>{t('save.author_hint')}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                isDisabled={isLoading || (id != '' && songLoading)}
                isRequired
                mb="5"
              >
                <FormLabel>{t('save.tone_label')}</FormLabel>
                <InputGroup>
                  <Select
                    disabled={isLoading || (id != '' && songLoading)}
                    variant="filled"
                    placeholder={t('save.tone_placeholder')}
                    {...register('tone', { required: true })}
                  >
                    {
                      transpositions.map((t: any, i: number) => (
                        <option key={i} value={t.step}>
                          {`${t.name.root.note.note}${t.name.root.modifier ? t.name.root.modifier : ''}`}
                        </option>
                      ))
                    }
                  </Select>
                </InputGroup>
                {errors.tone ? (
                  <FormHelperText color="red.500">{t('save.required_label')}</FormHelperText>
                ) : (
                  <FormHelperText>{t('save.tone_hint')}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                isDisabled={isLoading || (id != '' && songLoading)}
                isRequired
                mb="5"
              >
                <FormLabel>{t('save.category_label')}</FormLabel>
                <InputGroup>

                  <Input
                    disabled={isLoading || (id != '' && songLoading)}
                    variant="filled"
                    type="text"
                    placeholder={t('save.category_placeholder')}
                    minLength={2}
                    {...register('category', { required: true })}
                  />
                </InputGroup>
                {errors.category ? (
                  <FormHelperText color="red.500">{t('save.required_label')}</FormHelperText>
                ) : (
                  <FormHelperText>{t('save.category_hint')}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                isDisabled={isLoading || (id != '' && songLoading)}
                mb="5"
              >
                <FormLabel>{t('save.url_label')}</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                  >
                    <Icon as={FaPhotoVideo} />
                  </InputLeftElement>
                  <Input
                    disabled={isLoading || (id != '' && songLoading)}
                    variant="filled"
                    type="text"
                    placeholder={t('save.url_placeholder')}
                    minLength={2}
                    {...register('embeddedUrl', { required: false })}
                  />
                </InputGroup>
                <FormHelperText>{t('save.url_hint')}</FormHelperText>
              </FormControl>
              <FormControl
                isDisabled={isLoading || (id != '' && songLoading)}
                isRequired
                mb="5"
              >
                <FormLabel>{t('save.body_label')}</FormLabel>
                <Controller
                  control={control}
                  name="body"
                  rules={{ required: true }}
                  render={({ field: { onChange, value, ref } }) => (
                    <CustomAceEditor
                      ref={ref}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.body ? (
                  <FormHelperText color="red.500">{t('save.required_label')}</FormHelperText>
                ) : (
                  <FormHelperText>{t('save.body_hint')}</FormHelperText>
                )}
              </FormControl>
              <Button
                disabled={isLoading || (id != '' && songLoading)}
                variant="fade"
                type="submit"
                width="full"
              >
                {t('save.submit')}
              </Button>
            </form>
          </Box>
        </Container>
        <LoadingAlert
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          title={t('save.import_message_title')}
          message={t('save.import_message_body')}
        />
      </div>
    )
  }

// Exporting component
export default SaveSongView
