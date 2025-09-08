import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  MoreVertical,
  Users,
  Search,
  Plus
} from 'lucide-react';
import { ChatSection } from '@/components/CitizenComponent';

const CommunicationPage = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [messageInput, setMessageInput] = useState('');
  const { user } = useAuth();

  const chats = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      role: 'Doctor',
      lastMessage: 'Please continue the prescribed medication',
      time: '2 min ago',
      unread: 2,
      online: true,
      type: 'individual'
    },
    {
      id: 2,
      name: 'ASHA - Sunita Devi',
      role: 'ASHA Worker',
      lastMessage: 'Water test results are ready',
      time: '15 min ago',
      unread: 0,
      online: true,
      type: 'individual'
    },
    {
      id: 3,
      name: 'Health Team - Block A',
      role: 'Group Chat',
      lastMessage: 'Meeting scheduled for tomorrow',
      time: '1 hour ago',
      unread: 5,
      online: false,
      type: 'group'
    },
    {
      id: 4,
      name: 'Coordinator - Rajesh',
      role: 'Health Coordinator',
      lastMessage: 'Report has been received',
      time: '3 hours ago',
      unread: 0,
      online: false,
      type: 'individual'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Dr. Priya Sharma',
      message: 'Hello! I reviewed your symptoms report. How are you feeling today?',
      time: '10:30 AM',
      isOwn: false
    },
    {
      id: 2,
      sender: user?.name || 'You',
      message: 'Good morning Doctor. I\'m feeling much better after taking the medicine.',
      time: '10:32 AM',
      isOwn: true
    },
    {
      id: 3,
      sender: 'Dr. Priya Sharma',
      message: 'That\'s great to hear! Please continue the medication for 2 more days.',
      time: '10:35 AM',
      isOwn: false
    },
    {
      id: 4,
      sender: 'Dr. Priya Sharma',
      message: 'Also, make sure to drink plenty of fluids and get adequate rest.',
      time: '10:35 AM',
      isOwn: false
    },
    {
      id: 5,
      sender: user?.name || 'You',
      message: 'Thank you Doctor. Should I schedule a follow-up visit?',
      time: '10:40 AM',
      isOwn: true
    }
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Add message logic here
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Doctor': return 'bg-doctor-light text-doctor';
      case 'ASHA Worker': return 'bg-asha-light text-asha';
      case 'Health Coordinator': return 'bg-coordinator-light text-coordinator';
      case 'Group Chat': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="headline-medium text-text-primary mb-2">Communication</h1>
        <p className="body-medium text-text-secondary">
          Connect with health workers and doctors
        </p>
      </div>

      {/* Communication features */}
      <ChatSection />
    </div>
  );
};

export default CommunicationPage;
