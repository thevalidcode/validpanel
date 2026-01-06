import { useState, type ChangeEvent, type FormEvent } from "react";
import AuthWrapper from "../components/login/AuthWrapper";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { useUserLogin } from "@/hooks/use-user";
import { useVerifySessionCode } from "@/hooks/use-auth";

const LoginPage = () => {
  const { mutateAsync: loginUser, isPending } = useUserLogin();
  const { mutate: verifySessionCode, isPending: isVerifyingSession } =
    useVerifySessionCode("USER");

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((val) => ({
      ...val,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = {
      email: inputs.email,
      password: inputs.password,
    };
    await loginUser(values);
  };

  return (
    <AuthWrapper
      pageTitle="Welcome back"
      type="login"
      verifySessionCode={verifySessionCode}
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-4 w-full">
          <TextInput
            type="email"
            name="email"
            placeholder="E-mail address*"
            aria-label="email"
            value={inputs.email}
            required
            onChange={handleInputs}
          />
          <TextInput
            type="password"
            placeholder="Password*"
            name="password"
            required
            aria-label="password"
            value={inputs.password}
            onChange={handleInputs}
          />
          <Button styles="text-white text-xs bg-primary" type="submit">
            {isPending || isVerifyingSession ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default LoginPage;
