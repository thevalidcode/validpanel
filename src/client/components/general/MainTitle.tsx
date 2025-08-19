import {type FC} from 'react'

interface Props{
  pryTitle: string,
  secTitle?: string
}

const MainTitle:FC<Props> = ({pryTitle}) => {
  return (
    <div className='flex flex-wrap'>
      <h1 className="font-extrabold text-center text-[30.49px] "> {pryTitle} </h1>
    </div>
  )
}

export default MainTitle