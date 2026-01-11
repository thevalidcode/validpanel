import { useState, type ChangeEvent, type FormEvent } from "react";
import AuthWrapper from "../components/login/AuthWrapper";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import type { Err } from "../../types/utility.types";
import { useForgotPassword, useVerifySessionCode } from "@/hooks/use-user";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const { mutateAsync: requestReset } = useForgotPassword();
  const { mutateAsync: verifyCode } = useVerifySessionCode();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await requestReset({ email });
      toast.success("Reset link sent to your email.");
    } catch (error) {
      if ((error as Err)?.status === 500) {
        toast.error((error as Err)?.message);
      } else if ((error as any)?.response?.data?.error) {
        toast.error((error as any).response.data.error);
      }
    }
  };

  return (
    <AuthWrapper
      pageTitle="Reset Password"
      type="forgot-password"
      verifySessionCode={verifyCode}
    >
      <form onSubmit={handleSubmit} className="w-full mt-4">
        <p className="text-sm mb-4 text-gray-700 text-center">
          Enter your email and we’ll send you a secure link to reset your
          password.
        </p>
        <div className="flex flex-col gap-4 w-full">
          <TextInput
            type="email"
            name="email"
            placeholder="E-mail address*"
            aria-label="email"
            required
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />

          <Button styles="text-white text-xs bg-primary" type="submit">
            SEND RESET LINK
          </Button>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default ForgotPasswordPage;
