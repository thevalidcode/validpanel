import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import "../styles/inputs.css";
import React, { useState } from "react";

function PasswordInput({ value, onChange, setState }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <React.Fragment>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        name="password"
        className="cltextinput"
        value={value}
        onChange={(e) => onChange(e, setState)}
      />
      <div className="clpassicondiv">
        {showPassword ? (
          <FaEyeSlash
            className="clpassicon"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <FaEye
            className="clpassicon"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default PasswordInput;
