import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Button from "../../components/general/Button";
import TextInput from "../../components/general/TextInput";
import AuthWrapper from "../components/login/AuthWrapper";
import Toast from "../../components/general/Toast";
import type { Err } from "../../types/utility.types";
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "@/hooks/use-user";

const RegisterPage = () => {
  const { mutateAsync: createUser } = useCreateUser();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setInputs((vals) => ({ ...vals, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = {
      fullName: inputs.lastName + " " + inputs.firstName,
      email: inputs.email,
      password: inputs.password,
    };
    try {
      const data = await createUser(values);
      if (data) {
        setSuccess("Successful, proceed to login");
        navigate("/login");
      }
    } catch (error) {
      if ((error as Err)?.status === 500) {
        setError((error as Err)?.message);
      } else {
        if ((error as Err)?.response?.data?.error?.fieldErrors?.fullName) {
          setError(
            (error as Err)?.response?.data?.error?.fieldErrors?.fullName
          );
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
    <AuthWrapper pageTitle="Create an account" type="register">
      {error ? <Toast type="error" message={error} /> : ""}
      {success ? <Toast type="success" message={success} /> : ""}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 w-full">
        <div className="grid grid-cols-2 gap-5">
          <TextInput
            type="text"
            placeholder="First name*"
            name="firstName"
            value={inputs.firstName}
            aria-label="First Name"
            onChange={handleInputs}
          />
          <TextInput
            type="text"
            placeholder="Last name*"
            aria-label="Last Name"
            name="lastName"
            value={inputs.lastName}
            onChange={handleInputs}
          />
        </div>
        <TextInput
          type="email"
          placeholder="Email address*"
          aria-label="Email"
          name="email"
          value={inputs.email}
          onChange={handleInputs}
        />
        <TextInput
          type="password"
          placeholder="Password*"
          aria-label="Password"
          name="password"
          value={inputs.password}
          onChange={handleInputs}
        />
        <Button styles="text-white text-xs bg-primary" type="submit">
          SIGN UP
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default RegisterPage;
