// Dependencies
import { FC, useCallback } from 'react'
import Particles, { ParticlesProps } from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import { Engine } from 'tsparticles-engine'

// Background component
export const AnimatedBg: FC = (props: any) => {
  // Effects
  const init = useCallback(async (engine: Engine) => {
    await loadFull(engine)
  }, [])

  // Background options
  const options = {
    particles: {
      number: {
        value: 777,
        density: {
          enable: true,
          value_area: 789.1476416322727
        }
      },
      color: {
        value: '#ffffff'
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000'
        },
        polygon: {
          nb_sides: 5
        }
      },
      opacity: {
        value: 0.48927153781200905,
        random: false,
        anim: {
          enable: true,
          speed: 0.1,
          opacity_min: 0,
          sync: false
        }
      },
      size: {
        value: 2,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0,
          sync: false
        }
      },
      line_linked: {
        enable: false,
        distance: 150,
        color: '#ffffff',
        opacity: 0.9,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.1,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'bubble'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 83.91608391608392,
          size: 1,
          duration: 3,
          opacity: 1
        },
        repulse: {
          distance: 200,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    detectRetina: true
  }

  // Particle lib props
  const particleProps: ParticlesProps = {
    ...props,
    init: init,
    options: {
      ...options,
      fullScreen: false
    }
  }

  // Returning background as component
  return <Particles {...particleProps} />
}

// Default export
export default AnimatedBg
