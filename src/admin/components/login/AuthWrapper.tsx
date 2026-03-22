import { useEffect, useRef, type FC, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import productImage from "../../../assets/images/product.png";
import storeImage from "../../../assets/images/chat.png";
import salesImage from "../../../assets/images/sales.png";
import pinImage from "../../../assets/images/pin.png";
import MainTitle from "../../../components/ui/MainTitle";
import { useAppContext } from "../../../context/useAppContext";
import Loader from "@/components/Loader";

const authBody = [
  {
    title: "System Overview & Monitoring",
    image: productImage,
    description:
      "Gain centralized visibility across all platform activities, including user actions, resource usage, and operational performance.",
  },
  {
    title: "Administrative Control Panel",
    image: storeImage,
    description:
      "Manage users, stores, permissions, and system configurations through a structured, high-efficiency admin dashboard.",
  },
  {
    title: "Operational Tools & Automation",
    image: salesImage,
    description:
      "Access workflows and automation utilities designed to streamline administrative tasks, enforce policies, and optimize platform processes.",
  },
  {
    title: "Secure, Admin-First Architecture",
    image: pinImage,
    description:
      "Built with strict access control, audit readiness, and seamless usability to support all administrative roles effectively.",
  },
];

interface Props {
  children: ReactNode;
  pageTitle: string;
  type: "register" | "login" | "forgot-password";
  verifySessionCode: (args: { sessionCode: string }) => void;
  isGoogleDisabled?: boolean;
}

const AuthWrapper: FC<Props> = ({
  children,
  pageTitle,
  isGoogleDisabled = false,
  type,
  verifySessionCode,
}) => {
  const navigate = useNavigate();
  const { isAuthLoading, adminInfo, domain } = useAppContext();
  const [searchParams] = useSearchParams();
  const lastSessionCodeRef = useRef<string | null>(null);
  const sessionCodeFromQuery = searchParams.get("session_code");

  useEffect(() => {
    if (isAuthLoading) return;
    if (adminInfo && type !== "forgot-password") {
      navigate("/admin/overview");
      return;
    }
  }, [adminInfo, isAuthLoading, navigate, type]);

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.replace(
      `https://auth.validpanel.com/api/auth/core/google?role=ADMIN&redirect=https://${domain}/admin/${type}`,
    );
  };

  useEffect(() => {
    if (!sessionCodeFromQuery) return;

    const normalizedCode = sessionCodeFromQuery.trim();
    if (lastSessionCodeRef.current === normalizedCode) return;

    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidV4Regex.test(normalizedCode)) return;

    lastSessionCodeRef.current = normalizedCode;
    verifySessionCode({ sessionCode: normalizedCode });
  }, [sessionCodeFromQuery, verifySessionCode]);

  if (isAuthLoading) {
    return <Loader />;
  }

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-white page-transition">
      {/* LEFT: Form Section */}
      <section className="w-full lg:w-1/2 min-h-screen flex flex-col justify-start lg:justify-center pt-28 pb-12 lg:pt-0 lg:pb-0 px-6 sm:px-12 lg:px-20 relative z-10">
        {/* Grid Background */}
        <div
          className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="text-center lg:text-left">
            <MainTitle pryTitle={pageTitle} />
          </div>

          {/* Google only for login (No Register for Admin) */}
          {type !== "forgot-password" && (
            <div className="mb-8">
              <button
                onClick={handleGoogleLogin}
                disabled={isGoogleDisabled}
                className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-[4px] hover:bg-gray-50 transition-colors shadow-sm text-gray-700 font-medium"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue With Google
              </button>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>
          )}

          {children}

          {/* Bottom Links */}
          <div className="w-full mt-8 text-center text-sm text-gray-600">
            {type === "login" && (
              <div className="mt-4">
                <Link
                  to="/admin/forgot-password"
                  className="text-gray-500 hover:text-gray-900 transition-colors inline-block"
                >
                  Forgot your password?
                </Link>
              </div>
            )}

            {type === "forgot-password" && (
              <Link
                to="/admin/login"
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                Back to Login
              </Link>
            )}

            {/* REGISTER LINK REMOVED AS REQUESTED */}
          </div>
        </div>
      </section>

      {/* RIGHT: Feature Showcase */}
      <section className="hidden lg:flex w-1/2 bg-white border-l border-gray-100 flex-col justify-center px-16 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)] rounded-full blur-[120px] mix-blend-multiply opacity-10 pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-primary)] rounded-full blur-[120px] mix-blend-multiply opacity-10 pointer-events-none -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            Admin Control Center
          </h2>

          <div className="space-y-8">
            {authBody.map((item, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="w-12 h-12 rounded-[4px] bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-6 h-6 object-contain opacity-80"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthWrapper;
