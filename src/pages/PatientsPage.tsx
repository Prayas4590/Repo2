import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Search,
  Filter,
  Phone,
  MapPin,
  Calendar,
  Activity,
  AlertTriangle,
  Plus,
  ChevronRight,
  Heart
} from 'lucide-react';

import { useRole } from '@/contexts/RoleContext';
import HCPatientsSection from '@/components/healthcoordinatorcomponents/HCPatientsSection';

const PatientsPage = () => {
  const { currentRole } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const patients = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      phone: '+91 9876543210',
      address: 'Block A, House #123',
      condition: 'Hypertension',
      severity: 'medium',
      lastVisit: '2024-01-15',
      nextVisit: '2024-02-15',
      status: 'monitoring',
      vitals: {
        bp: '140/90 mmHg',
        pulse: '78 bpm',
        temperature: '98.6°F'
      },
      medications: ['Amlodipine 5mg', 'Metformin 500mg']
    },
    {
      id: 2,
      name: 'Priya Sharma',
      age: 32,
      gender: 'Female',
      phone: '+91 9876543211',
      address: 'Block B, House #456',
      condition: 'Fever, Headache',
      severity: 'low',
      lastVisit: '2024-01-14',
      nextVisit: '2024-01-21',
      status: 'recovering',
      vitals: {
        bp: '120/80 mmHg',
        pulse: '72 bpm',
        temperature: '99.2°F'
      },
      medications: ['Paracetamol 500mg', 'Rest & Fluids']
    },
    {
      id: 3,
      name: 'Amit Singh',
      age: 28,
      gender: 'Male',
      phone: '+91 9876543212',
      address: 'Block C, House #789',
      condition: 'Respiratory Issues',
      severity: 'high',
      lastVisit: '2024-01-16',
      nextVisit: '2024-01-18',
      status: 'critical',
      vitals: {
        bp: '130/85 mmHg',
        pulse: '88 bpm',
        temperature: '101.2°F'
      },
      medications: ['Bronchodilator', 'Antibiotics', 'Oxygen Support']
    },
    {
      id: 4,
      name: 'Sunita Devi',
      age: 55,
      gender: 'Female',
      phone: '+91 9876543213',
      address: 'Block A, House #234',
      condition: 'Diabetes Management',
      severity: 'medium',
      lastVisit: '2024-01-12',
      nextVisit: '2024-02-12',
      status: 'stable',
      vitals: {
        bp: '135/88 mmHg',
        pulse: '75 bpm',
        temperature: '98.4°F'
      },
      medications: ['Insulin', 'Metformin', 'Diet Control']
    },
    {
      id: 5,
      name: 'Ravi Gupta',
      age: 38,
      gender: 'Male',
      phone: '+91 9876543214',
      address: 'Block D, House #567',
      condition: 'Post-Surgery Recovery',
      severity: 'medium',
      lastVisit: '2024-01-13',
      nextVisit: '2024-01-20',
      status: 'recovering',
      vitals: {
        bp: '125/82 mmHg',
        pulse: '70 bpm',
        temperature: '98.8°F'
      },
      medications: ['Pain Relief', 'Antibiotics', 'Wound Care']
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Patients', count: patients.length },
    { id: 'critical', label: 'Critical', count: patients.filter(p => p.status === 'critical').length },
    { id: 'monitoring', label: 'Monitoring', count: patients.filter(p => p.status === 'monitoring').length },
    { id: 'recovering', label: 'Recovering', count: patients.filter(p => p.status === 'recovering').length }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-error text-error-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-error text-error-foreground';
      case 'monitoring': return 'bg-warning text-warning-foreground';
      case 'recovering': return 'bg-info text-white';
      case 'stable': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || patient.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  if (currentRole === 'coordinator') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-4">
          <h1 className="headline-medium text-text-primary mb-2">Patient Management</h1>
          <p className="body-medium text-text-secondary">Track and manage patient health records</p>
        </div>

        <HCPatientsSection />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="headline-medium text-text-primary mb-2">Patient Management</h1>
        <p className="body-medium text-text-secondary">
          Track and manage patient health records
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients..."
            className="pl-10 border-input"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterOptions.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className="whitespace-nowrap ripple"
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Patient Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="material-card text-center">
          <CardContent className="p-3">
            <div className="text-lg text-error mb-1">
              {patients.filter(p => p.status === 'critical').length}
            </div>
            <div className="body-small text-text-secondary">Critical</div>
          </CardContent>
        </Card>
        <Card className="material-card text-center">
          <CardContent className="p-3">
            <div className="text-lg text-warning mb-1">
              {patients.filter(p => p.status === 'monitoring').length}
            </div>
            <div className="body-small text-text-secondary">Monitoring</div>
          </CardContent>
        </Card>
        <Card className="material-card text-center">
          <CardContent className="p-3">
            <div className="text-lg text-info mb-1">
              {patients.filter(p => p.status === 'recovering').length}
            </div>
            <div className="body-small text-text-secondary">Recovering</div>
          </CardContent>
        </Card>
        <Card className="material-card text-center">
          <CardContent className="p-3">
            <div className="text-lg text-success mb-1">
              {patients.filter(p => p.status === 'stable').length}
            </div>
            <div className="body-small text-text-secondary">Stable</div>
          </CardContent>
        </Card>
      </div>

      {/* Patients List */}
      <div className="space-y-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="material-card hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(patient.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Patient Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="label-large text-text-primary">{patient.name}</h3>
                      <p className="body-small text-text-secondary">
                        {patient.age} years • {patient.gender}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Badge className={getSeverityColor(patient.severity)}>
                        {patient.severity}
                      </Badge>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="mb-3">
                    <p className="body-medium text-text-primary mb-1">{patient.condition}</p>
                    <div className="flex items-center gap-4 text-text-disabled">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="body-small">{patient.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span className="body-small">{patient.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vitals */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-2 bg-muted/30 rounded-lg">
                      <p className="body-small text-text-secondary">BP</p>
                      <p className="label-small text-text-primary">{patient.vitals.bp}</p>
                    </div>
                    <div className="text-center p-2 bg-muted/30 rounded-lg">
                      <p className="body-small text-text-secondary">Pulse</p>
                      <p className="label-small text-text-primary">{patient.vitals.pulse}</p>
                    </div>
                    <div className="text-center p-2 bg-muted/30 rounded-lg">
                      <p className="body-small text-text-secondary">Temp</p>
                      <p className="label-small text-text-primary">{patient.vitals.temperature}</p>
                    </div>
                  </div>

                  {/* Medications */}
                  <div className="mb-3">
                    <p className="body-small text-text-secondary mb-1">Current Medications:</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.medications.map((med, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {med}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Visit Information */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4 text-text-disabled">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="body-small">Last: {patient.lastVisit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="body-small">Next: {patient.nextVisit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Activity className="h-3 w-3 mr-1" />
                        Vitals
                      </Button>
                    </div>

                    <Button variant="ghost" size="sm" className="text-primary">
                      <span className="body-small mr-1">View Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredPatients.length === 0 && (
        <Card className="material-card text-center">
          <CardContent className="p-8">
            <Users className="h-12 w-12 text-text-disabled mx-auto mb-4" />
            <h3 className="title-medium text-text-primary mb-2">No patients found</h3>
            <p className="body-medium text-text-secondary">
              {searchQuery ? 'Try adjusting your search terms' : 'No patients match the selected filter'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* FAB for Add Patient */}
      <Button className="fab bg-doctor text-white hover:bg-doctor/90">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default PatientsPage;
