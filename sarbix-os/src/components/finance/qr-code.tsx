import * as React from "react"

interface QRCodeProps {
  value: string
  size?: number
  className?: string
}

/**
 * Deterministic SVG matrix QR visualizer with finder patterns and pseudo-random matrix
 * based on input value hash for high-fidelity interactive simulation.
 */
export function QRCodeSvg({ value, size = 180, className }: QRCodeProps) {
  // Simple deterministic hash to populate 21x21 QR grid
  const matrixSize = 25
  const cells: boolean[][] = React.useMemo(() => {
    let hash = 0
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i)
      hash |= 0
    }

    const grid: boolean[][] = Array.from({ length: matrixSize }, () =>
      Array(matrixSize).fill(false)
    )

    // Helper to draw 7x7 corner finder patterns
    const drawFinder = (startX: number, startY: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 ||
            r === 6 ||
            c === 0 ||
            c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            grid[startY + r][startX + c] = true
          }
        }
      }
    }

    // Top-Left, Top-Right, Bottom-Left finders
    drawFinder(0, 0)
    drawFinder(matrixSize - 7, 0)
    drawFinder(0, matrixSize - 7)

    // Timing strips
    for (let i = 8; i < matrixSize - 8; i++) {
      grid[6][i] = i % 2 === 0
      grid[i][6] = i % 2 === 0
    }

    // Populate data cells
    let seed = Math.abs(hash) || 12345
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip finder areas
        const isFinderTL = r < 8 && c < 8
        const isFinderTR = r < 8 && c >= matrixSize - 8
        const isFinderBL = r >= matrixSize - 8 && c < 8
        const isTiming = r === 6 || c === 6

        if (!isFinderTL && !isFinderTR && !isFinderBL && !isTiming) {
          seed = (seed * 9301 + 49297) % 233280
          grid[r][c] = seed / 233280 > 0.48
        }
      }
    }

    return grid
  }, [value])

  const cellSize = size / matrixSize

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={size} height={size} fill="white" rx={8} />
      {cells.map((row, r) =>
        row.map((active, c) =>
          active ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.2}
              height={cellSize + 0.2}
              fill="#0f172a"
            />
          ) : null
        )
      )}
    </svg>
  )
}
