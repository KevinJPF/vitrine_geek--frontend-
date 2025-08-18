import Styles from "./input.module.css";

/**
 * Enum com as máscaras mais comuns.
 */
export const MasksEnum = {
  NONE: "NONE",
  CPF: "CPF",
  PHONE: "PHONE",
  CEP: "CEP",
  DATE: "DATE",
  CREDIT_CARD: "CREDIT_CARD",
};

const getMaxLengthForMask = (maskType) => {
  switch (maskType) {
    case MasksEnum.CPF:
      return 14; // 000.000.000-00
    case MasksEnum.PHONE:
      return 15; // (00) 00000-0000
    case MasksEnum.CEP:
      return 9; // 00000-000
    case MasksEnum.DATE:
      return 10; // 00/00/0000
    case MasksEnum.CREDIT_CARD:
      return 19; // 0000.0000.0000.0000
    default:
      return undefined;
  }
};

const Input = ({
  value = "",
  isOnlyNumbers = false,
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  maxLength,
  isPassword = false,
  isCorrect = null,
  maskType = MasksEnum.NONE,
}) => {
  const applyMask = (value) => {
    switch (maskType) {
      case MasksEnum.CPF:
        return value
          .replace(/\D/g, "")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      case MasksEnum.PHONE:
        return value
          .replace(/\D/g, "")
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{5})(\d)/, "$1-$2");
      case MasksEnum.CEP:
        return value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
      case MasksEnum.DATE:
        return value
          .replace(/\D/g, "")
          .replace(/(\d{2})(\d)/, "$1/$2")
          .replace(/(\d{2})(\d)/, "$1/$2");
      case MasksEnum.CREDIT_CARD:
        return value
          .replace(/\D/g, "")
          .replace(/(\d{4})(?=\d)/g, "$1.")
          .substring(0, 19);
      default:
        return value;
    }
  };

  const handleChange = (e) => {
    let val = e.target.value;

    if (isOnlyNumbers) {
      // remove tudo que não for número e salva na variável
      val = val.replace(/\D/g, "");
    }

    // chama o onChange passando o valor já filtrado
    const masked = applyMask(val);
    onChange(masked);
  };

  const finalMaxLength =
    maskType !== MasksEnum.NONE ? getMaxLengthForMask(maskType) : maxLength;

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
        maxLength={finalMaxLength}
      />
    </div>
  );
};

export default Input;
