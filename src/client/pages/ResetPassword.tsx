import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AuthWrapper from "../components/login/AuthWrapper";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import type { Err } from "../../types/utility.types";
import { useResetPassword } from "@/hooks/use-user";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const resetToken = params.get("token");
  const email = params.get("email");

  const { mutateAsync: resetPassword } = useResetPassword();
  const [inputs, setInputs] = useState({
    email: email || "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!resetToken) {
      toast.error("Invalid or missing reset token.");
    }
  }, [resetToken]);

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

    if (!resetToken) {
      toast.error("Missing token. Request a new password reset.");
      return;
    }

    if (inputs.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (inputs.password !== inputs.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({
        token: resetToken,
        password: inputs.password,
        email: inputs.email,
      });

      toast.success("Password reset successful. You can now log in.");
      setInputs({ email: "", password: "", confirmPassword: "" });
    } catch (error) {
      if ((error as Err)?.status === 500) {
        toast.error((error as Err)?.message);
      } else if ((error as any)?.response?.data?.error) {
        toast.error((error as any).response.data.error);
      } else {
        toast.error("Unable to reset password. Try again.");
      }
    }
  };

  return (
    <AuthWrapper pageTitle="Create New Password" type="forgot-password">
      <form onSubmit={handleSubmit} className="w-full mt-4">
        <p className="text-sm mb-4 text-gray-700 text-center">
          Enter your new password below to complete the reset process.
        </p>

        <div className="flex flex-col gap-4 w-full">
          <TextInput
            type="password"
            name="password"
            placeholder="New Password*"
            aria-label="new-password"
            required
            value={inputs.password}
            onChange={handleInputs}
          />

          <TextInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password*"
            aria-label="confirm-password"
            required
            value={inputs.confirmPassword}
            onChange={handleInputs}
          />

          <Button styles="text-white text-xs bg-primary" type="submit">
            RESET PASSWORD
          </Button>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default ResetPasswordPage;
