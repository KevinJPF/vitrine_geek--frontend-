import Styles from "./Button.module.css";

const Button = ({ text = "btn", onClick = () => {} }) => {
  return (
    <button className={Styles.button} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
