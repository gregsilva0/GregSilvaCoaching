import React, { useState } from 'react';
import { MonthlyData } from '../types';
import { exportToCSV } from '../utils/exportUtils';
import { exportToPDF } from '../utils/pdfExport';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileDown, FileSpreadsheet, FileText } from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  allData: MonthlyData[];
}

const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, allData }) => {
  const [startMonth, setStartMonth] = useState<string>('');
  const [endMonth, setEndMonth] = useState<string>('');

  const sortedData = [...allData].sort((a, b) => {
    const dateA = new Date(a.year, getMonthIndex(a.month));
    const dateB = new Date(b.year, getMonthIndex(b.month));
    return dateA.getTime() - dateB.getTime();
  });

  const monthOptions = sortedData.map(d => ({
    value: `${d.month}-${d.year}`,
    label: `${d.month} ${d.year}`
  }));

  const getFilteredData = () => {
    if (!startMonth && !endMonth) return sortedData;
    
    return sortedData.filter(d => {
      const key = `${d.month}-${d.year}`;
      const start = startMonth || monthOptions[0].value;
      const end = endMonth || monthOptions[monthOptions.length - 1].value;
      return key >= start && key <= end;
    });
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const data = getFilteredData();
    if (format === 'csv') {
      exportToCSV(data);
    } else {
      exportToPDF(data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Start Month</Label>
            <Select value={startMonth} onValueChange={setStartMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select start month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>End Month</Label>
            <Select value={endMonth} onValueChange={setEndMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select end month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={() => handleExport('csv')} className="flex-1">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={() => handleExport('pdf')} className="flex-1">
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function getMonthIndex(month: string): number {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return months.indexOf(month);
}

export default ExportModal;
