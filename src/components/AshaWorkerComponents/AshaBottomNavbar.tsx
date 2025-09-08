import { Button } from '@/components/ui/button';
import MdIcon from '@/components/ui/md3-icon';

const sections = [
  { label: 'Health Alerts & Updates', icon: 'health_and_safety' },
  { label: 'Water Quality Monitoring & Reporting', icon: 'water_drop' },
  { label: 'Training & Awareness Resources', icon: 'menu_book' },
  { label: 'Patient Alerts & Inspection Requests', icon: 'notification_important' },
  { label: 'Supply Management & Inventory Control', icon: 'inventory_2' }
];

const AshaBottomNavbar = () => {
  return (
    <nav className="bottom-nav">
      <div className="h-full flex items-center justify-around px-2">
        {sections.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            type="button"
            onClick={() => {}}
            className="nav-item ripple"
          >
            <div className="flex flex-col items-center px-2 py-1">
              <MdIcon name={item.icon} size={20} className="text-text-secondary" />
              <span className="text-[10px] leading-tight text-center font-medium text-text-secondary break-words mt-1">
                {item.label}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default AshaBottomNavbar;
