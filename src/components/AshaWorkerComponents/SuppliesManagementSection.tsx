import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MdIcon from '@/components/ui/md3-icon';
import { toast } from '@/components/ui/sonner';

// Domain types
export type SupplyCategory =
  | 'Water Testing Supplies'
  | 'Medical & Emergency Supplies'
  | 'Personal Protective Equipment (PPE)'
  | 'Water Safety Supplies'
  | 'Community Outreach Materials';

type SupplyItem = {
  id: string;
  name: string;
  unit: string;
};

type CartItem = {
  id: string;
  name: string;
  unit: string;
  qty: number;
  category: SupplyCategory;
};

const SUPPLIES: Record<SupplyCategory, SupplyItem[]> = {
  'Water Testing Supplies': [
    { id: 'rapid_test_kits', name: 'Rapid test kits (turbidity, pH, bacteria)', unit: 'kit' },
    { id: 'sample_containers', name: 'Sample containers, strips, reagents', unit: 'pack' },
    { id: 'collection_tools', name: 'Water collection tools (bottles, scoops)', unit: 'set' },
  ],
  'Medical & Emergency Supplies': [
    { id: 'ors', name: 'Oral rehydration salts (ORS)', unit: 'sachet' },
    { id: 'basic_medicines', name: 'Basic medicines (paracetamol, antibiotics)', unit: 'strip' },
    { id: 'iv_fluids', name: 'IV fluids for emergency treatment', unit: 'bag' },
    { id: 'first_aid', name: 'First-aid kits', unit: 'kit' },
  ],
  'Personal Protective Equipment (PPE)': [
    { id: 'ppe_gloves_masks_gowns', name: 'Gloves, masks, gowns', unit: 'pack' },
    { id: 'sanitizers', name: 'Sanitizers and disinfectants', unit: 'bottle' },
    { id: 'goggles_shields', name: 'Safety goggles and face shields', unit: 'piece' },
  ],
  'Water Safety Supplies': [
    { id: 'purification', name: 'Water purification tablets or filters', unit: 'pack' },
    { id: 'storage_containers', name: 'Storage containers with lids', unit: 'piece' },
    { id: 'chlorination', name: 'Chlorination materials', unit: 'kg' },
  ],
  'Community Outreach Materials': [
    { id: 'hygiene_posters', name: 'Hygiene posters, pamphlets', unit: 'set' },
    { id: 'education_kits', name: 'Educational kits for awareness sessions', unit: 'kit' },
    { id: 'portable_speakers', name: 'Portable speakers or devices for announcements', unit: 'piece' },
  ],
};

const categoryIcons: Record<SupplyCategory, string> = {
  'Water Testing Supplies': 'science',
  'Medical & Emergency Supplies': 'medical_services',
  'Personal Protective Equipment (PPE)': 'health_and_safety',
  'Water Safety Supplies': 'water_drop',
  'Community Outreach Materials': 'campaign',
};

function QtyStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="outline" onClick={() => onChange(Math.max(0, value - 1))} aria-label="Decrease">
        <MdIcon name="remove" size={18} />
      </Button>
      <div className="w-10 text-center label-medium" aria-live="polite">{value}</div>
      <Button size="icon" variant="outline" onClick={() => onChange(value + 1)} aria-label="Increase">
        <MdIcon name="add" size={18} />
      </Button>
    </div>
  );
}

export default function SuppliesManagementSection() {
  const categories = Object.keys(SUPPLIES) as SupplyCategory[];
  const [activeTab, setActiveTab] = useState<SupplyCategory>('Water Testing Supplies');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | ''>('');
  const [neededBy, setNeededBy] = useState('');
  const [destination, setDestination] = useState('PHC');
  const [notes, setNotes] = useState('');

  const addToCart = (category: SupplyCategory, item: SupplyItem) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.id === item.id);
      if (existing) {
        return prev.map(ci => (ci.id === item.id ? { ...ci, qty: ci.qty + 1 } : ci));
      }
      return [{ id: item.id, name: item.name, unit: item.unit, qty: 1, category }, ...prev];
    });
  };

  const updateQty = (id: string, qty: number) => {
    setCart(prev => prev
      .map(ci => (ci.id === id ? { ...ci, qty } : ci))
      .filter(ci => ci.qty > 0));
  };

  const clearCart = () => setCart([]);

  const filteredItems = useMemo(() => {
    const items = SUPPLIES[activeTab];
    if (!search.trim()) return items;
    const s = search.toLowerCase();
    return items.filter(i => i.name.toLowerCase().includes(s));
  }, [activeTab, search]);

  const submit = () => {
    if (cart.length === 0) {
      toast('Add at least one item');
      return;
    }
    if (!priority) {
      toast('Select priority');
      return;
    }
    const payload = {
      requestedAt: new Date().toISOString(),
      priority,
      neededBy: neededBy || null,
      destination,
      notes: notes || null,
      items: cart,
    };
    try {
      // Here we would POST to backend; for now copy to clipboard as confirmation
      navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
      toast('Request submitted');
      clearCart();
      setPriority('');
      setNeededBy('');
      setNotes('');
    } catch (e) {
      toast('Failed to submit');
    }
  };

  return (
    <Card className="material-card">
      <CardHeader className="pb-3">
        <CardTitle className="title-medium flex items-center gap-2">
          <MdIcon name="inventory_2" size={20} className="text-asha" />
          Supply Management & Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search items"
              aria-label="Search supplies"
            />
          </div>
          <Badge variant="outline" className="shrink-0">{cart.length} selected</Badge>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SupplyCategory)} className="w-full">
          <TabsList className="grid grid-cols-2 gap-2 w-full">
            {categories.map(c => (
              <TabsTrigger key={c} value={c} className="truncate">
                <div className="flex items-center gap-1">
                  <MdIcon name={categoryIcons[c]} size={16} />
                  <span className="truncate">{c.replace(' (PPE)', '')}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(c => (
            <TabsContent key={c} value={c} className="space-y-2">
              {filteredItems.length === 0 && activeTab === c && (
                <p className="body-small text-text-secondary px-1">No items match your search</p>
              )}
              {activeTab === c && filteredItems.map(item => {
                const selected = cart.find(ci => ci.id === item.id)?.qty || 0;
                return (
                  <div key={item.id} className="p-3 rounded-xl bg-surface-variant/30 border border-divider flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="label-medium text-text-primary truncate">{item.name}</p>
                      <p className="body-small text-text-secondary">Unit: {item.unit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selected === 0 ? (
                        <Button size="sm" variant="secondary" onClick={() => addToCart(c, item)} aria-label={`Add ${item.name}`}>
                          <MdIcon name="add" size={18} />
                          Add
                        </Button>
                      ) : (
                        <QtyStepper value={selected} onChange={(n) => updateQty(item.id, n)} />
                      )}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="title-small">Request Summary</h3>
            {cart.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart} aria-label="Clear">
                <MdIcon name="delete" size={18} />
                Clear
              </Button>
            )}
          </div>
          {cart.length === 0 ? (
            <p className="body-small text-text-secondary">No items selected yet</p>
          ) : (
            <div className="space-y-2">
              {cart.map(ci => (
                <div key={ci.id} className="p-3 rounded-xl bg-muted/30 border border-divider flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="label-medium truncate">{ci.name}</p>
                    <p className="body-small text-text-secondary">{ci.qty} × {ci.unit}</p>
                  </div>
                  <QtyStepper value={ci.qty} onChange={(n) => updateQty(ci.id, n)} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="title-small">Common Request Form</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <Label className="body-small text-text-secondary">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                <SelectTrigger aria-label="Priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="body-small text-text-secondary">Needed By</Label>
              <Input type="date" value={neededBy} onChange={(e) => setNeededBy(e.target.value)} aria-label="Needed by date" />
            </div>

            <div className="space-y-1">
              <Label className="body-small text-text-secondary">Destination</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger aria-label="Destination">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHC">PHC</SelectItem>
                  <SelectItem value="CHC">CHC</SelectItem>
                  <SelectItem value="Block Office">Block Office</SelectItem>
                  <SelectItem value="District Hospital">District Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="body-small text-text-secondary">Purpose / Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add brief justification or delivery instructions" rows={3} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Button className="bg-asha text-white hover:bg-asha/90" onClick={submit} aria-label="Submit request">
            <MdIcon name="send" size={18} />
            Submit Request to Authority
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
