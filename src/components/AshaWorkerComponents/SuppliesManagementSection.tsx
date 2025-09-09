import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MdIcon from '@/components/ui/md3-icon';
import { toast } from '@/components/ui/sonner';

// Types
export type SupplyCategory =
  | 'Water Testing Supplies'
  | 'Medical & Emergency Supplies'
  | 'Personal Protective Equipment (PPE)'
  | 'Water Safety Supplies'
  | 'Community Outreach Materials';

type SupplyItem = { id: string; name: string; unit: string };

type CartItem = { id: string; name: string; unit: string; qty: number; category: SupplyCategory };

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

export default function SuppliesManagementSection() {
  const categories = Object.keys(SUPPLIES) as SupplyCategory[];
  const [expanded, setExpanded] = useState<Record<SupplyCategory, boolean>>(() => {
    const init: any = {};
    categories.forEach((c) => (init[c] = false));
    return init;
  });
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | ''>('');
  const [neededBy, setNeededBy] = useState('');
  const [destination, setDestination] = useState('PHC');
  const [notes, setNotes] = useState('');

  const toggle = (c: SupplyCategory) => setExpanded(prev => ({ ...prev, [c]: !prev[c] }));

  const addToCart = (category: SupplyCategory, item: SupplyItem) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.id === item.id);
      if (existing) return prev.map(ci => (ci.id === item.id ? { ...ci, qty: ci.qty + 1 } : ci));
      return [{ id: item.id, name: item.name, unit: item.unit, qty: 1, category }, ...prev];
    });
  };

  const updateQty = (id: string, qty: number) => {
    setCart(prev => prev.map(ci => (ci.id === id ? { ...ci, qty } : ci)).filter(ci => ci.qty > 0));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(ci => ci.id !== id));
  const clearCart = () => setCart([]);

  const filtered = (items: SupplyItem[]) => {
    const s = search.trim().toLowerCase();
    if (!s) return items;
    return items.filter(i => i.name.toLowerCase().includes(s));
  };

  const submit = () => {
    if (cart.length === 0) return toast('Select at least one item');
    if (!priority) return toast('Choose priority');
    const payload = { requestedAt: new Date().toISOString(), priority, neededBy: neededBy || null, destination, notes: notes || null, items: cart };
    try {
      navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
      toast('Request copied to clipboard');
      clearCart();
      setPriority('');
      setNeededBy('');
      setNotes('');
    } catch (e) {
      toast('Failed to submit');
    }
  };

  const totalAvailable = categories.reduce((acc, c) => acc + SUPPLIES[c].length, 0);

  return (
    <div className="space-y-3">
      {/* Resources visualization */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="title-medium flex items-center gap-2">
            <MdIcon name="inventory_2" size={20} className="text-asha" />
            Resources
            <Badge className="ml-auto">{totalAvailable} items</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3">
          <div className="flex items-center gap-2">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources" aria-label="Search resources" />
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); }} aria-label="Clear search">Clear</Button>
          </div>

          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c} className="p-2 rounded-lg bg-surface-variant/30 border border-divider">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <MdIcon name={categoryIcons[c]} size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="label-large truncate">{c}</p>
                    <p className="body-small text-text-secondary">{SUPPLIES[c].length} types</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => toggle(c)} aria-expanded={expanded[c]}>
                      {expanded[c] ? 'Hide' : 'View'}
                    </Button>
                    <Badge variant="outline">{SUPPLIES[c].length}</Badge>
                  </div>
                </div>

                {expanded[c] && (
                  <div className="mt-3 space-y-2">
                    {filtered(SUPPLIES[c]).map(item => {
                      const inCart = cart.find(ci => ci.id === item.id)?.qty || 0;
                      return (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-background rounded-lg">
                          <div className="min-w-0">
                            <p className="label-medium truncate">{item.name}</p>
                            <p className="body-small text-text-secondary">Unit: {item.unit}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {inCart === 0 ? (
                              <Button size="sm" variant="secondary" onClick={() => addToCart(c, item)}>
                                <MdIcon name="add" size={16} />
                                Add
                              </Button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Button size="icon" variant="outline" onClick={() => updateQty(item.id, Math.max(0, inCart - 1))} aria-label="Decrease">
                                  <MdIcon name="remove" size={16} />
                                </Button>
                                <div className="w-8 text-center label-medium">{inCart}</div>
                                <Button size="icon" variant="outline" onClick={() => updateQty(item.id, inCart + 1)} aria-label="Increase">
                                  <MdIcon name="add" size={16} />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.id)} aria-label="Remove">
                                  <MdIcon name="delete" size={16} />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {filtered(SUPPLIES[c]).length === 0 && <p className="body-small text-text-secondary">No items found</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Separate Request Form */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="title-medium flex items-center gap-2">
            <MdIcon name="assignment" size={20} className="text-asha" />
            Request Form
            <Badge className="ml-auto">{cart.length} selected</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3">
          <div className="space-y-2">
            {cart.length === 0 ? (
              <p className="body-small text-text-secondary">No items selected. Use the Resources section above to add items to your request.</p>
            ) : (
              <div className="space-y-2">
                {cart.map(ci => (
                  <div key={ci.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                    <div className="min-w-0">
                      <p className="label-medium truncate">{ci.name}</p>
                      <p className="body-small text-text-secondary">{ci.qty} × {ci.unit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" onClick={() => updateQty(ci.id, Math.max(0, ci.qty - 1))} aria-label="Decrease">
                        <MdIcon name="remove" size={16} />
                      </Button>
                      <div className="w-8 text-center label-medium">{ci.qty}</div>
                      <Button size="icon" variant="outline" onClick={() => updateQty(ci.id, ci.qty + 1)} aria-label="Increase">
                        <MdIcon name="add" size={16} />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => removeFromCart(ci.id)} aria-label="Remove">
                        <MdIcon name="delete" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
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

            <div>
              <Label className="body-small text-text-secondary">Needed By</Label>
              <Input type="date" value={neededBy} onChange={(e) => setNeededBy(e.target.value)} aria-label="Needed by" />
            </div>

            <div>
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

            <div>
              <Label className="body-small text-text-secondary">Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Provide justification or delivery instructions" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={clearCart}>Clear</Button>
            <Button className="bg-asha text-white" onClick={submit}>
              <MdIcon name="send" size={16} />
              Submit Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
