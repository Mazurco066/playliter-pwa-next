// Dependencies
import { FC } from 'react'

// Components
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import {
  Button,
  ButtonGroup,
  Flex,
  EditablePreview,
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
    <ButtonGroup
      justifyContent='center'
      size='sm'
      mt="2"
    >
      <Button
        as={IconButton}
        icon={<CheckIcon />}
        color="green"
        {...getSubmitButtonProps()}
      />
      <Button
        as={IconButton}
        icon={<CloseIcon />}
        color="red.300"
        {...getCancelButtonProps()} 
      />
    </ButtonGroup>
  ) : (
    <Flex alignItems="center" justifyContent='center'>
      <EditablePreview mr="2" />
      <Button
        as={IconButton}
        size='xs'
        icon={<EditIcon />}
        color="primary.500"
        {...getEditButtonProps()} 
      />
    </Flex>
  )
}
