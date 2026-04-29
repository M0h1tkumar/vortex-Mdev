import React from 'react';
import MachinedCard from '../../components/common/MachinedCard';
import TrackDivider from '../../components/common/TrackDivider';

const DashboardPage = ({ user }) => {
  return (
    <div className="flex-1 p-4 md:p-8 bg-surface flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="mb-10">
          <div className="flex items-center gap-3 text-secondary uppercase font-headline-sm font-bold tracking-tighter">
            <span className="material-symbols-outlined">person</span>
            PERSONAL DASHBOARD
          </div>
          <h2 className="font-headline-lg text-primary uppercase leading-tight mt-2">Welcome, {user?.name}</h2>
          <TrackDivider className="w-48 mt-4" />
        </div>

        <MachinedCard accent className="p-6 md:p-10">
          <h3 className="font-headline-md text-primary uppercase mb-6 border-b border-slate-200 pb-4">Passenger Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="font-label-sm text-slate-500 uppercase tracking-widest mb-1">Full Name</p>
              <p className="font-body-lg text-primary font-medium">{user?.name || 'N/A'}</p>
            </div>
            
            <div>
              <p className="font-label-sm text-slate-500 uppercase tracking-widest mb-1">Registration ID</p>
              <p className="font-body-lg text-primary font-medium">{user?.registrationId || 'N/A'}</p>
            </div>

            <div>
              <p className="font-label-sm text-slate-500 uppercase tracking-widest mb-1">Campus</p>
              <p className="font-body-lg text-primary font-medium">{user?.campus || 'N/A'}</p>
            </div>

            <div>
              <p className="font-label-sm text-slate-500 uppercase tracking-widest mb-1">Domain</p>
              <p className="font-body-lg text-[#00408B] font-bold">{user?.domain || 'N/A'}</p>
            </div>

            <div>
              <p className="font-label-sm text-slate-500 uppercase tracking-widest mb-1">Email</p>
              <p className="font-body-lg text-primary font-medium">{user?.email || 'N/A'}</p>
            </div>

            <div>
              <p className="font-label-sm text-slate-500 uppercase tracking-widest mb-1">Phone</p>
              <p className="font-body-lg text-primary font-medium">{user?.phone || 'N/A'}</p>
            </div>
            
            <div>
              <p className="font-label-sm text-slate-500 uppercase tracking-widest mb-1">Gender</p>
              <p className="font-body-lg text-primary font-medium">{user?.gender || 'N/A'}</p>
            </div>
          </div>
        </MachinedCard>
      </div>
    </div>
  );
};

export default DashboardPage;
