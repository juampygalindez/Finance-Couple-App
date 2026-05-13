import React, { useState, useEffect } from 'react';
import { T } from './data/constants';
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
  getUsers,
  getCategories,
  getSettings,
  getBudget,
  updateTransaction,
  deleteTransaction,
  setSetting,
  setBudget,
} from './utils/database';

// Seed data for initial database population
const SEED_GOALS = [
  { id:1, name:'Viaje a Bariloche', emoji:'🏔️', target:800000, current:320000, color:'#818cf8' },
  { id:2, name:'Smart TV nueva', emoji:'📺', target:250000, current:190000, color:'#f472b6' },
  { id:3, name:'Fondo emergencias', emoji:'🛡️', target:500000, current:85000, color:'#fbbf24' },
];

const SEED_USERS = [
  { key: 'juan', name: 'Juan', initial: 'J', color: '#818cf8' },
  { key: 'mile', name: 'Mile', initial: 'M', color: '#f472b6' },
];

const SEED_CATEGORIES = [
  { name: 'Supermercado', emoji: '🛒', shared_default: true },
  { name: 'Delivery', emoji: '🍕', shared_default: true },
  { name: 'Nafta', emoji: '⛽', shared_default: true },
  { name: 'Alquiler', emoji: '🏠', shared_default: true },
  { name: 'Salud', emoji: '💊', shared_default: false },
  { name: 'Café', emoji: '☕', shared_default: false },
  { name: 'Ropa', emoji: '👕', shared_default: false },
  { name: 'Entretenimiento', emoji: '🎬', shared_default: true },
  { name: 'Transporte', emoji: '🚇', shared_default: true },
  { name: 'Otro', emoji: '📦', shared_default: false },
];

const SEED_SETTINGS = [
  { key: 'divisionModel', value: '70-30' },
  { key: 'jPct', value: '70' },
  { key: 'catMap', value: JSON.stringify({
    'Supermercado': true, 'Delivery': true, 'Nafta': true, 'Alquiler': true,
    'Salud': false, 'Café': false, 'Ropa': false, 'Entretenimiento': true,
    'Transporte': true, 'Otro': false,
  })},
];

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const SEED_BUDGETS = [
  { month: getCurrentMonth(), amount: 500000 },
];

const App = () => {
  const [tab, setTab] = useState('home');
  const [feed, setFeed] = useState([]);
  const [goals, setGoals] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [budget, setBudgetState] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [detailTx, setDetailTx] = useState(null);
  const [loading, setLoading] = useState(true);

  const notificationCount = feed.length; // Computed from feed

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        await initDatabase();
        await seedData(SEED_USERS, SEED_CATEGORIES, SEED_GOALS, SEED_SETTINGS, SEED_BUDGETS);

        const currentMonth = getCurrentMonth();
        const [txs, gols, usrs, cats, settgs, bdgt] = await Promise.all([
          getTransactions(),
          getGoals(),
          getUsers(),
          getCategories(),
          getSettings(),
          getBudget(currentMonth),
        ]);

        if (mounted) {
          setFeed(txs);
          setGoals(gols);
          setUsers(usrs);
          setCategories(cats);
          setSettings(settgs);
          setBudgetState(bdgt?.amount ?? null);
        }
      } catch (err) {
        console.error('Database init error:', err);
        // Fallback a mocks si SQLite falla (ej. en navegador sin Capacitor)
        if (mounted) {
          setFeed([]);
          setGoals(SEED_GOALS);
          setUsers(SEED_USERS);
          setCategories(SEED_CATEGORIES);
          setSettings({
            divisionModel: '70-30',
            jPct: '70',
            catMap: JSON.stringify({
              'Supermercado': true, 'Delivery': true, 'Nafta': true, 'Alquiler': true,
              'Salud': false, 'Café': false, 'Ropa': false, 'Entretenimiento': true,
              'Transporte': true, 'Otro': false,
            }),
          });
          setBudgetState(SEED_BUDGETS[0].amount);
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

  const handleUpdateTransaction = async (id, tx) => {
    try {
      await updateTransaction(id, tx);
      const txs = await getTransactions();
      setFeed(txs);
    } catch (err) {
      console.error('Update transaction error:', err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      const txs = await getTransactions();
      setFeed(txs);
    } catch (err) {
      console.error('Delete transaction error:', err);
    }
  };

  const handleSettingChange = async (key, value) => {
    try {
      await setSetting(key, value);
      const settgs = await getSettings();
      setSettings(settgs);
    } catch (err) {
      console.error('Setting change error:', err);
    }
  };

  const handleBudgetChange = async (month, amount) => {
    try {
      await setBudget(month, amount);
      const bdgt = await getBudget(month);
      setBudgetState(bdgt?.amount ?? null);
    } catch (err) {
      console.error('Budget change error:', err);
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
    home: <Dashboard feed={feed} setFeed={setFeed} setShowAdd={setShowAdd} setDetailTx={setDetailTx} users={users} budget={budget} onBudgetChange={handleBudgetChange} />,
    goals: <Goals goals={goals} setGoals={setGoals} onUpdateGoal={handleUpdateGoals} />,
    stats: <Stats feed={feed} users={users} categories={categories} />,
    settings: <Settings users={users} categories={categories} settings={settings} onSettingChange={handleSettingChange} onBudgetChange={handleBudgetChange} />,
  }[tab];

  return (
    <div style={{ width: '100%', height: '100%', background: T.bg, display: 'flex', flexDirection: 'column', color: T.text, position: 'relative', overflow: 'hidden' }}>
      {screen}
      <BottomNav tab={tab} setTab={setTab} onPlus={() => setShowAdd(true)} />
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAddExpense} users={users} categories={categories} />}
      {detailTx && <DetailModal tx={detailTx} onClose={() => setDetailTx(null)} users={users} onUpdateTransaction={handleUpdateTransaction} onDeleteTransaction={handleDeleteTransaction} />}
    </div>
  );
};

export default App;
