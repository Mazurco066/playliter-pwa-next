// Dependencies
import { FC } from 'react'
import { useRouter } from 'next/router'
import { useUser } from 'infra/services/session'
import { fetchJson } from 'infra/services/http'

// Components
import { FaDoorOpen, FaUser, FaUsers, FaCompactDisc } from 'react-icons/fa'
import { Icon, HamburgerIcon } from '@chakra-ui/icons'
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

  // JSX
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<HamburgerIcon />}
        variant='ghost'
      />
      <MenuList>
        <MenuItem icon={<Icon as={FaUser} />}>
          Minha Conta
        </MenuItem>
        <MenuItem icon={<Icon as={FaUsers} />}>
          Minhas Bandas
        </MenuItem>
        <MenuItem icon={<Icon as={FaCompactDisc} />}>
          Músicas Públicas
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
              await fetchJson('/api/logout', { method: 'POST' }),
              false
            )
            router.push('/login')
          }}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
