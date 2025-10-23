import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, CheckCircle2 } from 'lucide-react';

interface GoalProgressCardProps {
  title: string;
  current: number;
  target: number;
  format?: 'number' | 'currency';
}

export default function GoalProgressCard({ title, current, target, format = 'number' }: GoalProgressCardProps) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const isMetOrExceeded = current >= target && target > 0;
  const isExceeded = current > target && target > 0;

  const formatValue = (value: number) => {
    if (format === 'currency') {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  return (
    <Card className={isMetOrExceeded ? 'border-green-500 bg-green-50' : ''}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Target className="h-4 w-4" />
          {title}
          {isMetOrExceeded && <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current</span>
            <span className="font-bold">{formatValue(current)}</span>
          </div>
          <Progress value={percentage} className={isMetOrExceeded ? 'bg-green-200' : ''} />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Target</span>
            <span className="font-semibold">{formatValue(target)}</span>
          </div>
          {isExceeded && (
            <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
              <TrendingUp className="h-3 w-3" />
              {((current / target - 1) * 100).toFixed(0)}% over target!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
