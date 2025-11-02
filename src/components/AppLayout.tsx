import React, { useState, useEffect } from 'react';
import { MonthlyData } from '../types';
import Dashboard from './Dashboard';
import DataEntryForm from './DataEntryForm';
import ComparisonChart from './ComparisonChart';
import MonthSelector from './MonthSelector';
import AllMonthsView from './AllMonthsView';
import ExportModal from './ExportModal';
import GoalsManagement from './GoalsManagement';
import AdminDashboard from './AdminDashboard';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Auth } from './Auth';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { FileDown } from 'lucide-react';

const AppLayout: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [selectedMonthId, setSelectedMonthId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMonth, setEditingMonth] = useState<MonthlyData | undefined>(undefined);
  const [view, setView] = useState<'dashboard' | 'allMonths' | 'goals' | 'admin'>('dashboard');

  const [loading, setLoading] = useState(true);
  const [schoolName, setSchoolName] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  // Load school profile
  useEffect(() => {
    if (user) {
      loadSchoolProfile();
    }
  }, [user]);

  const loadSchoolProfile = async () => {
    try {
      console.log('=== LOADING PROFILE ===');
      console.log('User ID:', user?.id);
      console.log('User Email:', user?.email);
      
      const { data, error } = await supabase
        .from('school_profiles')
        .select('school_name, is_admin')
        .eq('id', user?.id)
        .single();
      
      console.log('Query completed');
      console.log('Data received:', JSON.stringify(data, null, 2));
      console.log('Error received:', JSON.stringify(error, null, 2));
      
      if (error) {
        console.error('ERROR DETAILS:', error);
        toast({
          title: 'Profile Load Error',
          description: `${error.message} - Code: ${error.code}`,
          variant: 'destructive',
          duration: 5000
        });
      }
      
      if (data) {
        setSchoolName(data.school_name);
        setIsAdmin(data.is_admin || false);
        console.log('✓ School name set to:', data.school_name);
        console.log('✓ Admin status set to:', data.is_admin || false);
        toast({
          title: 'Profile Loaded',
          description: `Admin: ${data.is_admin ? 'YES' : 'NO'}`,
          duration: 3000
        });
      } else {
        console.warn('⚠ No profile data returned');
        toast({
          title: 'No Profile Found',
          description: 'Click "Fix Admin Access" to create your profile',
          variant: 'destructive',
          duration: 5000
        });
      }
    } catch (e: any) {
      console.error('EXCEPTION in loadSchoolProfile:', e);
      toast({
        title: 'Exception',
        description: e.message,
        variant: 'destructive'
      });
    }
  };

  const fixAdminAccess = async () => {
    try {
      console.log('=== FIX ADMIN ACCESS ===');
      
      // Simply UPDATE the existing record
      const { data, error } = await supabase
        .from('school_profiles')
        .update({ is_admin: true })
        .eq('id', user?.id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Update error:', JSON.stringify(error));
        toast({
          title: 'Update Failed',
          description: `${error.code}: ${error.message}`,
          variant: 'destructive',
          duration: 8000
        });
        return;
      }
      
      console.log('✅ Updated successfully:', data);
      toast({
        title: 'Success!',
        description: 'Admin access granted. Refreshing...',
      });
      
      // Reload profile
      await loadSchoolProfile();
      
    } catch (e: any) {
      console.error('❌ Exception:', e);
      toast({
        title: 'Error',
        description: e.message,
        variant: 'destructive'
      });
    }
  };






  // Load data from Supabase
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('monthly_data')
        .select('*')
        .eq('user_id', user?.id)
        .order('year', { ascending: true })
        .order('month', { ascending: true });

      if (error) throw error;

      const formatted: MonthlyData[] = (data || []).map(d => ({
        id: d.id,
        month: d.month,
        year: d.year,
        leads: d.leads,
        appointments: d.appointments,
        showed: d.showed,
        enrollments: d.enrollments,
        pif: d.pif,
        downPayments: d.down_payments,
        eventRevenue: d.event_revenue,
        proShopSales: d.pro_shop_sales,
        mrr: d.mrr,
        studentsStart: d.students_start,
        studentsEnd: d.students_end
      }));

      setMonthlyData(formatted);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddData = async (data: MonthlyData) => {
    try {
      const payload = {
        id: data.id,
        user_id: user?.id,
        month: data.month,
        year: data.year,
        leads: data.leads,
        appointments: data.appointments,
        showed: data.showed,
        enrollments: data.enrollments,
        pif: data.pif,
        down_payments: data.downPayments,
        event_revenue: data.eventRevenue,
        pro_shop_sales: data.proShopSales,
        mrr: data.mrr,
        students_start: data.studentsStart,
        students_end: data.studentsEnd
      };

      const { error } = await supabase
        .from('monthly_data')
        .upsert(payload);

      if (error) throw error;

      await loadData();
      setShowForm(false);
      setEditingMonth(undefined);
      setSelectedMonthId(data.id);
      setView('dashboard');
      toast({ title: 'Success', description: 'Data saved successfully' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleEditMonth = (month: MonthlyData) => {
    setEditingMonth(month);
    setShowForm(true);
    setView('dashboard');
  };

  const handleNewMonth = () => {
    setEditingMonth(undefined);
    setShowForm(true);
    setView('dashboard');
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  if (!user) {
    return <Auth />;
  }

  const selectedMonth = monthlyData.find(d => d.id === selectedMonthId) || monthlyData[monthlyData.length - 1];

  return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="h-64 bg-cover bg-center relative" style={{
      backgroundImage: 'url(https://d64gsuwffb70l.cloudfront.net/68f273424319527def687982_1760719824741_35d56cc8.webp)'
    }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{schoolName || 'Greg Silva Coaching'}</h1>
            <p className="text-base md:text-xl">Track Performance & Growth</p>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <Button onClick={signOut} variant="outline" className="bg-white text-sm md:text-base">
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Debug Info - Remove after fixing */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
          <p className="font-semibold text-yellow-800 mb-2">Debug Info (Check Browser Console for more details):</p>
          <p className="text-yellow-700">User ID: {user?.id}</p>
          <p className="text-yellow-700">User Email: {user?.email}</p>
          <p className="text-yellow-700">Admin Status: {isAdmin ? 'TRUE ✓' : 'FALSE ✗'}</p>
          <div className="flex gap-2 mt-2">
            <Button 
              onClick={loadSchoolProfile} 
              variant="outline" 
              size="sm"
              className="bg-yellow-100 hover:bg-yellow-200 border-yellow-300"
            >
              Refresh Profile
            </Button>
            <Button 
              onClick={fixAdminAccess} 
              variant="default" 
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Fix Admin Access
            </Button>
          </div>
        </div>


        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">Performance Tracker</h2>
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
            <button onClick={() => setView('dashboard')} className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base ${view === 'dashboard' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              Dashboard
            </button>
            <button onClick={() => setView('allMonths')} className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base ${view === 'allMonths' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              All Months
            </button>
            <button onClick={() => setView('goals')} className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base ${view === 'goals' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              Goals
            </button>
            
            {isAdmin && (
              <button onClick={() => setView('admin')} className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base ${view === 'admin' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                Admin
              </button>
            )}


            {monthlyData.length > 0 && (
              <Button onClick={() => setShowExportModal(true)} className="bg-blue-600 hover:bg-blue-700 text-sm md:text-base px-3 md:px-4 py-2 md:py-3">
                <FileDown className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                Export
              </Button>
            )}
            <button onClick={handleNewMonth} className="bg-green-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-green-700 transition text-sm md:text-base">
              {showForm ? 'Close' : 'Add Month'}
            </button>
          </div>
        </div>


        {showForm && <DataEntryForm onSubmit={handleAddData} initialData={editingMonth} />}

        {view === 'allMonths' && <AllMonthsView data={monthlyData} onEdit={handleEditMonth} />}



        {view === 'admin' && isAdmin && <AdminDashboard />}

        {view === 'goals' && <GoalsManagement />}



        {view === 'dashboard' && monthlyData.length > 0 && <>
            <div className="flex justify-between items-center">
              <MonthSelector months={monthlyData} selectedMonth={selectedMonthId} onSelect={setSelectedMonthId} />
              {selectedMonth && (
                <button
                  onClick={() => handleEditMonth(selectedMonth)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit This Month
                </button>
              )}
            </div>

            {selectedMonth && <Dashboard data={selectedMonth} previousData={monthlyData[monthlyData.length - 2]} />}

            <ComparisonChart data={monthlyData} />
          </>}


        {monthlyData.length === 0 && !showForm && <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">No data yet</h3>
            <p className="text-gray-500 mb-6">Start tracking your school's performance by adding your first month of data</p>
            <button onClick={handleNewMonth} className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition text-lg">
              Get Started
            </button>
          </div>}
      </div>

      <ExportModal 
        open={showExportModal} 
        onClose={() => setShowExportModal(false)} 
        allData={monthlyData} 
      />

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">Martial Arts School Analytics</p>
          <p className="text-gray-400">Track leads, revenue, and student growth</p>
        </div>
      </footer>
    </div>;
};
export default AppLayout;