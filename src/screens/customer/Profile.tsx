import { LogOut, Mail, Phone, Building2, Car } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockCustomer } from '../../data/mockData';
import BottomNav from '../../components/BottomNav';
import Button from '../../components/Button';

interface ProfileProps {
  onBottomNavChange: (tab: 'home' | 'history' | 'notifications' | 'profile') => void;
}

export default function Profile({ onBottomNavChange }: ProfileProps) {
  const { setUserMode } = useApp();

  const handleLogout = () => {
    setUserMode(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 pt-8 pb-12 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
        <p className="text-slate-300">{mockCustomer.name}</p>
      </div>

      <div className="px-6 -mt-6 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4">
            Personal Information
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-slate-500">Email</p>
                <p className="text-slate-900">{mockCustomer.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-slate-500">Phone</p>
                <p className="text-slate-900">{mockCustomer.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-slate-500">Account Type</p>
                <p className="text-slate-900">
                  {mockCustomer.customerType === 'B2C'
                    ? 'Personal Account'
                    : 'Business Account'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4">Preferences</h3>

          <div className="flex items-start gap-3">
            <Car className="w-5 h-5 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-slate-500">Preferred Vehicle</p>
              <p className="text-slate-900 capitalize">
                {mockCustomer.preferredVehicleType?.replace('_', ' ') ||
                  'Not set'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4">Support</h3>

          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors">
              <p className="font-medium text-slate-900">Help Center</p>
              <p className="text-sm text-slate-500 mt-0.5">
                Get answers to common questions
              </p>
            </button>

            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors">
              <p className="font-medium text-slate-900">Contact Support</p>
              <p className="text-sm text-slate-500 mt-0.5">
                Reach out to our support team
              </p>
            </button>
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <p className="text-sm text-amber-900 text-center">
            Demo Mode - No account changes will be saved
          </p>
        </div>

        <Button
          variant="outline"
          fullWidth
          onClick={handleLogout}
          className="flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Switch Mode
        </Button>
      </div>

      <BottomNav active="profile" onNavigate={onBottomNavChange} />
    </div>
  );
}
