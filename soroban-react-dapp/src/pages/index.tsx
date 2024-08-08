import React, { useState, useEffect } from 'react';
import { HomePageTitle } from '@/components/home/HomePageTitle';
import { CenterBody } from '@/components/layout/CenterBody';
import { ChainInfo } from '@/components/web3/ChainInfo';
import { ConnectButton } from '@/components/web3/ConnectButton';
import { GreeterContractInteractions } from '@/components/web3/GreeterContractInteractions';
import type { NextPage } from 'next';
import 'twin.macro';

const HomePage: NextPage = () => {
    const networks: Network[] = ['standalone', 'testnet', 'futurenet', 'mainnet'];
    const [selectedNetwork, setSelectedNetwork] = useState<Network>('testnet'); // Default to testnet

    useEffect(() => {
        // Automatically connect to the testnet on startup
        connectToNetwork('testnet');
    }, []);

    const handleNetworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const network = event.target.value as Network;
        setSelectedNetwork(network);
        connectToNetwork(network);
    };

    const connectToNetwork = (network: Network) => {
        // Logic to connect to the selected network
        console.log(`Connecting to ${network} network`);
        // Example: update your network provider or state based on the selected network
    };

    return (
        <>
            {/* Top Bar */}
            {/* <HomeTopBar /> */}

            <CenterBody tw="mt-20 mb-10 px-5">
                {/* Title */}
                <HomePageTitle />

                {/* Network Selection Dropdown */}
                <select
                    value={selectedNetwork}
                    onChange={handleNetworkChange}
                    tw="mb-4 p-2 border border-gray-300 rounded"
                >
                    {networks.map(network => (
                        <option key={network} value={network}>
                            {network.charAt(0).toUpperCase() + network.slice(1)}
                        </option>
                    ))}
                </select>

                {/* Connect Wallet Button */}
                <ConnectButton network={selectedNetwork} />

                <div tw="mt-10 flex w-full flex-wrap items-start justify-center gap-4">
                    {/* Chain Metadata Information */}
                    <ChainInfo />

                    {/* Greeter Read/Write Contract Interactions */}
                    <GreeterContractInteractions network={selectedNetwork} />
                </div>
            </CenterBody>
        </>
    );
};

export default HomePage;
