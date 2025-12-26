type CanvasCtx = CanvasRenderingContext2D & {
  running?: boolean
  frame?: number
}

type Vec2 = { x: number; y: number }

type Settings = {
  friction: number
  trails: number
  size: number
  dampening: number
  tension: number
}

const SETTINGS: Settings = {
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
}

class Oscillator {
  phase: number
  offset: number
  frequency: number
  amplitude: number

  constructor(opts: Partial<Oscillator> = {}) {
    this.phase = opts.phase ?? 0
    this.offset = opts.offset ?? 0
    this.frequency = opts.frequency ?? 0.001
    this.amplitude = opts.amplitude ?? 1
  }

  update(): number {
    this.phase += this.frequency
    return this.offset + Math.sin(this.phase) * this.amplitude
  }
}

class TrailNode {
  x = 0
  y = 0
  vx = 0
  vy = 0

  constructor(pos: Vec2) {
    this.x = pos.x
    this.y = pos.y
  }
}

class Line {
  spring: number
  friction: number
  nodes: TrailNode[]

  constructor(pos: Vec2, spring: number) {
    this.spring = spring + 0.1 * Math.random() - 0.05
    this.friction = SETTINGS.friction + 0.01 * Math.random() - 0.005
    this.nodes = Array.from({ length: SETTINGS.size }, () => new TrailNode(pos))
  }

  update(pos: Vec2) {
    let spring = this.spring
    let node = this.nodes[0]

    node.vx += (pos.x - node.x) * spring
    node.vy += (pos.y - node.y) * spring

    for (let i = 0; i < this.nodes.length; i++) {
      node = this.nodes[i]

      if (i > 0) {
        const prev = this.nodes[i - 1]
        node.vx += (prev.x - node.x) * spring
        node.vy += (prev.y - node.y) * spring
        node.vx += prev.vx * SETTINGS.dampening
        node.vy += prev.vy * SETTINGS.dampening
      }

      node.vx *= this.friction
      node.vy *= this.friction
      node.x += node.vx
      node.y += node.vy

      spring *= SETTINGS.tension
    }
  }

  draw(ctx: CanvasCtx) {
    let x = this.nodes[0].x
    let y = this.nodes[0].y

    ctx.beginPath()
    ctx.moveTo(x, y)

    for (let i = 1; i < this.nodes.length - 2; i++) {
      const a = this.nodes[i]
      const b = this.nodes[i + 1]
      x = 0.5 * (a.x + b.x)
      y = 0.5 * (a.y + b.y)
      ctx.quadraticCurveTo(a.x, a.y, x, y)
    }

    const a = this.nodes[this.nodes.length - 2]
    const b = this.nodes[this.nodes.length - 1]
    ctx.quadraticCurveTo(a.x, a.y, b.x, b.y)
    ctx.stroke()
    ctx.closePath()
  }
}

let ctx: CanvasCtx | null = null
let oscillator: Oscillator | null = null
let lines: Line[] = []
let pos: Vec2 = { x: 0, y: 0 }
let rafId: number | null = null

function resizeCanvas() {
  if (!ctx) return
  ctx.canvas.width = Math.max(1, window.innerWidth - 20)
  ctx.canvas.height = Math.max(1, window.innerHeight)
}

function setPosFromEvent(e: MouseEvent | TouchEvent) {
  if ("touches" in e) {
    if (!e.touches.length) return
    pos = { x: e.touches[0].pageX, y: e.touches[0].pageY }
  } else {
    pos = { x: e.clientX, y: e.clientY }
  }
}

function ensureLines() {
  if (!ctx) return
  if (lines.length) return

  // default position: center of the viewport
  if (pos.x === 0 && pos.y === 0) {
    pos = { x: ctx.canvas.width / 2, y: ctx.canvas.height / 2 }
  }

  lines = Array.from({ length: SETTINGS.trails }, (_, i) => {
    const spring = 0.45 + (i / SETTINGS.trails) * 0.025
    return new Line(pos, spring)
  })
}

function render() {
  if (!ctx || !ctx.running || !oscillator) return

  ctx.globalCompositeOperation = "source-over"
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.globalCompositeOperation = "lighter"

  ctx.strokeStyle = `hsla(${Math.round(oscillator.update())},100%,50%,0.025)`
  ctx.lineWidth = 10

  for (const line of lines) {
    line.update(pos)
    line.draw(ctx)
  }

  ctx.frame = (ctx.frame ?? 0) + 1
  rafId = window.requestAnimationFrame(render)
}

function start() {
  if (!ctx) return
  if (ctx.running) return
  ctx.running = true
  render()
}

function stop() {
  if (!ctx) return
  ctx.running = false
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }
}

export const renderCanvas = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement | null
  if (!canvas) return
  const nextCtx = canvas.getContext("2d") as CanvasCtx | null
  if (!nextCtx) return

  // Avoid double-init when React mounts/unmounts in dev
  if (canvas.dataset.nomaCanvasInit === "1") return
  canvas.dataset.nomaCanvasInit = "1"

  ctx = nextCtx
  ctx.running = true
  ctx.frame = 1

  oscillator = new Oscillator({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  })

  resizeCanvas()
  ensureLines()
  render()

  const onMouseMove = (e: MouseEvent) => {
    setPosFromEvent(e)
  }

  const onTouchMove = (e: TouchEvent) => {
    setPosFromEvent(e)
    // keep behavior similar to original: prevent scroll while interacting
    e.preventDefault()
  }

  document.addEventListener("mousemove", onMouseMove)
  document.addEventListener("touchstart", onTouchMove, { passive: false })
  document.addEventListener("touchmove", onTouchMove, { passive: false })
  window.addEventListener("resize", resizeCanvas)
  window.addEventListener("focus", start)
  window.addEventListener("blur", stop)
}
  