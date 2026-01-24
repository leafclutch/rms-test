import React from 'react';
import { Construction, Sparkles, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WorkInProgressProps {
    featureName: string;
}

const WorkInProgress: React.FC<WorkInProgressProps> = ({ featureName }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative">
                <div className="w-24 h-24 bg-[#16516f]/10 rounded-3xl flex items-center justify-center animate-bounce-subtle">
                    <Construction className="w-12 h-12 text-[#16516f]" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                </div>
            </div>

            <div className="space-y-4 max-w-md">
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                    {featureName} <br />
                    <span className="text-[#16516f] italic tracking-tight">Coming Soon!</span>
                </h1>
                <p className="text-slate-500 font-medium leading-relaxed">
                    We're currently polishing the <span className="text-[#16516f] font-bold">{featureName}</span> experience to match our high standards of excellence. Stay tuned for a smarter way to manage your restaurant.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-[#16516f] text-white px-8 py-3 rounded-xl font-black flex items-center gap-2 shadow-xl shadow-[#16516f]/10 hover:bg-[#114058] transition-all hover:scale-105 active:scale-95"
                >
                    <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-white text-slate-900 border border-slate-200 px-8 py-3 rounded-xl font-black hover:bg-slate-50 transition-colors"
                >
                    Go Back
                </button>
            </div>

            {/* Brand Watermark */}
            <div className="pt-12 opacity-10 flex items-center gap-2 grayscale pointer-events-none">
                <div className="w-6 h-6 bg-[#16516f] rounded flex items-center justify-center">
                    <LayoutDashboard className="w-3 h-3 text-white" />
                </div>
                <span className="font-bold tracking-tight">LeafClutch Technology</span>
            </div>

            <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s infinite ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default WorkInProgress;
