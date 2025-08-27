import type { FormEvent } from "react"
import Button from "../components/general/Button"
import TextInput from "../components/general/TextInput"
import AuthWrapper from "../components/Login/AuthWrapper"

const RegisterPage = () => {

  const handleSubmit = (e: FormEvent) => {
    return e.preventDefault();
  }

  return (
    <AuthWrapper
      pageTitle="Create an account"
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-5">
          <TextInput type="text" placeholder="First name*" />
          <TextInput type="text" placeholder="Last name*" />
        </div>
        <TextInput type="email" placeholder="Email address*" />
        <TextInput type="password" placeholder="password*" />
        <Button
          styles="text-white text-xs bg-linear-to-r from-sec to-primary "
          type="submit"
        >
          SIGN UP
        </Button>
      </form>
    </AuthWrapper>
  )
}

export default RegisterPage