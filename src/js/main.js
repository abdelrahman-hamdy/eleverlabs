import '../styles/main.css'

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal()
  initParallax()
  initNetworkVisualization()
  initMagneticButtons()
  initCursorGlow()
  initSmoothScroll()
  initTypingEffect()
  initCounterAnimation()
})

// Scroll Reveal Animation
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })

  reveals.forEach(el => observer.observe(el))
}

// Parallax Effect for Hero Elements
function initParallax() {
  const hero = document.querySelector('.hero-section')
  if (!hero) return

  const layers = hero.querySelectorAll('[data-parallax]')

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset
    layers.forEach(layer => {
      const speed = layer.dataset.parallax || 0.5
      layer.style.transform = `translateY(${scrolled * speed}px)`
    })
  })

  // Mouse parallax
  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window

    const moveX = (clientX - innerWidth / 2) / 50
    const moveY = (clientY - innerHeight / 2) / 50

    layers.forEach(layer => {
      const depth = layer.dataset.depth || 1
      layer.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`
    })
  })
}

// Interactive Network Visualization
function initNetworkVisualization() {
  const canvas = document.getElementById('network-canvas')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let nodes = []
  let animationId

  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  }

  function createNodes() {
    nodes = []
    const numNodes = Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 15000)

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: ['#7c3aed', '#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4'][Math.floor(Math.random() * 5)]
      })
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

    // Update and draw nodes
    nodes.forEach((node, i) => {
      node.x += node.vx
      node.y += node.vy

      // Bounce off edges
      if (node.x < 0 || node.x > canvas.offsetWidth) node.vx *= -1
      if (node.y < 0 || node.y > canvas.offsetHeight) node.vy *= -1

      // Draw node
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
      ctx.fillStyle = node.color
      ctx.fill()

      // Draw connections
      nodes.slice(i + 1).forEach(other => {
        const dx = node.x - other.x
        const dy = node.y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(other.x, other.y)
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - dist / 120)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })
    })

    animationId = requestAnimationFrame(animate)
  }

  resize()
  createNodes()
  animate()

  window.addEventListener('resize', () => {
    resize()
    createNodes()
  })
}

// Magnetic Button Effect
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic-btn')

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
    })

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)'
    })
  })
}

// Custom Cursor Glow
function initCursorGlow() {
  const glow = document.createElement('div')
  glow.className = 'cursor-glow'
  glow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    transition: transform 0.1s ease-out;
    transform: translate(-50%, -50%);
  `
  document.body.appendChild(glow)

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px'
    glow.style.top = e.clientY + 'px'
  })
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })
}

// Typing Effect for Hero Text
function initTypingEffect() {
  const element = document.querySelector('[data-typing]')
  if (!element) return

  const words = ['connections', 'communities', 'opportunities', 'networks', 'experiences']
  let wordIndex = 0
  let charIndex = 0
  let isDeleting = false

  function type() {
    const currentWord = words[wordIndex]

    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1)
      charIndex--
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1)
      charIndex++
    }

    let delay = isDeleting ? 50 : 100

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 2000
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      wordIndex = (wordIndex + 1) % words.length
      delay = 500
    }

    setTimeout(type, delay)
  }

  setTimeout(type, 1000)
}

// Counter Animation
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-counter]')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.counter)
        const duration = 2000
        const step = target / (duration / 16)
        let current = 0

        const update = () => {
          current += step
          if (current < target) {
            entry.target.textContent = Math.floor(current)
            requestAnimationFrame(update)
          } else {
            entry.target.textContent = target
          }
        }

        update()
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })

  counters.forEach(el => observer.observe(el))
}

// Export for potential module usage
export {
  initScrollReveal,
  initParallax,
  initNetworkVisualization,
  initMagneticButtons,
  initCursorGlow
}
