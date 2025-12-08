import type { FC } from "react";

interface Props {
  type: "success" | "error";
  message: string;
}

const Toast: FC<Props> = ({ type, message }) => {
  return (
    <p
      className={`${
        type === "success" ? "text-green-400" : "text-red-400"
      } animate-slideDown bg-stone-100 shadow text-xs md:text-sm px-4 py-2 rounded fixed z-50 top-14 left-1/2 -translate-x-1/2`}
    >
      {message}
    </p>
  );
};

export default Toast;
