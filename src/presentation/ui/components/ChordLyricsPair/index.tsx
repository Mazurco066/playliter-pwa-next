// Dependencies
import { FC } from 'react'

// Components
import { Flex, Text } from '@chakra-ui/react'

// Component
export const ChordLyricsPair: FC<{
  item: { lyrics: string, transposed: string }
}> = ({
  item
}) => {
  // JSX
  return (
    <Flex
      direction="column"
    >
      {
        item.transposed && (
          <Text
            color="secondary.500"
            fontWeight="bold"
            maxHeight="26px"
            whiteSpace="pre"
            mr="1"
          >
            {item.transposed.replace(/\s/g, '')}
          </Text>   
        )
      }
      <Text
        minHeight="26px"
        maxHeight="26px"
        whiteSpace="pre"
      >
        {item.lyrics}
      </Text>
    </Flex>
  )
}
