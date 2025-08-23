import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

const HistoryPage = () => {
    const [transactions, setTransactions] = useState([]);

    const fetchTransactions = async () => {
        try {
            const { data } = await api.get('/api/transactions');
            setTransactions(data);
        } catch (error) {
            console.error('Failed to fetch transaction history', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await api.delete(`/api/transactions/${id}`);
                fetchTransactions(); // Refresh list after deletion
            } catch (error) {
                console.error("Failed to delete transaction", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Transaction History</h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="space-y-4">
                    {transactions.length > 0 ? (
                        transactions.map(t => (
                            <div key={t.id} className="flex justify-between items-center p-4 bg-gray-700 rounded-md">
                                <div>
                                    <p className="text-lg font-semibold">{t.description}</p>
                                    <p className="text-sm text-gray-400">{new Date(t.date).toLocaleDateString('en-GB')}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <p className={`font-bold text-xl ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </p>
                                    <button onClick={() => handleDelete(t.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md">&times;</button>
                                </div>
                            </div>
                        ))
                    ) : (
                         <p className="text-gray-500 text-center py-8">You have no transaction history yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;