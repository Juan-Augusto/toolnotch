import '@testing-library/jest-dom'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

// jsdom does not implement HTMLCanvasElement.getContext — mock it so
// Three.js components that call canvas.getContext('2d') for pip textures
// don't crash with "Not implemented".
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  fillStyle: '',
  font: '',
  textAlign: '' as CanvasTextAlign,
  textBaseline: '' as CanvasTextBaseline,
  fillRect: jest.fn(),
  fillText: jest.fn(),
  clearRect: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  drawImage: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  roundRect: jest.fn(),
  canvas: { width: 128, height: 128 },
})
