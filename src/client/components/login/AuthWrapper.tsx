import { useEffect, type FC, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import productImage from "../../../assets/images/product.png";
import storeImage from "../../../assets/images/chat.png";
import salesImage from "../../../assets/images/sales.png";
import pinImage from "../../../assets/images/pin.png";
import MainTitle from "../../../components/ui/MainTitle";
import Button from "../../../components/ui/Button";
import Horizontals from "../../../components/ui/Horizontals";
import { useAppContext } from "../../../context/useAppContext";

const authBody = [
  {
    title: "Product & Service Discovery",
    image: productImage,
    description:
      "Easily browse and discover trending digital products and services to add to your store.",
  },
  {
    title: "Store Management Dashboard",
    image: storeImage,
    description:
      "Monitor your sales, orders, and customer data from one powerful dashboard built for ease.",
  },
  {
    title: "Sales Boost Toolkit",
    image: salesImage,
    description:
      "Access features like custom promo links, shareable store pages, and referral tracking to grow faster.",
  },
  {
    title: "Simple, Seller-First Design",
    image: pinImage,
    description:
      "Created for entrepreneurs of all experience levels no coding or setup needed.",
  },
];

interface Props {
  children: ReactNode;
  pageTitle: string;
  type: "register" | "login" | "forgot-password";
}

const AuthWrapper: FC<Props> = ({ children, pageTitle, type }) => {
  const navigate = useNavigate();
  const { isAuthLoading, userInfo } = useAppContext();

  useEffect(() => {
    if (!isAuthLoading && userInfo && type !== "forgot-password") {
      navigate("/analytics");
    }
  }, [userInfo, isAuthLoading, navigate, type]);

  return (
    <main className="lg:h-screen items-center py-20 justify-center w-full radial_background_primary text-black flex flex-col lg:flex-row">
      <section className="w-full py-[66.6px] px-[21px] flex flex-col gap-6 items-center sm:px-10 lg:px-16 xl:px-[108px]">
        <MainTitle pryTitle={pageTitle} />

        {/* Google only for login/register */}
        {type !== "forgot-password" && (
          <>
            <Button isgoogle="true" styles="w-[353px]">
              SIGN {type === "register" ? "UP" : "IN"} VIA GOOGLE
            </Button>
            <Horizontals />
          </>
        )}

        {children}

        {/* Bottom Links */}
        <div className="w-full mt-2">
          {type === "login" && (
            <p className="text-center leading-6 flex items-center justify-center">
              <span className="text-xs">Don’t have account?</span>
              <Link
                to="/register"
                className="text-primary hover:text-primary/80 ml-1"
              >
                Register
              </Link>
            </p>
          )}

          {type === "register" && (
            <p className="text-center leading-6 flex items-center justify-center">
              <span className="text-xs">Already have an account?</span>
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 ml-1"
              >
                Login
              </Link>
            </p>
          )}

          {type === "login" && (
            <Link
              to="/forgot-password"
              className="text-center text-sm text-primary block hover:text-primary/80 mt-1"
            >
              Forgot Password?
            </Link>
          )}

          {type === "forgot-password" && (
            <Link
              to="/login"
              className="text-center text-sm text-primary block hover:text-primary/80 mt-1"
            >
              Back to Login
            </Link>
          )}
        </div>
      </section>

      <section className="w-full px-[21px] py-10 space-y-10 sm:px-10 lg:px-16 xl:px-[108px]">
        {authBody.map((item) => (
          <div
            key={item.title}
            className="flex flex-col gap-3 lg:flex-row lg:items-start"
          >
            <img src={item.image} alt={item.title} width={64} height={64} />
            <div className="space-y-2">
              <h2 className="font-extrabold text-[23.14px]">{item.title}</h2>
              <p className="font-medium text-[13.65px]">{item.description}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default AuthWrapper;
