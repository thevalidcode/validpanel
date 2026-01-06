import { useState, type ChangeEvent, type FormEvent } from "react";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import AuthWrapper from "../components/login/AuthWrapper";
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { useVerifySessionCode } from "@/hooks/use-auth";

const RegisterPage = () => {
  const { mutateAsync: createUser, isPending } = useCreateUser();
  const navigate = useNavigate();
  const { mutate: verifySessionCode, isPending: isVerifyingSession } =
    useVerifySessionCode("USER");

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
        toast.success("Successful, proceed to login");
        navigate("/login");
      }
    } catch (error) {}
  };

  return (
    <AuthWrapper
      pageTitle="Create an account"
      type="register"
      verifySessionCode={verifySessionCode}
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 w-full">
        <div className="grid grid-cols-2 gap-5">
          <TextInput
            type="text"
            placeholder="First name*"
            name="firstName"
            required
            value={inputs.firstName}
            aria-label="First Name"
            onChange={handleInputs}
          />
          <TextInput
            type="text"
            placeholder="Last name*"
            aria-label="Last Name"
            required
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
          required
          value={inputs.email}
          onChange={handleInputs}
        />
        <TextInput
          type="password"
          placeholder="Password*"
          required
          aria-label="Password"
          name="password"
          value={inputs.password}
          onChange={handleInputs}
        />
        <Button styles="text-white text-xs bg-primary" type="submit">
          {isPending || isVerifyingSession ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default RegisterPage;
