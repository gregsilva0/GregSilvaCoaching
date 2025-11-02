import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download } from 'lucide-react';

interface SchoolSummary {
  id: string;
  school_name: string;
  email: string;
  months_tracked: number;
  total_leads: number;
  total_appointments: number;
  total_enrollments: number;
  total_revenue: number;
  last_entry_date: string;
}

export default function AdminDashboard() {
  const [schools, setSchools] = useState<SchoolSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchoolData();
  }, []);

  const fetchSchoolData = async () => {
    const { data, error } = await supabase
      .from('admin_school_summary')
      .select('*')
      .order('school_name');

    if (!error && data) {
      setSchools(data);
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    const headers = ['School Name', 'Email', 'Months Tracked', 'Total Leads', 'Appointments', 'Enrollments', 'Total Revenue', 'Last Entry'];
    const rows = schools.map(s => [
      s.school_name,
      s.email,
      s.months_tracked,
      s.total_leads,
      s.total_appointments,
      s.total_enrollments,
      `$${s.total_revenue.toFixed(2)}`,
      s.last_entry_date || 'N/A'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-schools-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totals = schools.reduce((acc, s) => ({
    leads: acc.leads + s.total_leads,
    appointments: acc.appointments + s.total_appointments,
    enrollments: acc.enrollments + s.total_enrollments,
    revenue: acc.revenue + s.total_revenue
  }), { leads: 0, appointments: 0, enrollments: 0, revenue: 0 });

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard - All Schools</h1>
        <Button onClick={exportToCSV}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle>Total Schools</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{schools.length}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Total Leads</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{totals.leads}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Total Enrollments</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{totals.enrollments}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">${totals.revenue.toLocaleString()}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>School Performance</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Months</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Enrollments</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Last Entry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.map(school => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.school_name}</TableCell>
                  <TableCell>{school.email}</TableCell>
                  <TableCell>{school.months_tracked}</TableCell>
                  <TableCell>{school.total_leads}</TableCell>
                  <TableCell>{school.total_enrollments}</TableCell>
                  <TableCell>${school.total_revenue.toLocaleString()}</TableCell>
                  <TableCell>{school.last_entry_date || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
