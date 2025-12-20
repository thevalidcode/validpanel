import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import googleImgUrl from "../../assets/images/google.svg";

interface ButtonComponentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isgoogle?: "true" | "false";
  styles?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonComponentProps>(
  ({ ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px",
          minHeight: "58px",
          borderRadius: 28,
          cursor: "pointer",
        }}
        className={`border-2 transition-all btn-custom ${props.styles}`}
      >
        <span className="inline-block font-extrabold tracking-[1.28px] ">
          {" "}
          {props.children}{" "}
        </span>
        {props.isgoogle && props.isgoogle === "true" ? (
          <img title="google" src={googleImgUrl} className="w-[26px] h-6 " />
        ) : (
          ""
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
