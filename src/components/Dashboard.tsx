import React, { useState, useEffect } from 'react';
import { MonthlyData, Goal } from '../types';
import MetricCard from './MetricCard';
import GoalProgressCard from './GoalProgressCard';
import { calculateMetric, calculateTotalRevenue, calculateChurn } from '../utils/calculations';
import { supabase } from '@/lib/supabase';

interface DashboardProps {
  data: MonthlyData;
  previousData?: MonthlyData;
}


const Dashboard: React.FC<DashboardProps> = ({ data, previousData }) => {
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);

  const appointmentsMetric = calculateMetric(data.appointments, data.leads, 50);
  const showedMetric = calculateMetric(data.showed, data.appointments, 80);
  const enrollmentsMetric = calculateMetric(data.enrollments, data.showed, 80);
  const totalRevenue = calculateTotalRevenue(data);
  const churnRate = calculateChurn(data.studentsStart, data.studentsEnd, data.enrollments);

  useEffect(() => {
    fetchCurrentGoal();
  }, [data.month, data.year]);

  const fetchCurrentGoal = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: goalData } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', data.month)
      .eq('year', data.year)
      .single();

    setCurrentGoal(goalData);
  };


  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-2">School Performance Dashboard</h1>
        <p className="text-xl opacity-90">{data.month} {data.year}</p>
      </div>

      {currentGoal && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Goal Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GoalProgressCard
              title="Leads Goal"
              current={data.leads}
              target={currentGoal.target_leads}
            />
            <GoalProgressCard
              title="Enrollments Goal"
              current={data.enrollments}
              target={currentGoal.target_enrollments}
            />
            <GoalProgressCard
              title="Revenue Goal"
              current={totalRevenue}
              target={currentGoal.target_revenue}
              format="currency"
            />
          </div>
        </div>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Leads" value={data.leads} />
        <MetricCard 
          label="Appointments Made" 
          value={data.appointments} 
          percentage={appointmentsMetric.value}
          target={appointmentsMetric.target}
          status={appointmentsMetric.status}
        />
        <MetricCard 
          label="Appointments Showed" 
          value={data.showed} 
          percentage={showedMetric.value}
          target={showedMetric.target}
          status={showedMetric.status}
        />
        <MetricCard 
          label="Enrollments" 
          value={data.enrollments} 
          percentage={enrollmentsMetric.value}
          target={enrollmentsMetric.target}
          status={enrollmentsMetric.status}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard label="PIF" value={data.pif} prefix="$" />
        <MetricCard label="Down Payments" value={data.downPayments} prefix="$" />
        <MetricCard label="Event Revenue" value={data.eventRevenue} prefix="$" />
        <MetricCard label="Pro Shop Sales" value={data.proShopSales} prefix="$" />
        <MetricCard label="Monthly Recurring Revenue" value={data.mrr} prefix="$" />
        <MetricCard label="Total Revenue" value={totalRevenue} prefix="$" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Students (Start)" value={data.studentsStart} />
        <MetricCard label="Students (End)" value={data.studentsEnd} />
        <MetricCard 
          label="Churn Rate" 
          value={churnRate} 
          status={churnRate < 5 ? 'success' : churnRate < 10 ? 'warning' : 'danger'}
          prefix=""
          suffix="%"
        />

      </div>
    </div>
  );
};

export default Dashboard;
