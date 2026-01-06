
import React, { useState, useEffect } from 'react';
import { AppView, ExamPattern, TestAttempt, Lobby, CrewMember, SubjectBook } from './types';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Admin from './components/Admin';
import Results from './components/Results';
import TestEngine from './components/TestEngine';
import PatternCreator from './components/PatternCreator';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [patterns, setPatterns] = useState<ExamPattern[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [books, setBooks] = useState<SubjectBook[]>([]);
  
  // Auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [activePattern, setActivePattern] = useState<ExamPattern | null>(null);
  const [activeCrew, setActiveCrew] = useState<CrewMember | null>(null);
  const [activeLobby, setActiveLobby] = useState<Lobby | null>(null);
  const [lastAttemptId, setLastAttemptId] = useState<string | null>(null);

  useEffect(() => {
    const p = localStorage.getItem('cbot_patterns');
    const a = localStorage.getItem('cbot_attempts');
    const l = localStorage.getItem('cbot_lobbies');
    const c = localStorage.getItem('cbot_crew');
    const b = localStorage.getItem('cbot_books');
    
    if (p) setPatterns(JSON.parse(p));
    if (a) setAttempts(JSON.parse(a));
    if (l) setLobbies(JSON.parse(l));
    if (c) setCrew(JSON.parse(c));
    if (b) setBooks(JSON.parse(b));
  }, []);

  const savePatterns = (updated: ExamPattern[]) => {
    setPatterns(updated);
    localStorage.setItem('cbot_patterns', JSON.stringify(updated));
  };

  const saveLobbies = (updated: Lobby[]) => {
    setLobbies(updated);
    localStorage.setItem('cbot_lobbies', JSON.stringify(updated));
  };

  const saveCrew = (updated: CrewMember[]) => {
    setCrew(updated);
    localStorage.setItem('cbot_crew', JSON.stringify(updated));
  };

  const saveBooks = (updated: SubjectBook[]) => {
    setBooks(updated);
    localStorage.setItem('cbot_books', JSON.stringify(updated));
  };

  const addAttempt = (attempt: TestAttempt) => {
    const updated = [attempt, ...attempts];
    setAttempts(updated);
    setLastAttemptId(attempt.id);
    localStorage.setItem('cbot_attempts', JSON.stringify(updated));
  };

  const deleteAttempt = (id: string) => {
    const updated = attempts.filter(a => a.id !== id);
    setAttempts(updated);
    localStorage.setItem('cbot_attempts', JSON.stringify(updated));
  };

  const startTest = (pattern: ExamPattern, crewMember: CrewMember, lobby: Lobby) => {
    setActivePattern(pattern);
    setActiveCrew(crewMember);
    setActiveLobby(lobby);
    setLastAttemptId(null);
    setView('test');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Lobby@555') {
      setIsAdminAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const renderAdminContent = () => {
    if (!isAdminAuthenticated) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn">
          <div className="w-full max-w-md bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 text-center">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">Restricted Area</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Administrative Clearance Required</p>
            
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="relative">
                <input 
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter Admin Password"
                  className={`w-full p-5 bg-slate-50 border-2 rounded-2xl font-black text-center text-slate-800 outline-none transition-all ${loginError ? 'border-rose-500 animate-shake' : 'border-slate-100 focus:border-slate-900'}`}
                  autoFocus
                />
              </div>
              {loginError && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Authentication Failed</p>}
              <button 
                type="submit"
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
              >
                Verify Credentials
              </button>
            </form>
          </div>
        </div>
      );
    }

    return view === 'admin' ? (
      <Admin 
        patterns={patterns}
        lobbies={lobbies}
        crew={crew}
        books={books}
        onSavePatterns={savePatterns}
        onSaveLobbies={saveLobbies}
        onSaveCrew={saveCrew}
        onSaveBooks={saveBooks}
        onCreatePattern={() => setView('creator')}
      />
    ) : (
      <PatternCreator 
        onSave={(p) => {
          savePatterns([p, ...patterns]);
          setView('admin');
        }}
        onCancel={() => setView('admin')}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navigation onNavigate={(v) => { setView(v); setLastAttemptId(null); }} currentView={view} />
      
      <main className="flex-1 flex flex-col p-6 md:p-10 max-w-7xl mx-auto w-full">
        {view === 'home' && (
          <Home 
            patterns={patterns} 
            lobbies={lobbies}
            crew={crew}
            books={books}
            onStartTest={startTest} 
          />
        )}
        
        {(view === 'admin' || view === 'creator') && renderAdminContent()}

        {view === 'result' && (
          <Results 
            attempts={attempts} 
            lobbies={lobbies} 
            initialViewId={lastAttemptId}
            onDeleteAttempt={deleteAttempt}
          />
        )}

        {view === 'test' && activePattern && activeCrew && activeLobby && (
          <TestEngine 
            pattern={activePattern} 
            crew={activeCrew}
            lobby={activeLobby}
            onComplete={(attempt) => {
              addAttempt(attempt);
              setView('result');
            }}
            onCancel={() => setView('home')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
