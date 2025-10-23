import React from 'react';
import { MonthlyData } from '../types';
import { calculateTotalRevenue } from '../utils/calculations';

interface AllMonthsViewProps {
  data: MonthlyData[];
  onEdit: (month: MonthlyData) => void;
}

const AllMonthsView: React.FC<AllMonthsViewProps> = ({ data, onEdit }) => {
  const currentYear = new Date().getFullYear();
  const yearData = data.filter(d => d.year === currentYear);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6">
        <h2 className="text-3xl font-bold">All Months - {currentYear}</h2>
        <p className="text-lg opacity-90 mt-1">Complete year overview</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Month</th>
              <th className="px-4 py-3 text-right font-semibold">Leads</th>
              <th className="px-4 py-3 text-right font-semibold">Appts</th>
              <th className="px-4 py-3 text-right font-semibold">Showed</th>
              <th className="px-4 py-3 text-right font-semibold">Enrolled</th>
              <th className="px-4 py-3 text-right font-semibold">Total Revenue</th>
              <th className="px-4 py-3 text-right font-semibold">Students End</th>
              <th className="px-4 py-3 text-right font-semibold">Student Value</th>
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {yearData.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No data for {currentYear}
                </td>
              </tr>
            ) : (
              yearData.map((month) => {
                const totalRev = calculateTotalRevenue(month);
                const studentVal = month.studentsEnd > 0 ? totalRev / month.studentsEnd : 0;
                return (
                  <tr key={month.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{month.month}</td>
                    <td className="px-4 py-3 text-right">{month.leads}</td>
                    <td className="px-4 py-3 text-right">{month.appointments}</td>
                    <td className="px-4 py-3 text-right">{month.showed}</td>
                    <td className="px-4 py-3 text-right">{month.enrollments}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      ${totalRev.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">{month.studentsEnd}</td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">
                      ${studentVal.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onEdit(month)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllMonthsView;
