// src/hooks/useFetch.js
import { useState, useEffect } from 'react';

/**
 * Hook genérico para gerenciar o estado de chamadas assíncronas (API).
 *
 * @template T - O tipo de dado esperado na resposta (ex: User, Product[], etc).
 *
 * @param {() => Promise<T>} apiServiceCall - Função que retorna uma Promise com os dados (ex: `() => api.get('/users')`).
 * @param {Array} [dependencies=[]] - Lista de dependências que, se alteradas, disparam uma nova chamada.
 *
 * @returns {{
 * data: T | null,
 * loading: boolean,
 * error: string | null
 * }} Um objeto contendo o estado atual da requisição.
 */
export const useFetch = (apiServiceCall, dependencies = []) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const result = await apiServiceCall();
				setData(result);
			} catch (err) {
				setError(err.message || 'Ocorreu um erro');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, dependencies); // O array de dependências permite chamar o fetch dnv se algo mudar

	return { data, loading, error };
};