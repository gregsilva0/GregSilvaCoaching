import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Goal } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function GoalsManagement() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    month: MONTHS[new Date().getMonth()],
    year: new Date().getFullYear(),
    target_leads: 0,
    target_enrollments: 0,
    target_revenue: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch goals', variant: 'destructive' });
    } else {
      setGoals(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const goalData = { ...formData, user_id: user.id };

    const { error } = editingId
      ? await supabase.from('goals').update(goalData).eq('id', editingId)
      : await supabase.from('goals').insert([goalData]);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Goal ${editingId ? 'updated' : 'created'} successfully` });
      fetchGoals();
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete goal', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Goal deleted' });
      fetchGoals();
    }
  };

  const startEdit = (goal: Goal) => {
    setEditingId(goal.id);
    setFormData({
      month: goal.month,
      year: goal.year,
      target_leads: goal.target_leads,
      target_enrollments: goal.target_enrollments,
      target_revenue: goal.target_revenue,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      month: MONTHS[new Date().getMonth()],
      year: new Date().getFullYear(),
      target_leads: 0,
      target_enrollments: 0,
      target_revenue: 0,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Goals Management</CardTitle>
          <CardDescription>Set monthly targets for leads, enrollments, and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Month</Label>
                  <Select value={formData.month} onValueChange={(v) => setFormData({ ...formData, month: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Year</Label>
                  <Input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} />
                </div>
                <div>
                  <Label>Target Leads</Label>
                  <Input type="number" value={formData.target_leads} onChange={(e) => setFormData({ ...formData, target_leads: parseInt(e.target.value) })} />
                </div>
                <div>
                  <Label>Target Enrollments</Label>
                  <Input type="number" value={formData.target_enrollments} onChange={(e) => setFormData({ ...formData, target_enrollments: parseInt(e.target.value) })} />
                </div>
                <div className="col-span-2">
                  <Label>Target Revenue ($)</Label>
                  <Input type="number" value={formData.target_revenue} onChange={(e) => setFormData({ ...formData, target_revenue: parseFloat(e.target.value) })} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit"><Save className="h-4 w-4 mr-2" />{editingId ? 'Update' : 'Save'}</Button>
                <Button type="button" variant="outline" onClick={resetForm}><X className="h-4 w-4 mr-2" />Cancel</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historical Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Enrollments</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {goals.map(goal => (
                <TableRow key={goal.id}>
                  <TableCell>{goal.month}</TableCell>
                  <TableCell>{goal.year}</TableCell>
                  <TableCell>{goal.target_leads}</TableCell>
                  <TableCell>{goal.target_enrollments}</TableCell>
                  <TableCell>${goal.target_revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(goal)}><Pencil className="h-3 w-3" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(goal.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
