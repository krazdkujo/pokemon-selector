import { useState, useEffect, useRef, useLayoutEffect } from 'react'

export default function Tooltip({
  children,
  isVisible,
  position,
  onMouseEnter,
  onMouseLeave,
  id
}) {
  const tooltipRef = useRef(null)
  const [adjustedPosition, setAdjustedPosition] = useState({ top: 0, left: 0 })

  // Recalculate position whenever tooltip becomes visible, position changes, or content changes size
  useLayoutEffect(() => {
    if (!isVisible || !tooltipRef.current || !position) return

    function calculatePosition() {
      const tooltip = tooltipRef.current
      if (!tooltip) return

      const rect = tooltip.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let newTop = position.top
      let newLeft = position.left

      // Adjust if tooltip would overflow right edge
      if (position.left + rect.width > viewportWidth - 10) {
        newLeft = viewportWidth - rect.width - 10
      }

      // Adjust if tooltip would overflow left edge
      if (newLeft < 10) {
        newLeft = 10
      }

      // Adjust if tooltip would overflow bottom edge - flip to top
      if (position.top + rect.height > viewportHeight - 10) {
        // Position above the trigger element instead
        newTop = position.top - rect.height - 40
      }

      // Adjust if tooltip would overflow top edge
      if (newTop < 10) {
        newTop = 10
      }

      setAdjustedPosition({ top: newTop, left: newLeft })
    }

    // Calculate initial position
    calculatePosition()

    // Use ResizeObserver to recalculate when content changes size
    const resizeObserver = new ResizeObserver(() => {
      calculatePosition()
    })

    resizeObserver.observe(tooltipRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [isVisible, position])

  if (!isVisible) return null

  return (
    <div
      ref={tooltipRef}
      className="tooltip"
      role="tooltip"
      id={id}
      style={{
        top: adjustedPosition.top,
        left: adjustedPosition.left,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
}
