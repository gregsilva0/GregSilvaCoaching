import { MonthlyData } from '../types';
import { calculateMetric, calculateTotalRevenue, calculateChurn } from './calculations';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (data: MonthlyData[]) => {
  const headers = [
    'Month', 'Year', 'Leads', 'Appointments', 'Showed', 'Enrollments',
    'PIF', 'Down Payments', 'Event Revenue', 'Pro Shop Sales', 'MRR',
    'Students Start', 'Students End', 'Total Revenue', 'Churn Rate'
  ];

  const rows = data.map(d => {
    const totalRevenue = calculateTotalRevenue(d);
    const churnRate = calculateChurn(d.studentsStart, d.studentsEnd, d.enrollments);
    
    return [
      d.month, d.year, d.leads, d.appointments, d.showed, d.enrollments,
      d.pif, d.downPayments, d.eventRevenue, d.proShopSales, d.mrr,
      d.studentsStart, d.studentsEnd, totalRevenue.toFixed(2), churnRate.toFixed(2)
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `school-data-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
