// Dependencies
import { FC, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'

// Types
import type { CategoryType } from 'domain/models'

// Components
import { CategoryItem } from './category'
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Text,
  VStack
} from '@chakra-ui/react'

// Component
export const CategoriesComponent: FC<{
  bandId: string,
  onCategoryClick?: (category: CategoryType) => void,
  onNewCategoryClick?: () => void
}> = ({
  bandId,
  onCategoryClick = () => {},
  onNewCategoryClick = () => {}
}) => {
  // Hooks
  const [ filterSearch, setFilterSearch ] = useState<string>('')
  //const { isOpen, onOpen, onClose } = useDisclosure()

  // Categories request
  const {
    data: categories,
    isLoading: categoriesLoading
  } = useQuery(
    [`band-categories-${bandId}`],
    () => requestClient(`/api/bands/categories?band=${bandId}`, 'get')
  )

   // Filtered categories
   const filteredCategories = (categories && categories.data)
   ? categories.data.filter(({ title, description }: CategoryType) => 
       title.toLowerCase().includes(filterSearch.toLowerCase()) ||
       description.toLowerCase().includes(filterSearch.toLowerCase())
     )
   : []

  // JSX
  return (
    <>
      <Box mb="5" pt="3">
        <FormControl mb="5">
          <InputGroup borderColor="primary.600">
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon />}
            />
            <Input
              type="text"
              placeholder="Buscar..."
              minLength={2}
              value={filterSearch}
              color="gray.50"
              _placeholder={{
                color: 'gray.300'
              }}
              onChange={e => {
                const inputValue = e.target.value
                setFilterSearch(inputValue)
              }}
            />
          </InputGroup>
        </FormControl>
        <Button
          w="full"
          onClick={onNewCategoryClick}
          bgColor="primary.500"
          color="gray.100"
          _hover={{
            bgColor: 'primary.600'
          }}
        >
          <AddIcon mr="2" /> Nova Categoria
        </Button>
      </Box>
      { categories && !categoriesLoading ? (
        <>
          {
            (categories.data?.length > 0) ? (
              <>
                {
                  filteredCategories.length > 0 ? (
                    <VStack
                      gap="0.5rem"
                      mb="5"
                    >
                      {
                        filteredCategories.map((category: CategoryType) => (
                          <CategoryItem
                            key={category.id}
                            category={category}
                            onClick={(_category: CategoryType) => {
                              onCategoryClick(_category)
                            }}
                          />
                        ))
                      }
                    </VStack>
                  ) : (
                    <Text>
                      Não há categorias correspondentes ao filtro informado.
                    </Text>
                  )
                }
              </>
            ) : (
              <Text>
                Não há categorias registradas nessa banda.
              </Text>
            )
          }
        </>
      ) : (
        <>
          <VStack
            gap="0.5rem"
            mb="5"
          >
            {[1, 2, 3, 4].map((key: number) => (
              <Skeleton
                key={key}
                width="full"
                height="72px"
                borderRadius="lg"
              />
            ))}
          </VStack>
        </>
      )}
    </>
  )
}
