"use client";

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type TicketAssignmentProps = {
  ticketId: number;
  currentAssignee?: User;
  onAssignmentChange?: () => void;
};

export default function TicketAssignment({ 
  ticketId, 
  currentAssignee, 
  onAssignmentChange 
}: TicketAssignmentProps) {
  const { token } = useAuth();
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdmins(data.filter((user: User) => user.role === 'admin'));
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const assignTicket = async (adminId: string) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/api/tickets/${ticketId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assigned_to: adminId }),
      });

      if (response.ok) {
        toast.success('Ticket assigned successfully');
        onAssignmentChange?.();
      } else {
        toast.error('Failed to assign ticket');
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
      toast.error('Failed to assign ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">Assign to:</span>
      <Select 
        onValueChange={assignTicket}
        disabled={loading}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder={currentAssignee?.name || "Select admin"} />
        </SelectTrigger>
        <SelectContent>
          {admins.map((admin) => (
            <SelectItem key={admin.id} value={admin.id.toString()}>
              {admin.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}