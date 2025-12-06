import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import AuthWrapper from "../components/Login/AuthWrapper";
import TextInput from "../components/general/TextInput";
import Button from "../components/general/Button";
import type { Err } from "../../types/utility.types";
import Toast from "../components/general/Toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  // const { api } = useAppContext();
  const navigate = useNavigate();

  const [error, setError] = useState("");

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
      const data = {};
      if (data) {
        navigate(0);
        navigate("/store");
      }
    } catch (error) {
      if ((error as Err)?.status === 500) {
        setError((error as Err)?.message);
      } else {
        console.log(error);
        if ((error as any)?.response?.data?.error) {
          setError((error as any)?.response?.data?.error);
        }
      }
    }
  };

  useEffect(() => {
    if (error) {
      const reportError = setTimeout(() => setError(""), 4000);

      return () => clearTimeout(reportError);
    }
  }, [error]);

  return (
    <AuthWrapper pageTitle="Welcome back" type="login">
      {error ? <Toast type="error" message={error} /> : ""}

      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-4 w-full">
          <TextInput
            type="email"
            name="email"
            placeholder="E-mail address*"
            aria-label="email"
            value={inputs.email}
            onChange={handleInputs}
          />
          <TextInput
            type="password"
            placeholder="Password*"
            name="password"
            aria-label="passoword"
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
