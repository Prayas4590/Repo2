import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  ShoppingCart,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { toast } = useToast();

  const inventoryItems = [
    {
      id: 1,
      name: 'Water Test Kits',
      category: 'Testing Equipment',
      currentStock: 12,
      minStock: 20,
      maxStock: 50,
      unit: 'units',
      lastRestocked: '2024-01-10',
      supplier: 'HealthTech Supplies',
      cost: 450,
      status: 'low'
    },
    {
      id: 2,
      name: 'Digital Thermometers',
      category: 'Medical Devices',
      currentStock: 35,
      minStock: 15,
      maxStock: 40,
      unit: 'units',
      lastRestocked: '2024-01-08',
      supplier: 'MediCore Ltd',
      cost: 250,
      status: 'good'
    },
    {
      id: 3,
      name: 'Antiseptic Solution',
      category: 'Medical Supplies',
      currentStock: 8,
      minStock: 25,
      maxStock: 100,
      unit: 'bottles',
      lastRestocked: '2024-01-05',
      supplier: 'PharmaCare',
      cost: 180,
      status: 'critical'
    },
    {
      id: 4,
      name: 'Blood Pressure Monitors',
      category: 'Medical Devices',
      currentStock: 18,
      minStock: 10,
      maxStock: 25,
      unit: 'units',
      lastRestocked: '2024-01-12',
      supplier: 'MediCore Ltd',
      cost: 320,
      status: 'good'
    },
    {
      id: 5,
      name: 'Bandages',
      category: 'Medical Supplies',
      currentStock: 145,
      minStock: 50,
      maxStock: 200,
      unit: 'rolls',
      lastRestocked: '2024-01-14',
      supplier: 'HealthCare Supplies',
      cost: 85,
      status: 'good'
    },
    {
      id: 6,
      name: 'pH Test Strips',
      category: 'Testing Equipment',
      currentStock: 5,
      minStock: 30,
      maxStock: 100,
      unit: 'packs',
      lastRestocked: '2023-12-28',
      supplier: 'LabTech Solutions',
      cost: 120,
      status: 'critical'
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Items', count: inventoryItems.length },
    { id: 'critical', label: 'Critical', count: inventoryItems.filter(i => i.status === 'critical').length },
    { id: 'low', label: 'Low Stock', count: inventoryItems.filter(i => i.status === 'low').length },
    { id: 'good', label: 'Good Stock', count: inventoryItems.filter(i => i.status === 'good').length }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-error text-error-foreground';
      case 'low': return 'bg-warning text-warning-foreground';
      case 'good': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return AlertTriangle;
      case 'low': return TrendingDown;
      case 'good': return CheckCircle;
      default: return Package;
    }
  };

  const calculateStockPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  const handleRequestRefill = (itemName: string) => {
    toast({
      title: "Refill Requested",
      description: `Refill request for ${itemName} has been submitted to the coordinator.`,
    });
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || item.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="headline-medium text-text-primary mb-2">Inventory Management</h1>
        <p className="body-medium text-text-secondary">
          Track and manage medical supplies
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
            placeholder="Search inventory..."
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

      {/* Inventory Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="material-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl text-error mb-1">
              {inventoryItems.filter(i => i.status === 'critical').length}
            </div>
            <div className="body-small text-text-secondary">Critical</div>
          </CardContent>
        </Card>
        <Card className="material-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl text-warning mb-1">
              {inventoryItems.filter(i => i.status === 'low').length}
            </div>
            <div className="body-small text-text-secondary">Low Stock</div>
          </CardContent>
        </Card>
        <Card className="material-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl text-success mb-1">
              {inventoryItems.filter(i => i.status === 'good').length}
            </div>
            <div className="body-small text-text-secondary">Good Stock</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const StatusIcon = getStatusIcon(item.status);
          const stockPercentage = calculateStockPercentage(item.currentStock, item.maxStock);
          
          return (
            <Card key={item.id} className="material-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon and Status */}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 ${
                      item.status === 'critical' ? 'bg-error/10' :
                      item.status === 'low' ? 'bg-warning/10' : 'bg-success/10'
                    } rounded-xl flex items-center justify-center`}>
                      <StatusIcon className={`h-6 w-6 ${
                        item.status === 'critical' ? 'text-error' :
                        item.status === 'low' ? 'text-warning' : 'text-success'
                      }`} />
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="label-large text-text-primary">{item.name}</h3>
                        <p className="body-small text-text-secondary">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="title-small text-text-primary">{item.currentStock}</p>
                        <p className="body-small text-text-secondary">{item.unit}</p>
                      </div>
                    </div>

                    {/* Stock Level Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="body-small text-text-secondary">Stock Level</span>
                        <span className="body-small text-text-secondary">
                          {item.currentStock}/{item.maxStock} {item.unit}
                        </span>
                      </div>
                      <Progress 
                        value={stockPercentage} 
                        className="h-2"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="body-small text-error">Min: {item.minStock}</span>
                        <span className="body-small text-success">Max: {item.maxStock}</span>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="grid grid-cols-2 gap-3 mb-3 text-text-disabled">
                      <div>
                        <p className="body-small">Last Restocked</p>
                        <p className="body-small font-medium">{item.lastRestocked}</p>
                      </div>
                      <div>
                        <p className="body-small">Supplier</p>
                        <p className="body-small font-medium">{item.supplier}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="p-2">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-3 py-1 bg-muted rounded text-sm">{item.currentStock}</span>
                        <Button variant="outline" size="sm" className="p-2">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {(item.status === 'critical' || item.status === 'low') && (
                        <Button 
                          size="sm" 
                          onClick={() => handleRequestRefill(item.name)}
                          className="bg-primary text-primary-foreground ripple"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Request Refill
                        </Button>
                      )}
                    </div>

                    {/* Cost Information */}
                    <div className="mt-3 p-2 bg-muted/30 rounded-lg">
                      <span className="body-small text-text-secondary">
                        Unit Cost: ₹{item.cost} • Total Value: ₹{item.cost * item.currentStock}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredItems.length === 0 && (
        <Card className="material-card text-center">
          <CardContent className="p-8">
            <Package className="h-12 w-12 text-text-disabled mx-auto mb-4" />
            <h3 className="title-medium text-text-primary mb-2">No items found</h3>
            <p className="body-medium text-text-secondary">
              {searchQuery ? 'Try adjusting your search terms' : 'No items match the selected filter'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* FAB for Add Item */}
      <Button className="fab bg-coordinator text-white hover:bg-coordinator/90">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default InventoryPage;