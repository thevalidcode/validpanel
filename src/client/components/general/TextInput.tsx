import { forwardRef, type InputHTMLAttributes } from "react";

// interface InputComponentProps extends InputHTMLAttributes<HTMLInputElement>{

// }

const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ ...props }, ref) => {
  return (
    <input {...props} ref={ref} className="w-full rounded-[4px] outline-none border-2 focus:border-primary px-5 py-4 " />
  )

  TextInput.displayName = 'TextInput';
})

export default TextInput;