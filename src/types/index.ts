export interface MonthlyData {
  id: string;
  month: string;
  year: number;
  leads: number;
  appointments: number;
  showed: number;
  enrollments: number;
  pif: number;
  downPayments: number;
  eventRevenue: number;
  proShopSales: number;
  mrr: number;
  studentsStart: number;
  studentsEnd: number;
}

export interface PerformanceMetric {
  value: number;
  target: number;
  status: 'success' | 'warning' | 'danger';
}

export interface Goal {
  id: string;
  user_id: string;
  month: string;
  year: number;
  target_leads: number;
  target_enrollments: number;
  target_revenue: number;
  created_at?: string;
  updated_at?: string;
}
