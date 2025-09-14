import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./input.module.css";
import { faCheck, faExclamation } from "@fortawesome/free-solid-svg-icons";

/**
 * Enum com as máscaras mais comuns.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const MasksEnum = {
  NONE: "NONE",
  CPF: "CPF",
  CEL: "CEL",
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
      return 9; // 0000-0000
    case MasksEnum.CEL:
      return 10; // 00000-0000
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
  label,
  isOnlyNumbers = false,
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  maxLength,
  isPassword = false,
  isRequired = false,
  isCorrect = null,
  maskType = MasksEnum.NONE,
  data_cy = "",
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
        return value.replace(/\D/g, "").replace(/(\d{4})(\d)/, "$1-$2");
      case MasksEnum.CEL:
        return value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
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
    <div className="col">
      {label && (
        <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
          {label}
          {isRequired && (
            <div className="col-auto p-0" style={{ color: "var(--red)" }}>
              *
            </div>
          )}
        </div>
      )}
      <div className="col-12 p-0 position-relative">
        <input
          className={`${styles.input} ${
            isCorrect != null &&
            (isCorrect ? styles.input_ok : styles.input_error)
          } shadow`}
          type={isPassword ? "password" : "text"}
          value={value}
          data-cy={data_cy}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          maxLength={finalMaxLength}
        />
        {isCorrect != undefined && (
          <div
            className={`${styles.alert_icon} ${
              isCorrect && styles.alert_icon_correct
            }`}
          >
            <FontAwesomeIcon icon={isCorrect ? faCheck : faExclamation} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
