import React, { useState } from 'react';
import MachinedCard from '../../components/common/MachinedCard';
import TrackDivider from '../../components/common/TrackDivider';
import { Link } from 'react-router-dom';

const CrewPage = ({ user, teamMembers, setTeamMembers, teamName, setTeamName, isLocked, setIsLocked, problemStatement, setProblemStatement }) => {
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [tempTeamName, setTempTeamName] = useState('');
  const [tempProblemStatement, setTempProblemStatement] = useState('');

  const hasFemaleMember = teamMembers.some(member => member.gender === 'Female');
  const isLeader = teamMembers.length > 0 && teamMembers[0].id === user.id;

  const handleInitializeCrew = (e) => {
    e.preventDefault();
    if (!tempTeamName.trim()) {
      alert("Please enter a crew name.");
      return;
    }
    setTeamName(tempTeamName);
    setProblemStatement(tempProblemStatement);
    setTeamMembers([user]);
    setIsInitModalOpen(false);
  };

  const removeMember = (member) => {
    if (isLocked) return;
    if (member.id === user.id) {
      alert("You cannot remove yourself. Leave the crew instead.");
      return;
    }
    setTeamMembers(teamMembers.filter(m => m.id !== member.id));
  };

  const leaveCrew = () => {
    if (isLocked) return;
    if (isLeader) {
      alert("As the leader, leaving will dissolve the entire crew.");
      setTeamMembers([]);
      setTeamName('');
      setProblemStatement('');
    } else {
      setTeamMembers(teamMembers.filter(m => m.id !== user.id));
    }
  };

  const lockTeam = () => {
    if (!hasFemaleMember) {
      alert("Diversity Rule: Your team must have at least one female member before locking.");
      return;
    }
    if (problemStatement.trim() === '') {
      alert("Please provide a Problem Statement before locking.");
      return;
    }
    setIsLocked(true);
    alert("Team Locked Successfully!");
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-surface flex justify-center relative">
      <div className="w-full max-w-5xl">
        <div className="mb-10">
          <div className="flex items-center gap-3 text-secondary uppercase font-headline-sm font-bold tracking-tighter">
            <span className="material-symbols-outlined">engineering</span>
            CREW MANAGEMENT
          </div>
          <h2 className="font-headline-lg text-primary uppercase leading-tight mt-2">Team Assembly</h2>
          <TrackDivider className="w-48 mt-4" />
        </div>

        {teamMembers.length === 0 ? (
          <MachinedCard className="p-10 text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">group_off</span>
            <h3 className="font-headline-md text-primary uppercase mb-2">No Active Crew</h3>
            <p className="font-body-md text-slate-500 max-w-md mx-auto mb-8">
              You are currently flying solo. You can either initialize a new crew as a team leader or wait for invitations from others.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setIsInitModalOpen(true)} className="bg-[#00408B] text-white px-8 py-3 font-label-md uppercase hover:bg-primary transition-colors shadow-md">
                Initialize New Crew
              </button>
              <Link to="/requests" className="border border-[#00408B] text-[#00408B] px-8 py-3 font-label-md uppercase hover:bg-blue-50 transition-colors">
                Check Invites
              </Link>
            </div>
          </MachinedCard>
        ) : (
          <MachinedCard accent className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4 border-b border-slate-200 pb-6">
              <div>
                <h3 className="font-headline-md text-primary uppercase">{teamName || 'Your Crew'}</h3>
                <p className="font-body-md text-on-surface-variant">Domain: <span className="font-bold text-[#00408B]">{user.domain}</span></p>
              </div>
              <div className="flex items-center gap-4">
                {isLocked ? (
                  <span className="bg-primary text-white px-4 py-2 font-label-md uppercase shadow flex items-center gap-2 w-max">
                    <span className="material-symbols-outlined text-sm">lock</span> LOCKED
                  </span>
                ) : (
                  <span className="bg-secondary-container text-on-secondary-container px-4 py-2 font-label-md uppercase border border-secondary w-max">
                    ASSEMBLING
                  </span>
                )}
                {!isLocked && (
                  <button onClick={leaveCrew} className="text-error hover:underline font-label-sm uppercase">
                    {isLeader ? 'Dissolve Crew' : 'Leave Crew'}
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-3 mb-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex justify-between items-center bg-surface-container p-4 border-l-4 border-[#00408B]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-300 flex-shrink-0">
                      <span className="material-symbols-outlined text-slate-500">person</span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-label-md text-primary uppercase truncate">
                        {member.name} {teamMembers[0].id === member.id && <span className="text-secondary ml-1">(Leader)</span>}
                      </p>
                      <p className="font-label-sm text-slate-500">{member.gender}</p>
                    </div>
                  </div>
                  {!isLocked && isLeader && member.id !== user.id && (
                    <button onClick={() => removeMember(member)} className="text-error hover:bg-error-container p-2 transition-colors flex items-center justify-center flex-shrink-0" title="Remove Member">
                      <span className="material-symbols-outlined">person_remove</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-8">
              <label className="font-label-md text-primary uppercase block">Problem Statement</label>
              <textarea 
                rows={4}
                disabled={isLocked || !isLeader}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className={`w-full bg-surface border border-slate-300 p-4 font-body-md outline-none focus:border-[#00408B] ${isLocked || !isLeader ? 'opacity-70 cursor-not-allowed' : ''}`}
                placeholder={isLeader ? "Enter your team's specific problem statement..." : "Waiting for leader to add statement..."}
              />
            </div>

            {!isLocked && isLeader && (
              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className={`flex items-center gap-2 ${hasFemaleMember ? 'text-secondary' : 'text-error'}`}>
                  <span className="material-symbols-outlined">{hasFemaleMember ? 'check_circle' : 'warning'}</span>
                  <span className="font-label-md uppercase">Diversity: {hasFemaleMember ? 'Met' : 'Need 1 Female'}</span>
                </div>
                <button 
                  onClick={lockTeam}
                  className="w-full sm:w-auto bg-[#00408B] text-white px-8 py-3 font-label-md uppercase flex items-center justify-center gap-2 hover:bg-primary transition-colors"
                >
                  <span>Finalize Team</span>
                  <span className="material-symbols-outlined">done_all</span>
                </button>
              </div>
            )}
          </MachinedCard>
        )}
      </div>

      {/* Initialization Modal */}
      {isInitModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <MachinedCard accent className="w-full max-w-lg bg-white p-8">
            <div className="flex justify-between items-start mb-6 border-b border-slate-200 pb-4">
              <h3 className="font-headline-md text-primary uppercase">Initialize Crew</h3>
              <button onClick={() => setIsInitModalOpen(false)} className="text-slate-400 hover:text-error">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleInitializeCrew} className="space-y-6">
              <div className="space-y-2">
                <label className="font-label-md text-primary uppercase block">Crew Name</label>
                <input 
                  required
                  autoFocus
                  type="text" 
                  value={tempTeamName}
                  onChange={(e) => setTempTeamName(e.target.value)}
                  className="w-full bg-surface border border-slate-300 p-3 font-body-md outline-none focus:border-[#00408B]"
                  placeholder="e.g. Alpha Mavericks"
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-primary uppercase block">Problem Statement (Optional)</label>
                <textarea 
                  rows={3}
                  value={tempProblemStatement}
                  onChange={(e) => setTempProblemStatement(e.target.value)}
                  className="w-full bg-surface border border-slate-300 p-3 font-body-md outline-none focus:border-[#00408B]"
                  placeholder="Can be added or updated later..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsInitModalOpen(false)} 
                  className="px-6 py-2 border border-slate-300 text-slate-600 font-label-md uppercase hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-[#00408B] text-white px-6 py-2 font-label-md uppercase hover:bg-primary transition-colors flex items-center gap-2"
                >
                  <span>Create Crew</span>
                  <span className="material-symbols-outlined text-sm">rocket_launch</span>
                </button>
              </div>
            </form>
          </MachinedCard>
        </div>
      )}
    </div>
  );
};

export default CrewPage;
