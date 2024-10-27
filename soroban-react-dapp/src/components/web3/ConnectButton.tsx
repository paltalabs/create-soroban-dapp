import 'twin.macro'
import {useSorobanReact} from "@soroban-react/core"

import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiChevronDown } from 'react-icons/fi'
import { AiOutlineCheckCircle, AiOutlineDisconnect } from 'react-icons/ai'
import toast from 'react-hot-toast'
import type { WalletChain,Connector } from '@soroban-react/types'



export const ConnectButton = () => {
    // Connect Button
    const sorobanContext = useSorobanReact()

    const {activeChain, address, disconnect, setActiveConnectorAndConnect, setActiveChain} = sorobanContext;
    const activeAccount = address;

    const browserWallets = sorobanContext.connectors;
    const supportedChains = sorobanContext.chains;

  const handleContractInteraction = (chain: WalletChain) => {
    if (!chain.name || chain.name.toLowerCase() === 'standalone') {
      toast.error('Please deploy the contract before proceeding when using the standalone chain..');
    } else {
      setActiveChain && setActiveChain(chain);
      toast.success(`Active chain changed to ${chain.name}`);
    }
  };

  const connectWallet = async(wallet:Connector) => {
    if (setActiveConnectorAndConnect) {
      try {
        await setActiveConnectorAndConnect(wallet);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast.error('Failed to connect wallet. Please try again.');
      }
    }
  };

  if (!activeAccount) {
    return (
      <Menu>
        <MenuButton
          as={Button}
          size="md"
          rightIcon={<FiChevronDown size={22} />}
          py={6}
          fontWeight="bold"
          rounded="2xl"
          colorScheme="purple"
        >
          Connect Wallet
        </MenuButton>

        <MenuList bgColor="blackAlpha.900" borderColor="whiteAlpha.300" rounded="2xl">
          {browserWallets.map((wallet) => (
            <MenuItem
              key={wallet.name}
              onClick={() => connectWallet(wallet)}
              tw="bg-transparent hocus:bg-gray-800"
            >
              {wallet.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  }

      

    // Account Menu & Disconnect Button
    return (
      <Menu matchWidth>
        <HStack>
          {/* Account Name, Address, and AZNS-Domain (if assigned) */}
          <MenuButton
            as={Button}
            rightIcon={<FiChevronDown size={22} />}
            hidden={false}
            py={6}
            pl={5}
            rounded="2xl"
            fontWeight="bold"
          >
            <VStack spacing={0.5}>
              {/* <AccountName account={activeAccount} /> */}
              <Text>{activeChain?.name}</Text>
              <Text fontSize="xs" fontWeight="normal" opacity={0.75}>
                {address}
              </Text>
            </VStack>
          </MenuButton>
        </HStack>

        <MenuList
          bgColor="blackAlpha.900"
          borderColor="whiteAlpha.300"
          rounded="2xl"
          maxHeight="40vh"
        >
          {/* Supported Chains */}
          {/* Commented this as changing chain with the setActiveChain from soroban-react 
          is not working well - should change chain in the browser extension */}
          {/* {supportedChains.map((chain) => (
            <MenuItem
              key={chain.name}
              // isDisabled={chain.network === activeChain?.network}
              onClick={() => {
                // toast.error(`Not implemented yet. Please switch chain via the wallet extension.`)
                handleContractInteraction(chain)
              }}
              tw="bg-transparent hocus:bg-gray-800"
            >
              <VStack align="start" spacing={0}>
                <HStack>
                  <Text>{chain.name}</Text>
                  {chain.network === activeChain?.network && <AiOutlineCheckCircle size={16} />}
                </HStack>
              </VStack>
            </MenuItem>
          ))} */}

          {/* Disconnect Button */}
          <MenuDivider />
          <MenuItem
            onClick={async () => {console.log("Disconnecting"); await disconnect()}}
            icon={<AiOutlineDisconnect size={18} />}
            tw="bg-transparent hocus:bg-gray-800"
          >
            Disconnect
          </MenuItem>
        </MenuList>
      </Menu>
    )
  }