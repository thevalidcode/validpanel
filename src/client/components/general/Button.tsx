import { type ButtonHTMLAttributes, forwardRef } from 'react';
import googleImgUrl from '../../../assets/images/google.svg';

interface ButtonComponentProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  name: string,
  isGoogle?: boolean,
  styles?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonComponentProps>(({ ...props }, ref) => {
  return (
    <button ref={ref} {...props} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      minWidth: '353px',
      minHeight: '58px',
      borderRadius: 28,
      cursor: 'pointer',
    }}
      className={`border-2 transition-all btn-custom ${props.styles}`}
    >
      <span className='inline-block font-extrabold tracking-[1.28px] uppercase '> {props.name} </span>
      {
        props.isGoogle && (
          <img src={googleImgUrl} className='w-[26px] h-6 ' />
        )
      }
    </button>
  )
})

Button.displayName = 'Button'
export default Button