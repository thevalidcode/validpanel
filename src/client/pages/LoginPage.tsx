import Button from "../components/general/Button"
import MainTitle from "../components/general/MainTitle"

const LoginPage = () => {
  return (
    <main className="w-full">
      <section className="w-full py-[66.6px] px-[21px] flex flex-col gap-6 items-center ">
        <MainTitle pryTitle="Create an account" />
        <Button name="SIGN IN VIA GOOGLE" />
      </section>
    </main>
  )
}

export default LoginPage