import { HomePageTitle } from '@/components/home/HomePageTitle'
import { CenterBody } from '@/components/layout/CenterBody'
import { ChainInfo } from '@/components/web3/ChainInfo'
import { ConnectButton } from '@/components/web3/ConnectButton'
import { GreeterContractInteractions } from '@/components/web3/GreeterContractInteractions'
import { GreeterAuthorizedContractInteractions } from '@/components/web3/GreeterAuthorizedContractInteractions'
import type { NextPage } from 'next'
import 'twin.macro'

const HomePage: NextPage = () => {
  // Display `useInkathon` error messages (optional)
  // const { error } = useInkathon()
  // useEffect(() => {
  //   if (!error) return
  //   toast.error(error.message)
  // }, [error])

  return (
    <>
      {/* Top Bar */}
      {/* <HomeTopBar /> */}

      <CenterBody tw="mt-20 mb-10 px-5">
        {/* Title */}
        <HomePageTitle />

        {/* Connect Wallet Button */}
        <ConnectButton />

        <div tw="mt-10 flex w-full flex-wrap items-start justify-center gap-4">
          {/* Chain Metadata Information */}
          <ChainInfo />

          {/* Greeter Read/Write Contract Interactions */}
          {/* <GreeterContractInteractions /> */}
          <GreeterAuthorizedContractInteractions />
        </div>
      </CenterBody>
    </>
  )
}

export default HomePage
