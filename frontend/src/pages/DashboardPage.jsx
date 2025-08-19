import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({ type: 'expense', amount: '', description: '', date: new Date().toISOString().slice(0, 10) });

    const fetchTransactions = async () => {
        try {
            const { data } = await api.get('/api/transactions');
            setTransactions(data);
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.description || !formData.date) {
            alert("Please fill all fields.");
            return;
        }
        try {
            await api.post('/api/transactions', formData);
            fetchTransactions();
            setFormData({ type: 'expense', amount: '', description: '', date: new Date().toISOString().slice(0, 10) });
        } catch (error) {
            console.error('Failed to add transaction', error);
        }
    };

    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const balance = income - expenses;

    const chartData = {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [income, expenses],
            backgroundColor: ['#10B981', '#EF4444'],
            borderColor: ['#1F2937', '#1F2937'],
            borderWidth: 4,
        }]
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-green-400">Total Income</h3>
                    <p className="text-3xl font-bold text-white">{formatCurrency(income)}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-red-400">Total Expenses</h3>
                    <p className="text-3xl font-bold text-white">{formatCurrency(expenses)}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-blue-400">Balance</h3>
                    <p className="text-3xl font-bold text-white">{formatCurrency(balance)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Add New Transaction</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-400">Description</label>
                            <input type="text" name="description" value={formData.description} onChange={handleInputChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-400">Amount (₹)</label>
                            <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-400">Date</label>
                            <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-400">Type</label>
                            <select name="type" value={formData.type} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500">
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold transition-colors">Add Transaction</button>
                    </form>
                </div>
                <div className="lg:col-span-3 bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-center">
                    <div className="w-full max-w-sm">
                        <Doughnut data={chartData} options={{ maintainAspectRatio: true, plugins: { legend: { labels: { color: 'white', font: { size: 14 } }}}}} />
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Recent History</h3>
                <div className="space-y-3">
                    {transactions.length > 0 ? (
                        transactions.slice(0, 5).map(t => (
                            <div key={t.id} className={`flex justify-between items-center p-3 bg-gray-700 rounded-md border-l-4 ${t.type === 'income' ? 'border-green-500' : 'border-red-500'}`}>
                                <div>
                                    <p className="font-semibold">{t.description}</p>
                                    <p className="text-sm text-gray-400">{new Date(t.date).toLocaleDateString('en-GB')}</p>
                                </div>
                                <p className={`font-bold text-lg ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No recent transactions to display.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;