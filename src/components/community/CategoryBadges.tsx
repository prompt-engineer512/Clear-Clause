import React from 'react';
import { 
  HelpCircle, 
  Lock, 
  DollarSign, 
  EyeOff, 
  ShieldCheck, 
  Star, 
  AlertTriangle, 
  BookOpen, 
  Lightbulb, 
  MessageSquare,
  Compass
} from 'lucide-react';
import { CommunityCategory } from '../../types';

export const CATEGORIES_CONFIG: {
  id: CommunityCategory;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    id: 'Ask Clear Clause',
    name: 'Ask Clear Clause',
    icon: HelpCircle,
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/25'
  },
  {
    id: 'Privacy',
    name: 'Privacy',
    icon: Lock,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/25'
  },
  {
    id: 'Refund & Money',
    name: 'Refund & Money',
    icon: DollarSign,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/25'
  },
  {
    id: 'Hidden Clauses',
    name: 'Hidden Clauses',
    icon: EyeOff,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/25'
  },
  {
    id: 'Security',
    name: 'Security',
    icon: ShieldCheck,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/25'
  },
  {
    id: 'App/Website Reviews',
    name: 'App/Website Reviews',
    icon: Star,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/25'
  },
  {
    id: 'Risk Alerts',
    name: 'Risk Alerts',
    icon: AlertTriangle,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/25'
  },
  {
    id: 'Learn',
    name: 'Learn',
    icon: BookOpen,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/25'
  },
  {
    id: 'Suggestions',
    name: 'Suggestions',
    icon: Lightbulb,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/25'
  },
  {
    id: 'General Discussion',
    name: 'General Discussion',
    icon: MessageSquare,
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/25'
  }
];

export const getCategoryMeta = (category: string) => {
  return CATEGORIES_CONFIG.find((c) => c.id === category) || {
    id: category as CommunityCategory,
    name: category,
    icon: Compass,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/25'
  };
};

interface CategoryBadgeProps {
  category: CommunityCategory | string;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm', onClick }) => {
  const meta = getCategoryMeta(category);
  const Icon = meta.icon;

  const content = (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border tracking-tight transition whitespace-nowrap ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${meta.bgColor} ${meta.color} ${meta.borderColor}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{meta.name}</span>
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="hover:opacity-85 cursor-pointer focus:outline-none"
      >
        {content}
      </button>
    );
  }

  return content;
};
