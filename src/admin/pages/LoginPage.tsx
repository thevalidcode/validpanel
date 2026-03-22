import { useState, type ChangeEvent, type FormEvent } from "react";
import AuthWrapper from "../components/login/AuthWrapper";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { useAdminLogin } from "@/hooks/use-admin";
import { useVerifySessionCode } from "@/hooks/use-admin";

const LoginPage = () => {
  const { mutateAsync: loginUser, isPending } = useAdminLogin();
  const { mutate: verifySessionCode, isPending: isVerifyingSession } =
    useVerifySessionCode();

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
      isGoogleDisabled={isVerifyingSession}
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
          <Button 
            styles="text-white text-xs bg-[var(--color-primary)] hover:bg-purple-700 border-none shadow-lg shadow-purple-500/20 font-bold" 
            type="submit"
            style={{ borderRadius: '4px' }}
          >
            {isPending || isVerifyingSession ? "SIGNING IN..." : "SIGN IN"}
          </Button>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default LoginPage;
