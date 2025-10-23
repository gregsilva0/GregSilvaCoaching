import React from 'react';
import { MonthlyData } from '../types';

interface MonthSelectorProps {
  months: MonthlyData[];
  selectedMonth: string | null;
  onSelect: (id: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ months, selectedMonth, onSelect }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Select Month</h3>
      <div className="flex flex-wrap gap-2">
        {months.map((month) => (
          <button
            key={month.id}
            onClick={() => onSelect(month.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedMonth === month.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {month.month} {month.year}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MonthSelector;
