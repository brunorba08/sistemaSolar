const canvas = document.getElementById('galaxy')
const ctx = canvas.getContext('2d')

let stars = []
let planets = []
let mouseTrail = []
let explosionParticles = []
let sunExploded = false
let planetsMovingAway = false

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
resizeCanvas()
window.addEventListener('resize', () => {
  resizeCanvas()
  createStars(200)
  createPlanets()
})

function createStars(count) {
  stars = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 2 + 0.5,
    })
  }
}

function createPlanets() {
  planets = [
    {
      radius: 4,
      orbitRadius: 50,
      speed: 0.025,
      angle: 0,
      texture: 'mercury',
      exploded: false,
    },
    {
      radius: 6,
      orbitRadius: 80,
      speed: 0.021,
      angle: 1,
      texture: 'venus',
      exploded: false,
    },
    {
      radius: 8,
      orbitRadius: 110,
      speed: 0.018,
      angle: 2,
      texture: 'earth',
      exploded: false,
    },
    {
      radius: 7,
      orbitRadius: 145,
      speed: 0.016,
      angle: 3,
      texture: 'mars',
      exploded: false,
    },
    {
      radius: 14,
      orbitRadius: 190,
      speed: 0.012,
      angle: 4,
      texture: 'jupiter',
      exploded: false,
    },
    {
      radius: 12,
      orbitRadius: 240,
      speed: 0.01,
      angle: 5,
      texture: 'saturn',
      exploded: false,
    },
    {
      radius: 10,
      orbitRadius: 290,
      speed: 0.008,
      angle: 6,
      texture: 'uranus',
      exploded: false,
    },
    {
      radius: 10,
      orbitRadius: 340,
      speed: 0.007,
      angle: 7,
      texture: 'neptune',
      exploded: false,
    },
  ]
}

function drawStars() {
  ctx.fillStyle = 'white'
  for (let star of stars) {
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
    ctx.fill()

    star.x -= star.speed
    if (star.x < 0) {
      star.x = canvas.width
      star.y = Math.random() * canvas.height
    }
  }
}

function drawPlanet(x, y, radius, texture) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
  switch (texture) {
    case 'mercury':
      gradient.addColorStop(0, '#aaa')
      gradient.addColorStop(1, '#555')
      break
    case 'venus':
      gradient.addColorStop(0, '#f9e85e')
      gradient.addColorStop(1, '#c8b63b')
      break
    case 'earth':
      gradient.addColorStop(0, '#3498db')
      gradient.addColorStop(1, '#1f6395')
      break
    case 'mars':
      gradient.addColorStop(0, '#ff5e3a')
      gradient.addColorStop(1, '#c0392b')
      break
    case 'jupiter':
      gradient.addColorStop(0, '#f5b041')
      gradient.addColorStop(1, '#d35400')
      break
    case 'saturn':
      gradient.addColorStop(0, '#f7dc6f')
      gradient.addColorStop(1, '#d4ac0d')
      break
    case 'uranus':
      gradient.addColorStop(0, '#82e0aa')
      gradient.addColorStop(1, '#39c0ed')
      break
    case 'neptune':
      gradient.addColorStop(0, '#5dade2')
      gradient.addColorStop(1, '#2c3e50')
      break
  }

  ctx.save()
  ctx.shadowColor = 'white'
  ctx.shadowBlur = 25
  ctx.beginPath()
  ctx.arc(x, y, radius + 1, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()
  ctx.restore()
}

function drawPlanets() {
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  if (!sunExploded) {
    ctx.beginPath()
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2)
    ctx.fillStyle = 'yellow'
    ctx.shadowColor = 'orange'
    ctx.shadowBlur = 30
    ctx.fill()
    ctx.shadowBlur = 0

    for (let p of planets) {
      if (!p.exploded) {
        p.angle += p.speed
        const x = centerX + Math.cos(p.angle) * p.orbitRadius
        const y = centerY + Math.sin(p.angle) * p.orbitRadius
        drawPlanet(x, y, p.radius, p.texture)
      }
    }
  } else {
    for (let p of planets) {
      if (!p.exploded) {
        p.x += p.vx
        p.y += p.vy
        drawPlanet(p.x, p.y, p.radius, p.texture)
      }
    }
  }
}

function drawExplosion() {
  for (let part of explosionParticles) {
    ctx.beginPath()
    ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2)
    ctx.fillStyle = part.color
    ctx.fill()
  }
}

function createExplosion(x, y, radius) {
  let numParts = 50
  for (let i = 0; i < numParts; i++) {
    let angle = Math.random() * Math.PI * 2
    let speed = Math.random() * 2 + 1
    let part = {
      x: x,
      y: y,
      radius: Math.random() * 3 + 1,
      color: 'white',
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
    }
    explosionParticles.push(part)
  }
  planetsMovingAway = true
}

function updateExplosion() {
  for (let i = explosionParticles.length - 1; i >= 0; i--) {
    let part = explosionParticles[i]
    part.x += part.dx
    part.y += part.dy

    if (
      part.x < 0 ||
      part.x > canvas.width ||
      part.y < 0 ||
      part.y > canvas.height
    ) {
      explosionParticles.splice(i, 1)
    }
  }
}

function drawMouseTrail() {
  for (let i = 0; i < mouseTrail.length - 1; i++) {
    let t1 = mouseTrail[i]
    let t2 = mouseTrail[i + 1]

    const progress = i / mouseTrail.length

    const alpha = t1.alpha
    const lineWidth = 8 * (1 - progress) + 1

    ctx.beginPath()
    ctx.moveTo(t1.x, t1.y)
    ctx.lineTo(t2.x, t2.y)
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.lineWidth = lineWidth
    ctx.shadowColor = 'white'
    ctx.shadowBlur = 30 * (1 - progress)
    ctx.stroke()
  }

  ctx.shadowBlur = 0

  for (let i = 0; i < mouseTrail.length; i++) {
    mouseTrail[i].alpha -= 0.015
  }

  mouseTrail = mouseTrail.filter((t) => t.alpha > 0)
}

canvas.addEventListener('mousemove', (e) => {
  mouseTrail.push({ x: e.clientX, y: e.clientY, alpha: 1 })
  if (mouseTrail.length > 20) {
    mouseTrail.shift()
  }
})

canvas.addEventListener('click', (e) => {
  const mouseX = e.clientX
  const mouseY = e.clientY
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  const sunDist = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2)

  if (sunDist <= 30 && !sunExploded) {
    createExplosion(centerX, centerY, 30)
    sunExploded = true
    planetsMovingAway = true

    for (let p of planets) {
      const angle = p.angle
      const speed = 1 + Math.random() * 1.5

      const x = centerX + Math.cos(angle) * p.orbitRadius
      const y = centerY + Math.sin(angle) * p.orbitRadius

      p.x = x
      p.y = y

      p.vx = Math.cos(angle) * speed
      p.vy = Math.sin(angle) * speed
    }

    return
  }

  if (!sunExploded) {
    for (let p of planets) {
      if (p.exploded) continue

      const x = centerX + Math.cos(p.angle) * p.orbitRadius
      const y = centerY + Math.sin(p.angle) * p.orbitRadius
      const dist = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2)

      if (dist <= p.radius) {
        createExplosion(x, y, p.radius)
        p.exploded = true

        p.vx = (Math.random() - 0.5) * 10
        p.vy = (Math.random() - 0.5) * 10

        break
      }
    }
  }
})

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawStars()
  drawPlanets()
  drawExplosion()
  updateExplosion()
  drawMouseTrail()
  requestAnimationFrame(animate)
}

createStars(200)
createPlanets()
animate()
