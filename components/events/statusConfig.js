const statusConfig = {
  Upcoming: {
    gradient: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50',
    text: 'text-emerald-700',
    border: 'border-l-4 border-emerald-500',
    badge: 'bg-emerald-500 text-white',
    dot: 'bg-emerald-500',
    shadow: 'hover:shadow-emerald-100',
    calColor: '#10B981',
    calBorder: '#059669'
  },
  Ongoing: {
    gradient: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
    text: 'text-amber-700',
    border: 'border-l-4 border-amber-500',
    badge: 'bg-amber-500 text-white',
    dot: 'bg-amber-500',
    shadow: 'hover:shadow-amber-100',
    calColor: '#F59E0B',
    calBorder: '#F97316'
  },
  Passed: {
    gradient: 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50',
    text: 'text-slate-600',
    border: 'border-l-4 border-slate-400',
    badge: 'bg-slate-400 text-white',
    dot: 'bg-slate-400',
    shadow: 'hover:shadow-slate-100',
    calColor: '#94A3B8',
    calBorder: '#CBD5E1'
  }
};

export default statusConfig;
