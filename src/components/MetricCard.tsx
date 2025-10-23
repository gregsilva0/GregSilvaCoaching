import React from 'react';

interface MetricCardProps {
  label: string;
  value: number;
  percentage?: number;
  target?: number;
  status?: 'success' | 'warning' | 'danger';
  prefix?: string;
  suffix?: string;
}


const MetricCard: React.FC<MetricCardProps> = ({ label, value, percentage, target, status, prefix = '', suffix = '' }) => {
  const getStatusColor = () => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-500';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-500';
      case 'danger': return 'bg-red-100 text-red-800 border-red-500';
    }
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${getStatusColor()} transition-all hover:shadow-lg`}>
      <h3 className="text-sm font-medium opacity-80 mb-2">{label}</h3>
      <p className="text-3xl font-bold mb-1">{prefix}{value.toLocaleString()}{suffix}</p>

      {percentage !== undefined && target !== undefined && (
        <p className="text-sm font-semibold">
          {percentage}% <span className="opacity-70">(Target: {target}%)</span>
        </p>
      )}
    </div>
  );
};

export default MetricCard;
