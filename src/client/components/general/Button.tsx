import {type ButtonHTMLAttributes, forwardRef} from 'react'

interface ButtonComponentProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  name: string
  google?: boolean,
}

const Button = forwardRef<HTMLButtonElement, ButtonComponentProps>(({ ...props }, ref) => {
  return (
    <button ref={ref} {...props} style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
      <span className='inline-block'> {props.name} </span>
      {
        props.google && (
          <img  />
        )
      }
    </button>
  )
})

export default Button