/**
 * ConnectButton component to connect to the network.
 * @requires react
 * @requires soroban-react/core
 */
import { SorobanContextType } from '@soroban-react/core'
import React from 'react'

/**
 * Props for the ConnectButton component.
 */

export interface ConnectButtonProps {
  /**
   * Label for the connect button.
   */
  label: string

  /**
   * Whether the connect button is higher.
   */
  isHigher?: boolean

  /**
   * The Soroban context.
   */
  sorobanContext: SorobanContextType
}

/**
 * The ConnectButton component. It is a button that allows the user to establish a connection when clicked.
 *
 * @param {ConnectButtonProps} props - The properties that define the ConnectButton component.
 * @returns The ConnectButton component.
 */

export function ConnectButton({
  label,
  isHigher,
  sorobanContext,
}: ConnectButtonProps) {
  const { connect } = sorobanContext

  /**
   * Opens the connection modal.
   *
   */
  const openConnectModal = async () => {
    await connect()
  }

  /**
   * The ConnectButton component.
   */
  return (
    /**
     * The button that allows the user to establish a connection when clicked.
     */
    <button style={{ height: isHigher ? 50 : 38 }} onClick={openConnectModal}>
      {label}
    </button>
  )
}
