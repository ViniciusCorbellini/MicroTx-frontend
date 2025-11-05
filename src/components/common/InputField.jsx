// src/components/common/InputField.jsx
import styles from '../../styles/InputField.module.css';

export default function InputField({ label, name, type = 'text', value, onChange, placeholder, error }) {
  // Constrói a lista de classes para o input
  const inputClasses = [
    styles.input,         // Sempre usa a classe base
    error ? styles.isInvalid : '' // Adiciona a classe de erro se 'error' for verdadeiro
  ].join(' '); // Junta tudo em uma string: "InputField_input__123 InputField_isInvalid__abc"

  return (
    <div className={styles.wrapper}> 
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      
      <input
        type={type}
        id={name}
        name={name}

        className={inputClasses} 
        value={value}
        onChange={onChange}
        placeholder={placeholder || ''}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}