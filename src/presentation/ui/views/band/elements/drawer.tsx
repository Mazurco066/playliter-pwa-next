// Dependencies
import { FC, ReactNode } from 'react'

// Components
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay
} from '@chakra-ui/react'

// Component
export const BandDrawer: FC<{
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  title?: string,
  children?: ReactNode
}> = ({
  isOpen,
  onClose,
  children,
  title = 'Drawer'
}) => {
  // JSX
  return (
    <Drawer
      placement="bottom"
      onClose={onClose}
      isOpen={isOpen}
      size="full"
    >
      <DrawerOverlay />
      <DrawerContent
        //maxH="90%"
        bgGradient="linear(to-b, secondary.600, primary.600)"
        color="gray.100"
      >
        <DrawerHeader borderBottomWidth='1px'>
          {title}
        </DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          {children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
