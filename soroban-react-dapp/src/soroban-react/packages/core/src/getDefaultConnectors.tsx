import { freighter } from '@soroban-react/freighter'
import { Connector } from '@soroban-react/types'
import { xbull } from '../../xbull/src'

export const getDefaultConnectors = (): Connector[] => {
  const list: Connector[] = [freighter(),xbull()]

  return list
}
