import { useState, type ChangeEvent, type FormEvent } from "react";
import AuthWrapper from "../components/login/AuthWrapper";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { useAdminLogin } from "@/hooks/use-admin";
import { useVerifySessionCode } from "@/hooks/use-auth";

const LoginPage = () => {
  const { mutateAsync: loginUser, isPending } = useAdminLogin();
  const { mutate: verifySessionCode, isPending: isVerifyingSession } =
    useVerifySessionCode("ADMIN");

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
            required
            value={inputs.email}
            onChange={handleInputs}
          />
          <TextInput
            type="password"
            placeholder="Password*"
            required
            name="password"
            aria-label="passoword"
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
