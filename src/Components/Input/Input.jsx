import Styles from "./input.module.css";

const Input = ({
  value = "",
  onChange = () => {},
  onFocus = () => {},
  onBlue = () => {},
  isPassword = false,
  isCorrect = null,
}) => {
  return (
    <div className="col-12 p-0">
      <input
        className={`${Styles.input} ${
          isCorrect != null &&
          (isCorrect ? Styles.input_ok : Styles.input_error)
        } shadow`}
        type={isPassword ? "password" : "text"}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlue}
      />
    </div>
  );
};

export default Input;
