import "../styles/inputs.css";

function TextInput({ value, onChange, name, placeholder, setState, disabled }) {
  return (
    <input
      type="text"
      name={name}
      className="cltextinput"
      placeholder={placeholder}
      disabled={disabled ? true : false}
      value={value}
      onChange={(e) => onChange(e, setState)}
    />
  );
}

export default TextInput;
