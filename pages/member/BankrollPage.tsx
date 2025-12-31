
import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useLanguage } from '../../hooks/useLanguage';
import type { Bet } from '../../types';

const StatCard: React.FC<{ title: string; value: string; subValue?: string; color?: string; icon?: string; trend?: string }> = ({ title, value, subValue, color = 'text-white', icon, trend }) => (
  <Card className="relative flex flex-col justify-between p-8 border-gray-800/60 bg-gradient-to-br from-[#1C1C2B] to-[#151522] shadow-2xl overflow-hidden group rounded-[2rem]">
    <div className="absolute -top-6 -right-6 text-8xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none transform rotate-12">{icon}</div>
    <div className="flex justify-between items-start mb-6">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{title}</h3>
        {trend && <span className={`text-[10px] font-black px-2 py-0.5 rounded ${trend.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{trend}</span>}
    </div>
    <div>
        <p className={`text-4xl md:text-5xl font-black ${color} tracking-tighter`}>{value}</p>
        {subValue && <p className="text-xs font-bold text-gray-500 mt-2 tracking-wide uppercase">{subValue}</p>}
    </div>
  </Card>
);

const BankrollPage: React.FC = () => {
  const { t } = useLanguage();
  const [initialCapital, setInitialCapital] = useState<number | null>(null);
  const [currentBankroll, setCurrentBankroll] = useState<number | null>(null);
  const [totalDeposits, setTotalDeposits] = useState<number>(0);
  const [bets, setBets] = useState<Bet[]>([]);
  
  const [description, setDescription] = useState('');
  const [stake, setStake] = useState('');
  const [odds, setOdds] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [showDepositForm, setShowDepositForm] = useState(false);

  useEffect(() => {
    const storedCapital = localStorage.getItem('nextwin_initialCapital');
    const storedBankroll = localStorage.getItem('nextwin_currentBankroll');
    const storedDeposits = localStorage.getItem('nextwin_totalDeposits');
    const storedBets = localStorage.getItem('nextwin_bets');
    if (storedCapital) {
      const capital = parseFloat(storedCapital);
      setInitialCapital(capital);
      setCurrentBankroll(storedBankroll ? parseFloat(storedBankroll) : capital);
      setTotalDeposits(storedDeposits ? parseFloat(storedDeposits) : 0);
    }
    if (storedBets) {
      setBets(JSON.parse(storedBets));
    }
  }, []);

  useEffect(() => {
    if (initialCapital !== null) localStorage.setItem('nextwin_initialCapital', initialCapital.toString());
    if (currentBankroll !== null) localStorage.setItem('nextwin_currentBankroll', currentBankroll.toString());
    localStorage.setItem('nextwin_totalDeposits', totalDeposits.toString());
    localStorage.setItem('nextwin_bets', JSON.stringify(bets));
  }, [initialCapital, currentBankroll, totalDeposits, bets]);

  // Suggested stake calculation (5% of current bankroll)
  const suggestedStake = useMemo(() => {
    if (currentBankroll === null) return 0;
    return Math.floor(currentBankroll * 0.05 * 100) / 100;
  }, [currentBankroll]);

  // Pre-fill stake when current bankroll changes
  useEffect(() => {
      if (suggestedStake > 0 && !stake) {
          setStake(suggestedStake.toString());
      }
  }, [suggestedStake]);

  const handleSetInitialCapital = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const capitalInput = (e.currentTarget.elements.namedItem('capital') as HTMLInputElement).value;
    const capital = parseFloat(capitalInput);
    if (!isNaN(capital) && capital > 0) {
      setInitialCapital(capital);
      setCurrentBankroll(capital);
      setTotalDeposits(0);
    }
  };

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && amount > 0 && currentBankroll !== null) {
      setCurrentBankroll(currentBankroll + amount);
      setTotalDeposits(prev => prev + amount);
      setDepositAmount('');
      setShowDepositForm(false);
    }
  };

  const handleAddBet = (e: React.FormEvent) => {
    e.preventDefault();
    const stakeNum = parseFloat(stake);
    const oddsNum = parseFloat(odds);

    if (description && !isNaN(stakeNum) && stakeNum > 0 && !isNaN(oddsNum) && oddsNum > 1) {
      const newBet: Bet = {
        id: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        description,
        stake: stakeNum,
        odds: oddsNum,
        result: 'pending',
        profitOrLoss: 0,
      };
      setBets(prev => [newBet, ...prev]);
      setDescription('');
      // Keep stake as suggested for next bet
      setOdds('');
    }
  };

  const handleUpdateBetResult = (betId: string, result: 'win' | 'loss') => {
    const bet = bets.find(b => b.id === betId);
    if (!bet || bet.result !== 'pending' || currentBankroll === null) return;

    let profitOrLoss = result === 'win' ? (bet.stake * bet.odds - bet.stake) : -bet.stake;
    const updatedBankroll = currentBankroll + profitOrLoss;
    setCurrentBankroll(updatedBankroll);
    setBets(bets.map(b => b.id === betId ? { ...b, result, profitOrLoss } : b));
  };
  
  const handleDeleteBet = (betId: string) => {
      const bet = bets.find(b => b.id === betId);
      if (!bet || currentBankroll === null) return;
      if (bet.result !== 'pending') setCurrentBankroll(currentBankroll - bet.profitOrLoss);
      setBets(bets.filter(b => b.id !== betId));
  }

  const stats = useMemo(() => {
    if (initialCapital === null || currentBankroll === null) return { profit: 0, roi: 0, yield: 0, winrate: 0, avgOdds: 0 };
    
    // Performance is calculated based on total investment (initial + deposits)
    const totalInvestment = initialCapital + totalDeposits;
    const profit = currentBankroll - totalInvestment;
    
    const finishedBets = bets.filter(b => b.result !== 'pending');
    const totalStaked = finishedBets.reduce((sum, b) => sum + b.stake, 0);
    const wonBets = finishedBets.filter(b => b.result === 'win');
    
    return {
      profit,
      roi: totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0,
      yield: totalStaked > 0 ? (profit / totalStaked) * 100 : 0,
      winrate: finishedBets.length > 0 ? (wonBets.length / finishedBets.length) * 100 : 0,
      avgOdds: bets.length > 0 ? bets.reduce((sum, b) => sum + b.odds, 0) / bets.length : 0
    };
  }, [initialCapital, currentBankroll, totalDeposits, bets]);

  if (initialCapital === null) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <Card className="bg-[#1C1C2B] border-orange-500/20 p-12 rounded-[3rem] shadow-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-pink-500"></div>
          <div className="w-24 h-24 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner shadow-orange-500/5">💼</div>
          <h1 className="text-3xl font-black text-white mb-4 tracking-tight">{t('bankroll_setup_title')}</h1>
          <p className="text-gray-400 mb-12 text-sm leading-relaxed font-medium">{t('bankroll_setup_subtitle')}</p>
          <form onSubmit={handleSetInitialCapital} className="space-y-8 text-left">
            <Input id="capital" name="capital" label={t('bankroll_initial_capital')} type="number" step="0.01" placeholder="Ex: 500" required />
            <Button type="submit" className="w-full py-6 text-xl font-black rounded-2xl shadow-2xl shadow-orange-500/30">
              {t('bankroll_start_tracking')}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 pb-20">
      <div className="text-center relative">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
            {t('bankroll_title')}
        </h1>
        <div className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gray-800"></span>
            <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px]">{t('bankroll_risk_title')}</p>
            <span className="h-px w-12 bg-gray-800"></span>
        </div>
        
        {/* Risk Protocol Badge */}
        <div className="mt-6 flex justify-center">
            <div className="bg-orange-500/10 border border-orange-500/30 px-6 py-2 rounded-full flex items-center gap-3">
                <span className="w-3 h-3 bg-orange-500 rounded-full animate-ping"></span>
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Risk Management: 5% Active</span>
            </div>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title={t('bankroll_current_bankroll')} 
            value={`${currentBankroll?.toFixed(2)}€`} 
            subValue={`${(initialCapital + totalDeposits).toFixed(0)}€ investis total`}
            icon="🏦"
            trend={stats.roi >= 0 ? `+${stats.roi.toFixed(1)}% ROI` : `${stats.roi.toFixed(1)}% ROI`}
        />
        <StatCard 
            title={t('bankroll_profit_loss')} 
            value={`${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}€`} 
            color={stats.profit >= 0 ? 'text-green-400' : 'text-red-400'}
            icon="📈"
            subValue={t('bankroll_performance_bets')}
        />
        <StatCard 
            title={t('bankroll_yield')} 
            value={`${stats.yield >= 0 ? '+' : ''}${stats.yield.toFixed(1)}%`} 
            subValue="Rentabilité brute"
            color={stats.yield >= 0 ? 'text-green-400' : 'text-red-400'}
            icon="⚡"
        />
         <StatCard 
            title={t('bankroll_winrate')} 
            value={`${stats.winrate.toFixed(0)}%`} 
            subValue={`${bets.filter(b => b.result !== 'pending').length} paris validés`}
            color="text-orange-400"
            icon="🎯"
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-4 space-y-6">
            <Card className="bg-[#1C1C2B] border-gray-800/60 rounded-[2.5rem] p-8 shadow-3xl">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-xs shadow-xl shadow-orange-500/40">✚</span> 
                        {t('bankroll_add_bet')}
                    </h2>
                </div>
                
                {/* Risk Protocol Info */}
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 mb-8">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">{t('bankroll_suggested_stake')}</p>
                    <p className="text-2xl font-black text-white">{suggestedStake}€</p>
                    <div className="w-full bg-orange-500/10 h-1 rounded-full mt-2">
                        <div className="bg-orange-500 h-1 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                </div>

                <form onSubmit={handleAddBet} className="space-y-6">
                    <Input id="description" label={t('bankroll_bet_description')} placeholder="Ex: Match Ligue 1" value={description} onChange={e => setDescription(e.target.value)} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input id="stake" label={t('bankroll_stake')} type="number" step="0.01" value={stake} onChange={e => setStake(e.target.value)} required />
                        <Input id="odds" label={t('bankroll_odds')} type="number" step="0.01" value={odds} onChange={e => setOdds(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full py-4 font-black text-sm rounded-xl shadow-2xl shadow-orange-500/20 uppercase tracking-widest">
                        {t('bankroll_add_button')}
                    </Button>
                </form>
            </Card>

            {/* Add Funds Feature */}
            <Card className="bg-[#1C1C2B] border-gray-800/60 rounded-[2.5rem] p-8">
                <button 
                    onClick={() => setShowDepositForm(!showDepositForm)}
                    className="w-full flex items-center justify-between group"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xl">💳</span>
                        <span className="font-black text-white uppercase text-xs tracking-widest">{t('bankroll_add_funds')}</span>
                    </div>
                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${showDepositForm ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </button>
                
                {showDepositForm && (
                    <form onSubmit={handleAddFunds} className="mt-6 pt-6 border-t border-gray-800 space-y-4">
                        <Input 
                            id="deposit" 
                            label={t('bankroll_deposit_amount')} 
                            type="number" 
                            value={depositAmount} 
                            onChange={e => setDepositAmount(e.target.value)} 
                            placeholder="Ex: 200"
                            required 
                        />
                        <Button type="submit" variant="secondary" className="w-full py-3 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10">
                            {t('bankroll_add_funds')}
                        </Button>
                    </form>
                )}
            </Card>
        </div>

        {/* History Column */}
        <div className="lg:col-span-8">
            <Card className="bg-[#1C1C2B] border-gray-800/60 rounded-[2.5rem] p-8 shadow-3xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        {t('bankroll_history')}
                    </h2>
                    <span className="px-3 py-1 bg-gray-900/80 rounded-full text-[9px] uppercase tracking-widest text-gray-500 font-black border border-gray-800">
                        {bets.length} Événements
                    </span>
                </div>

                <div className="space-y-4">
                    {bets.length > 0 ? bets.map(bet => (
                        <div key={bet.id} className="bg-gray-900/30 p-5 rounded-2xl border border-gray-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-orange-500/40 transition-all">
                            <div className="flex gap-4 items-center">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${bet.result === 'win' ? 'bg-green-500/10 text-green-400' : bet.result === 'loss' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                    {bet.result === 'win' ? '✓' : bet.result === 'loss' ? '✕' : '⏳'}
                                </div>
                                <div>
                                    <p className="font-black text-white text-lg group-hover:text-orange-400 transition-colors tracking-tight leading-tight">{bet.description}</p>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{bet.date}</span>
                                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                        <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{bet.stake}€ à @{bet.odds.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end gap-8 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-800/50">
                                {bet.result === 'pending' ? (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleUpdateBetResult(bet.id, 'win')} 
                                            className="bg-green-600/10 text-green-500 border border-green-500/20 hover:bg-green-600 hover:text-white w-10 h-10 rounded-xl text-[10px] font-black transition-all flex items-center justify-center"
                                        >V</button>
                                        <button 
                                            onClick={() => handleUpdateBetResult(bet.id, 'loss')} 
                                            className="bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white w-10 h-10 rounded-xl text-[10px] font-black transition-all flex items-center justify-center"
                                        >D</button>
                                    </div>
                                ) : (
                                    <div className="text-right">
                                        <p className={`font-black text-xl tracking-tighter ${bet.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                                            {bet.profitOrLoss > 0 ? '+' : ''}{bet.profitOrLoss.toFixed(2)}€
                                        </p>
                                        <p className={`text-[9px] uppercase font-black tracking-widest mt-0.5 ${bet.result === 'win' ? 'text-green-500/40' : 'text-red-500/40'}`}>
                                            {bet.result === 'win' ? t('bankroll_bet_won') : t('bankroll_bet_lost')}
                                        </p>
                                    </div>
                                )}
                                <button onClick={() => handleDeleteBet(bet.id)} className="text-gray-800 hover:text-red-500 transition-colors p-2 rounded-lg">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-700">
                            <div className="text-6xl mb-6 grayscale opacity-20">📊</div>
                            <p className="text-sm font-black uppercase tracking-widest text-gray-600">{t('bankroll_no_bets')}</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default BankrollPage;
