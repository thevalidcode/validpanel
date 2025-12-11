import { useState, type ChangeEvent, type FormEvent } from "react";
import AuthWrapper from "../components/login/AuthWrapper";
import TextInput from "../../components/general/TextInput";
import Button from "../../components/general/Button";
import type { Err } from "../../types/utility.types";
import { useUserLogin } from "@/hooks/use-user";
import { toast } from "sonner";

const LoginPage = () => {
  const { mutateAsync: loginUser } = useUserLogin();

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
    try {
      await loginUser(values);
    } catch (error) {
      if ((error as Err)?.status === 500) {
        toast.error((error as Err)?.message);
      } else {
        console.log(error);
        if ((error as any)?.response?.data?.error) {
          toast.error((error as any)?.response?.data?.error);
        }
      }
    }
  };

  return (
    <AuthWrapper pageTitle="Welcome back" type="login">
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
            SIGN IN
          </Button>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default LoginPage;
