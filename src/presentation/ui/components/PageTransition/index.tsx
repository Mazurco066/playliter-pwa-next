// Dependencies
import { FC, ReactNode } from 'react'
import { useRouter } from 'next/router'

// Components
import { motion } from 'framer-motion'
import { Box } from '@chakra-ui/react'


// Page transition component
export const PageTransition: FC<{ children: ReactNode }> = ({ children }) => {
  // Hooks
  const { asPath } = useRouter()

  // Animation variants
  const variants = {
    out: {
      opacity: 0,
      y: 40,
      transition: {
        duration: 0.5
      }
    },
    in: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.25
      }
    }
  }

  // Animation JSX
  return (
    <Box className="transition-effect-1">
	    <motion.div
        key={asPath}
        variants={variants}
        animate="in"
        initial="out"
        exit="out"
      >
	      {children}
	    </motion.div>
		</Box>
  )
}
