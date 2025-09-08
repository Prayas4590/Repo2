import { Button } from '@/components/ui/button';
import MdIcon from '@/components/ui/md3-icon';

export type AshaSectionKey = 'alerts' | 'water' | 'training' | 'patients' | 'inventory';

const sections: { id: AshaSectionKey; label: string; icon: string }[] = [
  { id: 'alerts', label: 'Health Alerts & Updates', icon: 'health_and_safety' },
  { id: 'water', label: 'Water Quality Monitoring & Reporting', icon: 'water_drop' },
  { id: 'training', label: 'Training & Awareness Resources', icon: 'menu_book' },
  { id: 'patients', label: 'Patient Alerts & Inspection Requests', icon: 'notification_important' },
  { id: 'inventory', label: 'Supply Management & Inventory Control', icon: 'inventory_2' }
];

interface Props {
  activeKey: AshaSectionKey;
  onChange: (key: AshaSectionKey) => void;
}

const AshaBottomNavbar = ({ activeKey, onChange }: Props) => {
  return (
    <nav className="bottom-nav">
      <div className="h-full flex items-center justify-around px-2">
        {sections.map((item) => {
          const active = activeKey === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              type="button"
              onClick={() => onChange(item.id)}
              className={`nav-item ripple ${active ? 'active' : ''}`}
            >
              <div className={`flex flex-col items-center px-2 py-1 ${active ? 'bg-primary/10 rounded-full' : ''}`}>
                <MdIcon name={item.icon} size={20} className={active ? 'text-primary' : 'text-text-secondary'} />
                <span className={`text-[10px] leading-tight text-center font-medium break-words mt-1 ${active ? 'text-primary' : 'text-text-secondary'}`}>
                  {item.label}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default AshaBottomNavbar;
