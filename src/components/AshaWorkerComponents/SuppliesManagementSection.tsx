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

  // Manual add inputs
  const [manualName, setManualName] = useState('');
  const [manualQty, setManualQty] = useState<number>(1);
  const [manualCategory, setManualCategory] = useState<SupplyCategory>(categories[0]);
  const [viewCategory, setViewCategory] = useState<SupplyCategory | null>(null);

  const addManual = () => {
    const name = manualName.trim();
    const qty = Number(manualQty) || 0;
    if (!name) return toast('Enter item name');
    if (qty <= 0) return toast('Enter valid quantity');
    const id = `manual-${Date.now()}`;
    setCart(prev => [{ id, name, unit: 'pcs', qty, category: manualCategory }, ...prev]);
    setManualName('');
    setManualQty(1);
    toast('Added to request');
  };

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

  const STOCK_COUNTS: Record<string, number> = {
    rapid_test_kits: 24,
    sample_containers: 120,
    collection_tools: 40,
    ors: 300,
    basic_medicines: 200,
    iv_fluids: 30,
    first_aid: 45,
    ppe_gloves_masks_gowns: 150,
    sanitizers: 80,
    goggles_shields: 25,
    purification: 60,
    storage_containers: 90,
    chlorination: 15,
    hygiene_posters: 75,
    education_kits: 35,
    portable_speakers: 12,
  };

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
                    <Button size="sm" variant="ghost" onClick={() => setViewCategory(c)}>
                      View stock
                    </Button>
                    <Badge variant="outline">{SUPPLIES[c].length}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Separate Request Form */}

      {viewCategory && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewCategory(null)} />

          {/* Bottom sheet container for mobile */}
          <div className="w-full max-w-md bg-surface rounded-t-2xl overflow-hidden shadow-xl translate-y-0">
            <div className="px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MdIcon name={categoryIcons[viewCategory]} size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="title-medium truncate">{viewCategory}</h3>
                  <p className="body-small text-text-secondary">Stock overview</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setViewCategory(null)} aria-label="Close">
                  <MdIcon name="close" size={18} />
                </Button>
              </div>
            </div>

            <div className="p-3 max-h-[62vh] overflow-auto space-y-3">
              {SUPPLIES[viewCategory].map(item => {
                const count = STOCK_COUNTS[item.id] ?? 0;
                const level = count <= 10 ? 'low' : count <= 50 ? 'medium' : 'ok';
                const levelClasses = level === 'low' ? 'bg-error/10 text-error' : level === 'medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success';
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-background rounded-xl border border-divider">
                    <div className="w-12 h-12 rounded-lg bg-muted/10 flex items-center justify-center">
                      <MdIcon name={item.id === 'rapid_test_kits' ? 'science' : categoryIcons[viewCategory]} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="label-medium truncate">{item.name}</p>
                      <p className="body-small text-text-secondary">Unit: {item.unit}</p>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${levelClasses}`}>{level === 'low' ? 'Low' : level === 'medium' ? 'Limited' : 'Available'}</div>
                      <p className="title-small mt-2">{count}</p>
                      <p className="body-small text-text-secondary">Available</p>
                    </div>
                  </div>
                );
              })}

              {/* Empty state */}
              {SUPPLIES[viewCategory].length === 0 && (
                <div className="p-4 text-center text-text-secondary">No stock information available</div>
              )}
            </div>

            <div className="p-3 border-t flex items-center justify-between">
              <div className="text-xs text-text-secondary">Tip: Tap items to view details</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(STOCK_COUNTS)); toast('Stock list copied'); }}>Export</Button>
                <Button onClick={() => setViewCategory(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card className="material-card">
        <CardHeader>
          <CardTitle className="title-medium flex items-center gap-2">
            <MdIcon name="assignment" size={20} className="text-asha" />
            Request Form
            <Badge className="ml-auto">{cart.length} selected</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3">
          {/* Manual item input */}
          <div className="space-y-2">
            <p className="label-medium">Add custom item</p>
            <div className="grid grid-cols-3 gap-2">
              <Input className="col-span-2" placeholder="What is needed? (e.g. Extra ORS packets)" value={manualName} aria-label="Manual item name" onChange={(e) => setManualName((e.target as HTMLInputElement).value)} />
              <Input type="number" min={1} placeholder="Qty" value={manualQty} aria-label="Manual item quantity" onChange={(e) => setManualQty(Math.max(1, Number((e.target as HTMLInputElement).value || 1)))} />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-text-secondary">Category: <span className="font-medium">{manualCategory}</span></div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => { setManualName(''); setManualQty(1); }}>Reset</Button>
                <Button size="sm" onClick={addManual}>Add to request</Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {cart.length === 0 ? (
              <p className="body-small text-text-secondary">No items selected. Use the Resources section above to add items to your request or add a custom item.</p>
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
