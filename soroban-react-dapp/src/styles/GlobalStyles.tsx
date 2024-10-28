import { Global } from '@emotion/react'
import tw, { GlobalStyles as BaseStyles, css } from 'twin.macro'
import sideImage from '../../public/images/side-img.svg'
const customStyles = css`
  html {
    ${tw`scroll-smooth antialiased`}
  }
  body {
    ${tw`bg-black text-white`}
    background-image: url(${sideImage.src});
    background-size: cover;
    background-position: center;
  
    min-height: 100vh;
    width: 100%;
    
  }


  #__next,
  #__next > div {
    ${tw`relative flex h-full min-h-full flex-col`}
  }
`

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
)

export default GlobalStyles
