import { MonthlyData, PerformanceMetric } from '../types';

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const getStatus = (actual: number, target: number): 'success' | 'warning' | 'danger' => {
  if (actual >= target) return 'success';
  if (actual >= target * 0.9) return 'warning';
  return 'danger';
};

export const calculateMetric = (value: number, total: number, target: number): PerformanceMetric => {
  const percentage = calculatePercentage(value, total);
  return {
    value: percentage,
    target,
    status: getStatus(percentage, target)
  };
};

export const calculateTotalRevenue = (data: MonthlyData): number => {
  return data.pif + data.downPayments + data.eventRevenue + data.proShopSales + data.mrr;
};

export const calculateChurn = (start: number, end: number, newEnrollments: number): number => {
  const totalStarting = start + newEnrollments;
  if (totalStarting === 0) return 0;
  const lost = totalStarting - end;
  return Math.round((lost / totalStarting) * 100);
};

export const calculateAverageMonthlyRetention = (churnRate: number): number => {
  if (churnRate === 0) return 0;
  // Formula: 1 divided by churn percentage, times 100
  // Example: 2% churn -> (1 / 2) * 100 = 50 months
  return Math.round((1 / churnRate) * 100);
};



export const calculateStudentValue = (totalRevenue: number, studentCount: number): number => {
  if (studentCount === 0) return 0;
  return Math.round(totalRevenue / studentCount);
};

export const calculateLifetimeValue = (avgMonthlyRetention: number, studentValue: number): number => {
  return Math.round(avgMonthlyRetention * studentValue);
};
