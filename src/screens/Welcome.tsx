import { Car, CircleUser as UserCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';

export default function Welcome() {
  const { setUserMode } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-6">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Car className="w-12 h-12 text-amber-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
          Luxe Transfers
        </h1>
        <p className="text-slate-300 text-lg">Premium Executive Transport</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={() => setUserMode('customer')}
          className="w-full bg-white hover:bg-slate-50 text-slate-900 px-8 py-6 rounded-2xl font-semibold transition-all duration-200 active:scale-95 shadow-lg flex items-center justify-between group"
        >
          <span className="text-lg">Enter as Customer</span>
          <UserCircle2 className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors" />
        </button>

        <button
          onClick={() => setUserMode('driver')}
          className="w-full bg-amber-600 hover:bg-amber-500 text-white px-8 py-6 rounded-2xl font-semibold transition-all duration-200 active:scale-95 shadow-lg flex items-center justify-between group"
        >
          <span className="text-lg">Enter as Driver</span>
          <Car className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="mt-16 text-center">
        <p className="text-slate-400 text-sm">
          Demonstration Mode
        </p>
        <p className="text-slate-500 text-xs mt-1">
          No authentication required
        </p>
      </div>
    </div>
  );
}
