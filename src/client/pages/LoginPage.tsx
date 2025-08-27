import type { FormEvent } from "react";
import AuthWrapper from "../components/Login/AuthWrapper"
import TextInput from "../components/general/TextInput";
import Button from "../components/general/Button";

const LoginPage = () => {

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  }

  return (
    <AuthWrapper
      pageTitle="Welcome back"
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-4 w-full">
          <TextInput type="email" placeholder="E-mail address*" />
          <TextInput type="password" placeholder="Password*" />
          <Button
            styles="text-white text-xs bg-linear-to-r from-sec to-primary "
            type="submit"
          >
            SIGN IN
          </Button>
        </div>
      </form>
    </AuthWrapper>
  )
}

export default LoginPage