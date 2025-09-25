import { forwardRef, type InputHTMLAttributes } from "react";

interface InputComponentProps extends InputHTMLAttributes<HTMLInputElement>{
  styles?: string
}

const TextInput = forwardRef<HTMLInputElement, InputComponentProps>(({ ...props }, ref) => {
  return (
    <input {...props} ref={ref} className={`w-full rounded-[4px] outline-none border-2 focus:border-primary px-5 py-4 ${props.styles}`} />
  )

  TextInput.displayName = 'TextInput';
})

export default TextInput;