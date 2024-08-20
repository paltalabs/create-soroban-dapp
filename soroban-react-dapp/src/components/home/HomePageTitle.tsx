import Link from 'next/link'
import type { FC } from 'react'
import Image from 'next/image'
import 'twin.macro'
import tw, { styled } from 'twin.macro'

const StyledIconLink = styled(Link)(() => [
  tw`opacity-90 transition-all hover:(-translate-y-0.5 opacity-100)`,
])

export const HomePageTitle: FC = () => {
  const title = 'Soroban Vitae'
  const desc = 'Added your curriculum vitae on the blockchain'
  const githubHref = 'https://github.com/JorgeOehrens/create-soroban-cv-dapp'

  return (
    <>
      <div tw="flex flex-col items-center text-center font-mono">
        <Link
          href={githubHref}
          target="_blank"
          className="group"
          tw="flex cursor-pointer items-center gap-4 rounded-3xl py-1.5 px-3.5 transition-all hover:bg-gray-900"
        >
          <h1 tw="font-black text-[2.5rem]">{title}</h1>
        </Link>

     
      
        <p tw="mt-4 mb-6 text-white">{desc}</p>

        {/* Github & Vercel Buttons */}
        <div tw="flex space-x-2">
          <StyledIconLink href={githubHref} target="_blank">
            <img src="/icons/github-button.svg" alt="Github Repository" />
          </StyledIconLink>
          {/* <StyledIconLink href={deployHref} target="_blank">
            <Image src={vercelIcon} priority height={32} alt="Deploy with Vercel" />
          </StyledIconLink>
          <StyledIconLink href={telegramHref} target="_blank">
            <Image src={telegramIcon} priority height={32} alt="Telegram Group" />
          </StyledIconLink>
          <StyledIconLink href={sponsorHref} target="_blank">
            <Image src={sponsorIcon} priority height={32} alt="Sponsor the Project" />
          </StyledIconLink> */}
        </div>

        <div tw="my-14 w-14 bg-gray-800 h-[2px]" />
      </div>
    </>
  )
}
