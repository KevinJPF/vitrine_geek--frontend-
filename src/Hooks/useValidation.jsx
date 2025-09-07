export default function useValidation() {
  // Campo vazio ou com tamanho mínimo
  const validateRequired = (value, minLength = 1) =>
    value && value.toString().trim().length >= minLength;

  // CPF
  const validateCPF = (value, validateOnlyNumberQuantity = false) => {
    let cpf = value.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    if (validateOnlyNumberQuantity) return true;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;
    if (firstDigit !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    let secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;
    return secondDigit === parseInt(cpf.charAt(10));
  };

  // Email
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // DDD (2 dígitos)
  const validateDDD = (value) => /^\d{2}$/.test(value.replace(/\D/g, ""));

  // Telefone (formato simples, 8 ou 0 dígitos)
  const validatePhone = (value) => /^\d{8,9}$/.test(value.replace(/\D/g, ""));

  // CEP (apenas dígitos, 8 caracteres)
  const validateCEP = (value) => /^\d{8}$/.test(value.replace(/\D/g, ""));

  // Número de cartão (Luhn algorithm)
  const validateCreditCard = (value, validateOnlyNumberQuantity = false) => {
    const digits = value.replace(/\D/g, "");

    if (validateOnlyNumberQuantity && digits.length == 16) return true;

    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  // Data no formato "dd/mm/aaaa" (ignora as barras)
  const validateDate = (value) => {
    // remove tudo que não for número
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 8) return false;

    const day = parseInt(digits.substring(0, 2));
    const month = parseInt(digits.substring(2, 4));
    const year = parseInt(digits.substring(4, 8));

    // cria a data
    const date = new Date(year, month - 1, day);

    // confere se os valores conferem com a data criada
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  // Senha deve ter: 8+ caracteres, letra maiúscula, letra minúscula e caractere especial
  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

    return regex.test(value);
  };

  return {
    validateRequired,
    validateCPF,
    validateEmail,
    validateDDD,
    validatePhone,
    validateCEP,
    validateCreditCard,
    validateDate,
    validatePassword,
  };
}
