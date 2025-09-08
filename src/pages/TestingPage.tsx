import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TestTube, 
  Droplets, 
  Camera,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Plus
} from 'lucide-react';

const TestingPage = () => {
  const [testType, setTestType] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testHistory = [
    {
      id: 1,
      type: 'Water Quality Test',
      location: 'Block A - Well #1',
      result: 'Safe',
      date: '2024-01-15',
      time: '10:30 AM',
      testedBy: 'Sunita Devi',
      parameters: {
        pH: '7.2',
        chlorine: '0.8 mg/L',
        bacteria: 'Negative'
      }
    },
    {
      id: 2,
      type: 'Water Quality Test',
      location: 'Block B - Community Tank',
      result: 'Contaminated',
      date: '2024-01-15',
      time: '2:15 PM',
      testedBy: 'Sunita Devi',
      parameters: {
        pH: '8.5',
        chlorine: '0.2 mg/L',
        bacteria: 'Positive'
      }
    },
    {
      id: 3,
      type: 'Air Quality Check',
      location: 'Block C - School Area',
      result: 'Moderate',
      date: '2024-01-14',
      time: '9:00 AM',
      testedBy: 'Sunita Devi',
      parameters: {
        PM2_5: '45 μg/m³',
        PM10: '78 μg/m³',
        AQI: '112'
      }
    }
  ];

  const testTypes = [
    {
      id: 'water',
      name: 'Water Quality Test',
      icon: Droplets,
      color: 'bg-coordinator-light text-coordinator',
      parameters: ['pH Level', 'Chlorine Content', 'Bacterial Count', 'Turbidity']
    },
    {
      id: 'air',
      name: 'Air Quality Check',
      icon: TestTube,
      color: 'bg-warning/10 text-warning',
      parameters: ['PM2.5', 'PM10', 'AQI', 'CO2 Levels']
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testType || !location) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Test Started",
      description: "Test has been initiated and results will be available shortly.",
    });
    
    // Reset form
    setTestType('');
    setLocation('');
    setNotes('');
    setLoading(false);
  };

  const getResultColor = (result: string) => {
    switch (result.toLowerCase()) {
      case 'safe':
      case 'good': return 'bg-success text-success-foreground';
      case 'contaminated':
      case 'poor': return 'bg-error text-error-foreground';
      case 'moderate': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result.toLowerCase()) {
      case 'safe':
      case 'good': return CheckCircle;
      case 'contaminated':
      case 'poor': return AlertTriangle;
      case 'moderate': return AlertTriangle;
      default: return TestTube;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="headline-medium text-text-primary mb-2">Quality Testing</h1>
        <p className="body-medium text-text-secondary">
          Conduct water and air quality tests
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="material-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl text-success mb-1">
              {testHistory.filter(t => ['safe', 'good'].includes(t.result.toLowerCase())).length}
            </div>
            <div className="body-small text-text-secondary">Safe</div>
          </CardContent>
        </Card>
        <Card className="material-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl text-warning mb-1">
              {testHistory.filter(t => t.result.toLowerCase() === 'moderate').length}
            </div>
            <div className="body-small text-text-secondary">Moderate</div>
          </CardContent>
        </Card>
        <Card className="material-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl text-error mb-1">
              {testHistory.filter(t => ['contaminated', 'poor'].includes(t.result.toLowerCase())).length}
            </div>
            <div className="body-small text-text-secondary">Unsafe</div>
          </CardContent>
        </Card>
      </div>

      {/* Test Type Selection */}
      <div className="space-y-4">
        <h2 className="title-medium text-text-primary">Select Test Type</h2>
        <div className="grid gap-3">
          {testTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Button
                key={type.id}
                variant={testType === type.id ? "default" : "outline"}
                className="h-auto p-4 justify-start gap-4 ripple"
                onClick={() => setTestType(type.id)}
              >
                <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="label-large">{type.name}</div>
                  <div className="body-small text-text-secondary">
                    Parameters: {type.parameters.slice(0, 2).join(', ')}...
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Test Form */}
      {testType && (
        <Card className="material-card">
          <CardHeader className="pb-3">
            <CardTitle className="title-medium flex items-center gap-2">
              <TestTube className="h-5 w-5 text-asha" />
              Start Test - {testTypes.find(t => t.id === testType)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="label-medium text-text-primary">Test Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Block A - Well #1"
                  className="border-input"
                  required
                />
              </div>

              {/* GPS Location */}
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <MapPin className="h-5 w-5 text-text-secondary" />
                <div className="flex-1">
                  <p className="label-medium text-text-primary">GPS Coordinates</p>
                  <p className="body-small text-text-secondary">28.7041° N, 77.1025° E</p>
                </div>
                <Button type="button" variant="outline" size="sm">
                  Update
                </Button>
              </div>

              {/* Test Parameters */}
              <div className="space-y-3">
                <Label className="label-medium text-text-primary">Test Parameters</Label>
                <div className="grid grid-cols-2 gap-3">
                  {testTypes.find(t => t.id === testType)?.parameters.map((param, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="body-small text-text-secondary">{param}</Label>
                      <Input
                        placeholder="Enter value"
                        className="border-input"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label className="label-medium text-text-primary">Photos</Label>
                <Button type="button" variant="outline" className="w-full h-16 border-dashed ripple">
                  <Camera className="h-6 w-6 mr-2 text-text-secondary" />
                  <span className="text-text-secondary">Take Photos of Test Site</span>
                </Button>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="label-medium text-text-primary">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any observations or special conditions..."
                  className="min-h-[80px] border-input"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full material-button bg-asha text-white hover:bg-asha/90 ripple"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing Test...
                  </div>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Start Test
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Test History */}
      <Card className="material-card">
        <CardHeader className="pb-3">
          <CardTitle className="title-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-asha" />
              Recent Tests
            </span>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {testHistory.map((test) => {
            const ResultIcon = getResultIcon(test.result);
            
            return (
              <div key={test.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <ResultIcon className={`h-6 w-6 ${
                      test.result.toLowerCase() === 'safe' || test.result.toLowerCase() === 'good' ? 'text-success' :
                      test.result.toLowerCase() === 'contaminated' || test.result.toLowerCase() === 'poor' ? 'text-error' :
                      'text-warning'
                    }`} />
                    <div>
                      <h3 className="label-large text-text-primary">{test.type}</h3>
                      <p className="body-small text-text-secondary">{test.location}</p>
                    </div>
                  </div>
                  <Badge className={getResultColor(test.result)}>
                    {test.result}
                  </Badge>
                </div>

                {/* Test Parameters */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {Object.entries(test.parameters).map(([key, value]) => (
                    <div key={key} className="text-center p-2 bg-muted/30 rounded-lg">
                      <p className="body-small text-text-secondary capitalize">{key.replace('_', '.')}</p>
                      <p className="label-medium text-text-primary">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Test Info */}
                <div className="flex items-center justify-between text-text-disabled">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="body-small">{test.date} at {test.time}</span>
                  </div>
                  <span className="body-small">by {test.testedBy}</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* FAB for Quick Test */}
      <Button className="fab bg-asha text-white hover:bg-asha/90">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default TestingPage;