// Dependencies
import dynamic from 'next/dynamic'
import { Chord } from 'chordsheetjs'
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'
import { detecteSongFormat, plaintextToChordProFormat } from 'presentation/utils'

// Types
import type { CategoryType } from 'domain/models'

// Layout and Components
import { LoadingAlert } from 'presentation/ui/components'
import { Icon } from '@chakra-ui/icons'
import { FaMicrophone, FaMusic } from 'react-icons/fa'
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

// Generic msg
const genericMsg: UseToastOptions = {
  title: 'Erro interno.',
  description: 'Um erro inesperado ocorreu! Entre em contato com algum administrador do App.',
  status: 'error',
  duration: 5000,
  isClosable: true
}

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
  const [ transpositions, setTranspositions ] = useState<Array<any>>([])
  const [ categories, setCategories ] = useState<CategoryType[]>([])
  const [ isPublic, setPublicState ] = useState<boolean>(true)
  const [ importUrl, setImportUrl ] = useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()
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
  
  // Set form values if an id was received
  useEffect(() => {
    if (song && song.data) {
      // Set default song fields
      const options = { shouldValidate: true, shouldDirty: true }
      setValue('title', song.data?.title, options)
      setValue('writter', song.data?.writter, options)
      setValue('tone', song.data?.tone, options)
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
        title: 'Parâmetros inválidos.',
          description: 'Para acessar a página de salvar música por favor utilize uma URL valida!',
          status: 'info',
          duration: 3500,
          isClosable: true
      })
      router.push('../../bands')
    }
  }, [id, bandId])

  useEffect(() => {
    if (bandId) loadCategories(bandId)
  }, [bandId])

  // Clear form on startup and calc transpositions
  useEffect(() => {
    const options = { shouldValidate: false, shouldDirty: true }
    setValue('title', '', options)
    setValue('writter', '', options)
    setValue('tone', '', options)
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
          title: 'Música não encontrada.',
          description: 'A música informada não foi encontrada!',
          status: 'info',
          duration: 5000,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
      router.push('../../bands')
    } else if (song && song.data && [200, 201].includes(song.status)) {
      loadCategories(song.data.band.id)
    }
  }, [song])

  // Save song
  const { isLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/songs/save', 'post', data)
  })

  // Band categories mutation
  const { mutateAsync: bandCategoriesRequest } = useMutation((bandId: string) => {
    return requestClient(`/api/bands/categories?band=${bandId}`, 'get')
  })

  // Song scrapper request
  const {
    mutateAsync: scrapAsync,
    isLoading: isScrapLoading 
  } = useMutation((url: string) => {
    return requestClient(`/api/songs/scrap_song`, 'post', { url })
  })

  // Update form category data according to song
  useEffect(() => {
    if (categories.length) {
      if (id) {
        setValue('category', song?.data?.category.id, {
          shouldValidate: true,
          shouldDirty: true
        })
      }
    }
  }, [categories])

  // Load band categories
  const loadCategories = async (band_id: string) => {
    const response = await bandCategoriesRequest(band_id)

    // Verify if response was successfull
    if ([401, 403].includes(response.status)) {
      toast({
        title: 'Permissão negada!',
        description: 'Você precisa ter permissões de Membro na banda que publicou a música para conseguir editá-la!',     
        status: 'info',
        duration: 3500,
        isClosable: true
      })
      router.push('../../bands')
    } else if (![200, 201].includes(response.status)) {
      toast(genericMsg)
      router.push('../../bands')
    } else {
      setCategories(response.data)
    }
  }

  // Import song text from cifra club
  const scrapSong = async (url: string) => {
    if (!url) return toast({
      title: 'URL inválida!',
      description: `Por favor insira a url da música para realizar a importação.`,
      status: 'warning',
      duration: 2000,
      isClosable: true
    })
    if (!url.includes('https://')) return toast({
      title: 'URL inválida!',
      description: `Por favor insira uma URL válida.`,
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
      const obtainedBody = plaintextToChordProFormat(loot)
      const obtainedTone = transpositions.find(t => t.value === tone) ? tone : tone.substring(0, 1)

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
        title: 'Ops...!',
        description: `Ocorreu um erro durante a importação. Verifique se a URL informada corresponde a música.`,
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
        title: 'Sucesso!',
        description: `Sua música com título de ${response?.data?.title} foi salva com sucesso!`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Redirect to show page
      router.push(id  ? `../../songs/${id}` : `../songs/${response.data.id}`)

    } else {
      if ([400].includes(response.status)) {
        toast({
          title: 'Ops.. Há campos inválidos!',
          description: 'Por favor revise o preenchimento de seu formulário!',     
          status: 'warning',
          duration: 3500,
          isClosable: true
        })
      } else if ([401, 403].includes(response.status)) {
        toast({
          title: 'Permissão insuficiente!',
          description: 'Você não tem permissão para criar/salvar músicas desta banda!',     
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
            Música está em site de terceiros?
          </Text>
          <Text
            color="gray.100"
            mb="3"
            fontSize="sm"
          >
            Sem problemas? Cole a URL da música no campo abaixo e a importaremos para o app.
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
                children={<Icon as={FaMusic} />}
              />
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
            onClick={isScrapLoading ? () => {} : () => scrapSong(importUrl)}
          >
            Importar música
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
                A música é pública?
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
              <FormLabel>Título da música</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaMusic} />}
                />
                <Input
                  disabled={isLoading || (id != '' && songLoading)}
                  variant="filled"
                  type="text"
                  placeholder="Título..."
                  minLength={2}
                  {...register('title', { required: true })}
                />
              </InputGroup>
              {errors.title ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Insira um título para a música.</FormHelperText>
              )}
            </FormControl>
            <FormControl
              isDisabled={isLoading || (id != '' && songLoading)}
              isRequired
              mb="5"
            >
              <FormLabel>Autor da música</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaMicrophone} />}
                />
                <Input
                  disabled={isLoading || (id != '' && songLoading)}
                  variant="filled"
                  type="text"
                  placeholder="Autor..."
                  minLength={2}
                  {...register('writter', { required: true })}
                />
              </InputGroup>
              {errors.writter ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Insira o autor da música.</FormHelperText>
              )}
            </FormControl>
            <FormControl
              isDisabled={isLoading || (id != '' && songLoading)}
              isRequired
              mb="5"
            >
              <FormLabel>Tom Base</FormLabel>
              <InputGroup>
                <Select
                  disabled={isLoading || (id != '' && songLoading)}
                  variant="filled"
                  placeholder="Tom Base"
                  {...register('tone', { required: true })}
                >
                  {
                    transpositions.map((t: any, i: number) => (
                      <option key={i} value={t.step}>
                        { `${t.name.root.note.note}${t.name.root.modifier ? t.name.root.modifier : ''}` }
                      </option>
                    ))
                  }
                </Select>
              </InputGroup>
              {errors.tone ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Selecione o tom base da música.</FormHelperText>
              )}
            </FormControl>
            <FormControl
              isDisabled={isLoading || (id != '' && songLoading)}
              isRequired
              mb="5"
            >
              <FormLabel>Categoria</FormLabel>
              <InputGroup>
                <Select
                  disabled={isLoading || (id != '' && songLoading)}
                  variant="filled"
                  placeholder="Selecionar Categoria..."
                  {...register('category', { required: true })}
                >
                  {
                    categories.map((_category: CategoryType, i : number) => (
                      <option key={i} value={_category.id}>
                        {_category.title}
                      </option>
                    ))
                  }
                </Select>
              </InputGroup>
              {errors.category ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Selecione uma categoria música.</FormHelperText>
              )}
            </FormControl>
            <FormControl
              isDisabled={isLoading || (id != '' && songLoading)}
              isRequired
              mb="5"
            >
              <FormLabel>Corpo da música</FormLabel>
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
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Insira um corpo para a música.</FormHelperText>
              )}
            </FormControl>
            <Button
              disabled={isLoading || (id != '' && songLoading)}
              variant="fade"
              type="submit"
              width="full"
            >
              Salvar
            </Button>
          </form>
        </Box>
      </Container>
      <LoadingAlert 
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        title="Importando música"
        message="Estamos importando a música indicada! Esse processo poderá demorar alguns segundos, por favor aguarde."
      />
    </div>
  )
}

// Exporting component
export default SaveSongView
