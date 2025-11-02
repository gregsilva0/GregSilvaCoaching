import React from 'react';
import { MonthlyData } from '../types';
import { calculateTotalRevenue, calculateChurn, calculateAverageMonthlyRetention, calculateStudentValue, calculateLifetimeValue } from '../utils/calculations';


interface AllMonthsViewProps {
  data: MonthlyData[];
  onEdit: (month: MonthlyData) => void;
}

const AllMonthsView: React.FC<AllMonthsViewProps> = ({ data, onEdit }) => {
  const currentYear = new Date().getFullYear();
  const yearData = data.filter(d => d.year === currentYear);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold">All Months - {currentYear}</h2>
        <p className="text-base md:text-lg opacity-90 mt-1">Complete year overview</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-sm md:text-base whitespace-nowrap">Month</th>
              <th className="px-3 py-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">Leads</th>
              <th className="px-3 py-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">Enrolled</th>
              <th className="px-3 py-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">Revenue</th>
              <th className="px-3 py-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">Students</th>
              <th className="px-3 py-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">Churn %</th>
              <th className="px-3 py-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">Student Val</th>
              <th className="px-3 py-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">Avg Ret.</th>
              <th className="px-3 py-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">LTV</th>
              <th className="px-3 py-3 text-center font-semibold text-sm md:text-base whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {yearData.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                  No data for {currentYear}
                </td>
              </tr>
            ) : (
              yearData.map((month) => {
                const totalRev = calculateTotalRevenue(month);
                const avgStudents = Math.round((month.studentsStart + month.studentsEnd) / 2);
                const churnRate = calculateChurn(month.studentsStart, month.studentsEnd, month.enrollments);
                const avgRet = calculateAverageMonthlyRetention(churnRate);
                const studentVal = calculateStudentValue(totalRev, avgStudents);
                const ltv = calculateLifetimeValue(avgRet, studentVal);
                return (
                  <tr key={month.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3 font-medium text-sm md:text-base whitespace-nowrap">{month.month}</td>
                    <td className="px-3 py-3 text-right text-sm md:text-base">{month.leads}</td>
                    <td className="px-3 py-3 text-right text-sm md:text-base">{month.enrollments}</td>
                    <td className="px-3 py-3 text-right font-semibold text-green-600 text-sm md:text-base whitespace-nowrap">${totalRev.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right text-sm md:text-base">{month.studentsEnd}</td>
                    <td className="px-3 py-3 text-right text-sm md:text-base">{churnRate.toFixed(1)}%</td>
                    <td className="px-3 py-3 text-right font-semibold text-blue-600 text-sm md:text-base whitespace-nowrap">${studentVal.toLocaleString()}</td>

                    <td className="px-3 py-3 text-right text-sm md:text-base">{avgRet.toFixed(1)}</td>
                    <td className="px-3 py-3 text-right font-semibold text-blue-600 text-sm md:text-base whitespace-nowrap">${ltv.toLocaleString()}</td>
                    <td className="px-3 py-3 text-center">
                      <button onClick={() => onEdit(month)} className="bg-blue-600 text-white px-2 md:px-3 py-1 rounded hover:bg-blue-700 text-xs md:text-sm whitespace-nowrap">Edit</button>
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
