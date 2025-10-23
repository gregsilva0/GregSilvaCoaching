import { MonthlyData } from '../types';
import { calculateTotalRevenue, calculateChurn } from './calculations';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (data: MonthlyData[]) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('School Performance Report', 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
  
  // Summary Statistics
  const totalLeads = data.reduce((sum, d) => sum + d.leads, 0);
  const totalEnrollments = data.reduce((sum, d) => sum + d.enrollments, 0);
  const totalRevenue = data.reduce((sum, d) => sum + calculateTotalRevenue(d), 0);
  const avgChurn = data.reduce((sum, d) => sum + calculateChurn(d.studentsStart, d.studentsEnd, d.enrollments), 0) / data.length;
  
  doc.setFontSize(12);
  doc.text('Summary Statistics', 14, 38);
  doc.setFontSize(10);
  doc.text(`Total Leads: ${totalLeads}`, 14, 46);
  doc.text(`Total Enrollments: ${totalEnrollments}`, 14, 52);
  doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, 58);
  doc.text(`Average Churn Rate: ${avgChurn.toFixed(2)}%`, 14, 64);
  
  // Monthly Data Table
  const tableData = data.map(d => [
    `${d.month} ${d.year}`,
    d.leads,
    d.enrollments,
    `$${calculateTotalRevenue(d).toFixed(2)}`,
    `${calculateChurn(d.studentsStart, d.studentsEnd, d.enrollments).toFixed(2)}%`
  ]);
  
  autoTable(doc, {
    startY: 72,
    head: [['Month', 'Leads', 'Enrollments', 'Revenue', 'Churn']],
    body: tableData,
  });
  
  doc.save(`school-report-${new Date().toISOString().split('T')[0]}.pdf`);
};
