import { Button } from '@/components/ui/button';

const sections = [
  'Health Alerts & Updates',
  'Water Quality Monitoring & Reporting',
  'Training & Awareness Resources',
  'Patient Alerts & Inspection Requests',
  'Supply Management & Inventory Control'
];

const AshaBottomNavbar = () => {
  return (
    <nav className="bottom-nav">
      <div className="h-full flex items-center justify-around px-2">
        {sections.map((label) => (
          <Button
            key={label}
            variant="ghost"
            type="button"
            onClick={() => {}}
            className="nav-item ripple"
          >
            <div className="flex flex-col items-center px-2 py-1">
              <span className="text-[10px] leading-tight text-center font-medium text-text-secondary break-words">
                {label}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default AshaBottomNavbar;
