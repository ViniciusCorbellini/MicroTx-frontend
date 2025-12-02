// src/components/common/InputField.jsx
import styles from '../../styles/InputField.module.css';

/**
 * Componente de Campo de Entrada (Input) Reutilizável.
 *
 * @component
 * @description
 * Padroniza a exibição de inputs nos formulários (Login, Cadastro), encapsulando:
 * 1. Label acessível (htmlFor).
 * 2. Feedback visual de erro: Aplica a classe `isInvalid` e exibe mensagem
 * vermelha caso a prop `error` seja fornecida.
 *
 * @param {Object} props
 * @param {string} props.label - Texto do rótulo exibido acima do campo.
 * @param {string} props.name - Identificador (id/name) usado pelo HTML e pelo handler de mudança.
 * @param {string} [props.type='text'] - Tipo do input HTML (ex: 'email', 'password'). Default: 'text'.
 * @param {string} props.value - O valor atual do campo (Controlled Component).
 * @param {function} props.onChange - Callback executado a cada digitação.
 * @param {string} [props.placeholder] - Texto de ajuda exibido quando o campo está vazio.
 * @param {string} [props.error] - Mensagem de validação. Se presente, altera a borda do input para vermelho.
 */
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