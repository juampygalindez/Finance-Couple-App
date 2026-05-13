import React, { useState, useEffect } from 'react';
import { T, INIT_FEED, INIT_GOALS } from './data/constants';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Goals from './components/Goals';
import Stats from './components/Stats';
import Settings from './components/Settings';
import AddModal from './components/AddModal';
import DetailModal from './components/DetailModal';
import {
  initDatabase,
  seedData,
  getTransactions,
  addTransaction,
  getGoals,
  updateGoal,
} from './utils/database';

const App = () => {
  const [tab, setTab] = useState('home');
  const [feed, setFeed] = useState([]);
  const [goals, setGoals] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [detailTx, setDetailTx] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        await initDatabase();
        await seedData(INIT_FEED, INIT_GOALS);

        const txs = await getTransactions();
        const gols = await getGoals();

        if (mounted) {
          setFeed(txs);
          setGoals(gols);
        }
      } catch (err) {
        console.error('Database init error:', err);
        // Fallback a mocks si SQLite falla (ej. en navegador sin Capacitor)
        if (mounted) {
          setFeed(INIT_FEED);
          setGoals(INIT_GOALS);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();
    return () => { mounted = false; };
  }, []);

  const handleAddExpense = async (tx) => {
    try {
      await addTransaction(tx);
      const txs = await getTransactions();
      setFeed(txs);
    } catch (err) {
      console.error('Add transaction error:', err);
      setFeed(prev => [tx, ...prev]);
    }
  };

  const handleUpdateGoals = async (id, amount) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    const newCurrent = Math.min(goal.target, goal.current + amount);

    try {
      await updateGoal(id, newCurrent);
      const gols = await getGoals();
      setGoals(gols);
    } catch (err) {
      console.error('Update goal error:', err);
      setGoals(prev => prev.map(g => g.id === id ? { ...g, current: newCurrent } : g));
    }
  };

  if (loading) {
    return (
      <div style={{
        width: '100%', height: '100%', background: T.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: T.text, fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: `3px solid ${T.border}`, borderTopColor: T.accent,
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: 14, color: T.sub }}>Cargando Pareja$…</p>
        </div>
      </div>
    );
  }

  const screen = {
    home: <Dashboard feed={feed} setFeed={setFeed} setShowAdd={setShowAdd} setDetailTx={setDetailTx} />,
    goals: <Goals goals={goals} setGoals={setGoals} onUpdateGoal={handleUpdateGoals} />,
    stats: <Stats feed={feed} />,
    settings: <Settings />,
  }[tab];

  return (
    <div style={{ width: '100%', height: '100%', background: T.bg, display: 'flex', flexDirection: 'column', color: T.text, position: 'relative', overflow: 'hidden' }}>
      {screen}
      <BottomNav tab={tab} setTab={setTab} onPlus={() => setShowAdd(true)} />
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAddExpense} />}
      {detailTx && <DetailModal tx={detailTx} onClose={() => setDetailTx(null)} />}
    </div>
  );
};

export default App;
