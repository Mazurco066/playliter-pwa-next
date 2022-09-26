// Dependencies
import { FC } from 'react'

// Components
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import {
  ButtonGroup,
  Flex,
  IconButton,
  useEditableControls
} from '@chakra-ui/react'

// Export component
export const EditableControls: FC = () => {
  // Hooks
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls()

  // JSX
  return isEditing ? (
    <ButtonGroup justifyContent='center' size='sm'>
      <IconButton
        icon={<CheckIcon />}
        {...getSubmitButtonProps()}
      />
      <IconButton
        icon={<CloseIcon />}
        {...getCancelButtonProps()} 
      />
    </ButtonGroup>
  ) : (
    <Flex justifyContent='center'>
      <IconButton
        size='sm'
        icon={<EditIcon />}
        {...getEditButtonProps()} 
      />
    </Flex>
  )
}
