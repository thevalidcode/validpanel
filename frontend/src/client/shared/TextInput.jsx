import "../styles/inputs.css";

function TextInput({
  value,
  onChange,
  name,
  placeholder,
  setState,
  disabled,
  autoComplete,
}) {
  return (
    <input
      type="text"
      name={name}
      className="cltextinput"
      autoComplete={autoComplete ? autoComplete : "on"}
      placeholder={placeholder}
      disabled={disabled ? true : false}
      value={value}
      onChange={(e) => onChange(e, setState)}
    />
  );
}

export default TextInput;
