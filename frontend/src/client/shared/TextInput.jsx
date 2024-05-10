import "../styles/inputs.css";

function TextInput({ value, onChange, name, placeholder, setState }) {
  return (
    <input
      type="text"
      name={name}
      className="cltextinput"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e, setState)}
    />
  );
}

export default TextInput;
