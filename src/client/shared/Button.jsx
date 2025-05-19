import "../styles/button.css";

function Button({ name, type, loading, onClick, width }) {
  return (
    <button
      type={loading ? "button" : type}
      style={{ width: width }}
      className="clspinbutton"
      id={loading ? "clspnbtnloading" : "clspnbtn"}
      onClick={onClick ? onClick : null}
    >
      {loading ? <div className="spinner"></div> : ""}
      {name}
    </button>
  );
}

export default Button;
