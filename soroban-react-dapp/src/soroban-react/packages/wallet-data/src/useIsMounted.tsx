import React from 'react'

export function useIsMounted() {
  const reducer = () => true
  const [mounted, setMounted] = React.useReducer(reducer, false)
  React.useEffect(setMounted, [setMounted])
  return mounted
}
