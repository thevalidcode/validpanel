import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import AuthWrapper from "../components/login/AuthWrapper";
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { useVerifySessionCode } from "@/hooks/use-user";
import CustomSelect, {
  type CustomSelectRef,
  type Option,
} from "@/components/ui/CustomSelect";
import { REFERRAL_SOURCES } from "@/constants/referralSources";

// Convert to CustomSelect options
const referralSourceOptions: Option<string>[] = REFERRAL_SOURCES.map(
  (source) => ({
    label: source,
    value: source,
  })
);

const RegisterPage = () => {
  const { mutateAsync: createUser, isPending } = useCreateUser();
  const navigate = useNavigate();
  const { mutate: verifySessionCode, isPending: isVerifyingSession } =
    useVerifySessionCode();

  const referralSelectRef = useRef<CustomSelectRef>(null);

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [referralSource, setReferralSource] = useState<Option<string> | null>(
    null
  );
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setInputs((vals) => ({ ...vals, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate referral source
    const isReferralValid = referralSelectRef.current?.validate();
    if (!isReferralValid) {
      toast.error("Please select how you heard about us");
      return;
    }

    if (!referralSource) {
      toast.error("Please select how you heard about us");
      return;
    }

    const marketingData: Record<string, any> = {
      source: referralSource.value,
      timestamp: new Date().toISOString(),
    };

    if (additionalInfo.trim()) {
      marketingData.additionalInfo = additionalInfo.trim();
    }

    const values = {
      fullName: inputs.lastName + " " + inputs.firstName,
      email: inputs.email,
      password: inputs.password,
      referralSource: referralSource.value,
      marketingData,
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
      isGoogleDisabled={isPending}
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

        {/* Referral Source Section */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 block">
            How did you hear about us?*
          </label>
          <CustomSelect
            options={referralSourceOptions}
            ref={referralSelectRef}
            value={referralSource || undefined}
            required={true}
            isSearchable={true}
            placeholder="Select where you found us..."
            onChange={(opt) => setReferralSource(opt as Option<string>)}
          />
          <p className="text-xs text-gray-500 mt-1">
            This helps us improve our marketing efforts
          </p>
        </div>

        {/* Additional Details */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 block">
            Additional Details (Optional)
          </label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="E.g., specific influencer name, blog post title, friend's name, etc."
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
            rows={2}
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Help us track specific campaigns or referrers
            </p>
            <span className="text-xs text-gray-400">
              {additionalInfo.length}/500
            </span>
          </div>
        </div>

        <span className="text-sm text-gray-600">
          By signing up i agree to the
          <a
            href="/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline"
          >
            Privacy Policy
          </a>{" "}
          of Valid Panel
        </span>
        <Button styles="text-white text-xs bg-primary" type="submit">
          {isPending || isVerifyingSession ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default RegisterPage;
