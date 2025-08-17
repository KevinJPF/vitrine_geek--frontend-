import Styles from "./input.module.css";

const Input = ({
  value = "",
  isOnlyNumbers = false,
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  maxLength,
  isPassword = false,
  isCorrect = null,
}) => {
  const handleChange = (e) => {
    let val = e.target.value;

    if (isOnlyNumbers) {
      // remove tudo que não for número e salva na variável
      val = val.replace(/\D/g, "");
    }

    // chama o onChange passando o valor já filtrado
    onChange(val);
  };

  return (
    <div className="col-12 p-0">
      <input
        className={`${Styles.input} ${
          isCorrect != null &&
          (isCorrect ? Styles.input_ok : Styles.input_error)
        } shadow`}
        type={isPassword ? "password" : "text"}
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        maxLength={maxLength}
      />
    </div>
  );
};

export default Input;
