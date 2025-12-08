import { memo } from "react";

const Horizontals = () => {
  return (
    <div className="flex items-center w-full gap-5 justify-between">
      <hr className="h-[1px] flex-1 border-none bg-black/30" />
      <h2 className="text-[17px] font-extrabold">OR</h2>
      <hr className="h-[1px] flex-1 border-none bg-black/30" />
    </div>
  );
};

export default memo(Horizontals);
