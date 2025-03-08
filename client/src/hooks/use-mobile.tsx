import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Custom hook that detects if the current viewport width qualifies as mobile.
 *
 * This hook sets up a media query listener to update its state when the viewport width changes. It returns a boolean value indicating
 * whether the viewport is narrower than the defined mobile breakpoint.
 *
 * @returns A boolean that is true if the viewport width is less than the mobile threshold, false otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
