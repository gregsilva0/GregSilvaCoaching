import React, { useState, useEffect } from 'react';
import { MonthlyData } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface DataEntryFormProps {
  onSubmit: (data: MonthlyData) => void;
  initialData?: MonthlyData;
}

const DataEntryForm: React.FC<DataEntryFormProps> = ({ onSubmit, initialData }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const [formData, setFormData] = useState<MonthlyData>({
    id: initialData?.id || uuidv4(),
    month: initialData?.month || currentMonth,
    year: initialData?.year || currentYear,
    leads: initialData?.leads || 0,
    appointments: initialData?.appointments || 0,
    showed: initialData?.showed || 0,
    enrollments: initialData?.enrollments || 0,
    pif: initialData?.pif || 0,
    downPayments: initialData?.downPayments || 0,
    eventRevenue: initialData?.eventRevenue || 0,
    proShopSales: initialData?.proShopSales || 0,
    mrr: initialData?.mrr || 0,
    studentsStart: initialData?.studentsStart || 0,
    studentsEnd: initialData?.studentsEnd || 0,
  });

  const totalRevenue = 
    parseFloat(String(formData.pif || 0)) +
    parseFloat(String(formData.downPayments || 0)) +
    parseFloat(String(formData.eventRevenue || 0)) +
    parseFloat(String(formData.proShopSales || 0)) +
    parseFloat(String(formData.mrr || 0));

  const studentValue = formData.studentsEnd > 0 
    ? totalRevenue / formData.studentsEnd 
    : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'month' || name === 'year') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      // Allow empty string, convert to number only if there's a value
      const numValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select all text on focus for easy replacement
    e.target.select();
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            onFocus={handleFocus}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-bold text-blue-600 mb-3 border-b-2 border-blue-200 pb-1">LEADS</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Leads</label>
          <input
            type="number"
            name="leads"
            value={formData.leads}
            onChange={handleChange}
            onFocus={handleFocus}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-bold text-blue-600 mb-3 border-b-2 border-blue-200 pb-1">APPOINTMENTS</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Appointments Made</label>
          <input
            type="number"
            name="appointments"
            value={formData.appointments}
            onChange={handleChange}
            onFocus={handleFocus}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-bold text-blue-600 mb-3 border-b-2 border-blue-200 pb-1">SHOWED</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Appointments Showed</label>
          <input
            type="number"
            name="showed"
            value={formData.showed}
            onChange={handleChange}
            onFocus={handleFocus}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-bold text-blue-600 mb-3 border-b-2 border-blue-200 pb-1">ENROLLED</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number Enrolled</label>
          <input
            type="number"
            name="enrollments"
            value={formData.enrollments}
            onChange={handleChange}
            onFocus={handleFocus}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-bold text-green-600 mb-3 border-b-2 border-green-200 pb-1">REVENUE</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PIF (Paid In Full)</label>
            <input
              type="number"
              name="pif"
              value={formData.pif}
              onChange={handleChange}
              onFocus={handleFocus}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Down Payments</label>
            <input
              type="number"
              name="downPayments"
              value={formData.downPayments}
              onChange={handleChange}
              onFocus={handleFocus}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Revenue</label>
            <input
              type="number"
              name="eventRevenue"
              value={formData.eventRevenue}
              onChange={handleChange}
              onFocus={handleFocus}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pro Shop Sales</label>
            <input
              type="number"
              name="proShopSales"
              value={formData.proShopSales}
              onChange={handleChange}
              onFocus={handleFocus}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Recurring Revenue (MRR)</label>
            <input
              type="number"
              name="mrr"
              value={formData.mrr}
              onChange={handleChange}
              onFocus={handleFocus}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-bold text-blue-600 mb-3 border-b-2 border-blue-200 pb-1">STUDENTS</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Active Students</label>
            <input
              type="number"
              name="studentsStart"
              value={formData.studentsStart}
              onChange={handleChange}
              onFocus={handleFocus}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ending Active Students</label>
            <input
              type="number"
              name="studentsEnd"
              value={formData.studentsEnd}
              onChange={handleChange}
              onFocus={handleFocus}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-gray-300 pb-1">CALCULATED METRICS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded border border-gray-200">
            <label className="block text-sm font-medium text-gray-600 mb-1">Total Revenue</label>
            <p className="text-2xl font-bold text-green-600">
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white p-3 rounded border border-gray-200">
            <label className="block text-sm font-medium text-gray-600 mb-1">Student Value</label>
            <p className="text-2xl font-bold text-blue-600">
              ${studentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
      >
        Save Month Data
      </button>
    </form>
  );
};

export default DataEntryForm;
