import { useContext, Context } from 'react'

import { SorobanContext } from './SorobanContext'
import { SorobanContextType } from './SorobanContext'

export function useSorobanReact() {
  const context = useContext(
    SorobanContext as Context<SorobanContextType | undefined>
  )
  if (!context)
    throw Error(
      'useSorobanReact can only be used within the useSorobanReact component'
    )
  return context
}
