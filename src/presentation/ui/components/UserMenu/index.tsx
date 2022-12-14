// Dependencies
import { FC } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useUser } from 'infra/services/session'
import { requestClient } from 'infra/services/http'

// Components
import { FaDoorOpen, FaUsers, FaCompactDisc } from 'react-icons/fa'
import { Icon, SettingsIcon } from '@chakra-ui/icons'
import {
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'

// TopBar component
export const UserMenu: FC = () => {
  // Hooks
  const router = useRouter()
  const { mutateUser } = useUser()
  const { t: common } = useTranslation('common')

  // JSX
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<SettingsIcon />}
        variant='ghost'
      />
      <MenuList>
        <MenuItem
          icon={<Icon as={FaUsers} />}
          onClick={() => router.push('/bands')}
        >
          {common('user_menu.my_bands')}
        </MenuItem>
        <MenuItem 
          icon={<Icon as={FaCompactDisc} />}
          onClick={() => router.push('/songs')}
        >
          {common('user_menu.my_songs')}
        </MenuItem>
        <Divider orientation="horizontal" />
        <MenuItem
          as="a" 
          icon={<Icon as={FaDoorOpen} />}
          cursor="pointer"
          href="/api/logout"
          onClick={async (e) => {
            e.preventDefault()
            mutateUser(
              await requestClient('/api/logout', 'post'),
              false
            )
            router.push('/login')
          }}
        >
          {common('user_menu.logout')}
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
