import React from 'react';
import {
  BriefcaseMedical,
  Users,
  BellRing,
  Award,
  CreditCard,
  FileCheck2,
} from 'lucide-react';

interface ServicesGridProps {
  onSelectService: (serviceName: string) => void;
  onOpenDoctors: () => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  onSelectService,
  onOpenDoctors,
}) => {
  const services = [
    {
      id: 'service-doctors',
      name: 'Doctors',
      icon: BriefcaseMedical,
      bgColor: 'bg-emerald-50 text-emerald-600',
      action: onOpenDoctors,
      count: '4 Listed',
    },
    {
      id: 'service-mr',
      name: 'MR',
      icon: Users,
      bgColor: 'bg-blue-50 text-blue-600',
      action: () => onSelectService('MR'),
      count: 'Shivam (HQ)',
    },
    {
      id: 'service-reminder',
      name: 'Reminder Cards',
      icon: BellRing,
      bgColor: 'bg-amber-50 text-amber-600',
      action: () => onSelectService('Reminder Cards'),
      count: 'LBL & Cards',
    },
    {
      id: 'service-certificates',
      name: 'Certificates',
      icon: Award,
      bgColor: 'bg-pink-50 text-pink-600',
      action: () => onSelectService('Certificates'),
      count: 'WHO-GMP & ISO',
    },
    {
      id: 'service-visiting-card',
      name: 'Visiting Card',
      icon: CreditCard,
      bgColor: 'bg-teal-50 text-teal-600',
      action: () => onSelectService('Visiting Card'),
      count: 'Digital E-Card',
    },
    {
      id: 'service-coa',
      name: 'COA Reports',
      icon: FileCheck2,
      bgColor: 'bg-sky-50 text-sky-600',
      action: () => onSelectService('COA Reports'),
      count: 'Lab Tested',
    },
  ];

  return (
    <div className="px-4 sm:px-6 pt-5 pb-3">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            Services
          </h2>
          <button
            onClick={() => onSelectService('All Services')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700"
          >
            See all
          </button>
        </div>

        {/* 6 Cards Grid matching Screenshot 3 */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3.5">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <button
                id={item.id}
                key={item.id}
                onClick={item.action}
                className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md border border-slate-100 transition-all duration-200 active:scale-95 group"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-105 ${item.bgColor}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-600 mt-0.5 font-medium">
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
