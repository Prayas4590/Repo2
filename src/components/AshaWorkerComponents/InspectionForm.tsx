import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import MdIcon from '@/components/ui/md3-icon';

export default function InspectionForm({ initial, onSubmit, onCancel }: any){
  const [patientName, setPatientName] = useState(initial?.name || '');
  const [userId, setUserId] = useState(initial?.userId || '');
  const [age, setAge] = useState(initial?.age || '');
  const [gender, setGender] = useState(initial?.gender || '');
  const [location, setLocation] = useState(initial?.location || '');
  const [condition, setCondition] = useState(initial?.details || '');
  const [status, setStatus] = useState<'stable'|'urgent'>('stable');
  const [resources, setResources] = useState('');

  const submit = ()=>{
    const data = { originalId: initial.id, patientName, userId, age, gender, location, condition, status, resources };
    onSubmit(data);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2">
        <Label className="text-sm">Patient name</Label>
        <Input value={patientName} onChange={(e:any)=>setPatientName(e.target.value)} className="h-11" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-sm">Age</Label>
          <Input value={age} onChange={(e:any)=>setAge(e.target.value)} className="h-11" />
        </div>
        <div>
          <Label className="text-sm">Gender</Label>
          <Input value={gender} onChange={(e:any)=>setGender(e.target.value)} className="h-11" />
        </div>
      </div>
      <div>
        <Label className="text-sm">Location</Label>
        <Input value={location} onChange={(e:any)=>setLocation(e.target.value)} className="h-11" />
      </div>
      <div>
        <Label className="text-sm">Condition / Notes</Label>
        <Textarea value={condition} onChange={(e:any)=>setCondition(e.target.value)} className="min-h-[96px]" />
      </div>
      <div>
        <Label className="text-sm">Resources provided (e.g., ORS, Paracetamol)</Label>
        <Input value={resources} onChange={(e:any)=>setResources(e.target.value)} placeholder="List resources given" className="h-11" />
      </div>
      <div className="space-y-2">
        <Button onClick={submit} className="w-full" variant="secondary"><MdIcon name="check_circle" size={16} className="mr-2" />Submit</Button>
        <Button onClick={onCancel} className="w-full" variant="ghost">Cancel</Button>
      </div>
    </div>
  );
}
