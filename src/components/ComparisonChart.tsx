import React from 'react';
import { MonthlyData } from '../types';
import { calculateTotalRevenue } from '../utils/calculations';

interface ComparisonChartProps {
  data: MonthlyData[];
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => {
  if (data.length === 0) return null;

  const maxRevenue = Math.max(...data.map(d => calculateTotalRevenue(d)));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Revenue Comparison</h2>
      <div className="space-y-4">
        {data.slice(-6).map((monthData) => {
          const revenue = calculateTotalRevenue(monthData);
          const percentage = (revenue / maxRevenue) * 100;
          
          return (
            <div key={monthData.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  {monthData.month} {monthData.year}
                </span>
                <span className="text-lg font-bold text-blue-600">
                  ${revenue.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComparisonChart;
