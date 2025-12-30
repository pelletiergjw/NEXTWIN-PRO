
import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useLanguage } from '../../hooks/useLanguage';
import type { Bet } from '../../types';

const StatCard: React.FC<{ title: string; value: string; color?: string }> = ({ title, value, color = 'text-white' }) => (
  <Card className="text-center">
    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
  </Card>
);

const KellyCalculator: React.FC<{ bankroll: number, onStakeCalculated: (stake: number) => void }> = ({ bankroll, onStakeCalculated }) => {
    const { t } = useLanguage();
    const [kellyOdds, setKellyOdds] = useState('');
    const [kellyProb, setKellyProb] = useState('');

    const calculatedStake = useMemo(() => {
        const odds = parseFloat(kellyOdds);
        const prob = parseFloat(kellyProb);

        if (isNaN(odds) || odds <= 1 || isNaN(prob) || prob <= 0 || prob > 100) {
            return null;
        }

        const p = prob / 100;
        const b = odds - 1;
        const q = 1 - p;

        const kellyFraction = (b * p - q) / b;

        if (kellyFraction <= 0) {
            return { percentage: 0, amount: 0 };
        }

        return {
            percentage: kellyFraction * 100,
            amount: kellyFraction * bankroll
        };
    }, [kellyOdds, kellyProb, bankroll]);

    return (
        <Card>
            <h2 className="text-2xl font-bold text-white mb-2">{t('bankroll_kelly_title')}</h2>
            <p className="text-sm text-gray-400 mb-4">{t('bankroll_kelly_subtitle')}</p>
            <div className="space-y-4">
                <Input id="kelly_odds" label={t('bankroll_kelly_odds')} type="number" step="0.01" value={kellyOdds} onChange={e => setKellyOdds(e.target.value)} placeholder="ex: 1.85" />
                <Input id="kelly_prob" label={t('bankroll_kelly_probability')} type="number" step="0.1" value={kellyProb} onChange={e => setKellyProb(e.target.value)} placeholder={t('analysis_probability')} />
                {calculatedStake !== null && (
                    <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                        <p className="text-xs text-gray-400 uppercase font-bold">{t('bankroll_kelly_recommended_stake')}</p>
                        <p className="text-2xl font-black text-orange-400">{calculatedStake.amount.toFixed(2)} €</p>
                        <p className="text-sm font-bold text-gray-300">({calculatedStake.percentage.toFixed(2)}% de la bankroll)</p>
                        <Button 
                            variant="secondary" 
                            className="w-full mt-3 text-xs" 
                            onClick={() => onStakeCalculated(calculatedStake.amount)}
                            disabled={calculatedStake.amount <= 0}
                        >
                            {t('bankroll_kelly_fill_stake_button')}
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};


const BankrollPage: React.FC = () => {
  const { t } = useLanguage();
  const [initialCapital, setInitialCapital] = useState<number | null>(null);
  const [currentBankroll, setCurrentBankroll] = useState<number | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  
  // Form state
  const [description, setDescription] = useState('');
  const [stake, setStake] = useState('');
  const [odds, setOdds] = useState('');

  useEffect(() => {
    const storedCapital = localStorage.getItem('nextwin_initialCapital');
    const storedBankroll = localStorage.getItem('nextwin_currentBankroll');
    const storedBets = localStorage.getItem('nextwin_bets');
    if (storedCapital) {
      const capital = parseFloat(storedCapital);
      setInitialCapital(capital);
      setCurrentBankroll(storedBankroll ? parseFloat(storedBankroll) : capital);
    }
    if (storedBets) {
      setBets(JSON.parse(storedBets));
    }
  }, []);

  useEffect(() => {
    if (initialCapital !== null) {
      localStorage.setItem('nextwin_initialCapital', initialCapital.toString());
    }
    if (currentBankroll !== null) {
      localStorage.setItem('nextwin_currentBankroll', currentBankroll.toString());
    }
    localStorage.setItem('nextwin_bets', JSON.stringify(bets));
  }, [initialCapital, currentBankroll, bets]);

  // Fix: Explicitly type event target as HTMLFormElement to access form elements.
  const handleSetInitialCapital = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const capitalInput = (e.currentTarget.elements.namedItem('capital') as HTMLInputElement).value;
    const capital = parseFloat(capitalInput);
    if (!isNaN(capital) && capital > 0) {
      setInitialCapital(capital);
      setCurrentBankroll(capital);
    }
  };

  const handleAddBet = (e: React.FormEvent) => {
    e.preventDefault();
    const stakeNum = parseFloat(stake);
    const oddsNum = parseFloat(odds);

    if (description && !isNaN(stakeNum) && stakeNum > 0 && !isNaN(oddsNum) && oddsNum > 1) {
      const newBet: Bet = {
        id: new Date().toISOString(),
        date: new Date().toLocaleDateString(t('nav_home') === 'Accueil' ? 'fr-FR' : 'en-US'),
        description,
        stake: stakeNum,
        odds: oddsNum,
        result: 'pending',
        profitOrLoss: 0,
      };
      setBets(prev => [newBet, ...prev]);
      setDescription('');
      setStake('');
      setOdds('');
    }
  };

  const handleUpdateBetResult = (betId: string, result: 'win' | 'loss') => {
    const bet = bets.find(b => b.id === betId);
    if (!bet || bet.result !== 'pending' || currentBankroll === null) return;

    let profitOrLoss = 0;
    if (result === 'win') {
      profitOrLoss = bet.stake * bet.odds - bet.stake;
    } else {
      profitOrLoss = -bet.stake;
    }

    const updatedBankroll = currentBankroll + profitOrLoss;
    setCurrentBankroll(updatedBankroll);

    setBets(bets.map(b => b.id === betId ? { ...b, result, profitOrLoss } : b));
  };
  
  const handleDeleteBet = (betId: string) => {
      const betToDelete = bets.find(b => b.id === betId);
      if (!betToDelete || currentBankroll === null) return;
      
      // If the bet was already resolved, adjust the bankroll
      if (betToDelete.result !== 'pending') {
          setCurrentBankroll(currentBankroll - betToDelete.profitOrLoss);
      }
      
      setBets(bets.filter(b => b.id !== betId));
  }

  const { profit, roi } = useMemo(() => {
    if (initialCapital === null || currentBankroll === null) {
      return { profit: 0, roi: 0 };
    }
    const calculatedProfit = currentBankroll - initialCapital;
    const totalStaked = bets.filter(b => b.result !== 'pending').reduce((sum, b) => sum + b.stake, 0);
    const calculatedRoi = totalStaked > 0 ? (calculatedProfit / totalStaked) * 100 : 0;
    return { profit: calculatedProfit, roi: calculatedRoi };
  }, [initialCapital, currentBankroll, bets]);

  if (initialCapital === null) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          <h1 className="text-3xl font-bold text-white mb-4">{t('bankroll_setup_title')}</h1>
          <p className="text-gray-400 mb-6">{t('bankroll_setup_subtitle')}</p>
          <form onSubmit={handleSetInitialCapital} className="flex flex-col gap-4">
            <Input id="capital" name="capital" label={t('bankroll_initial_capital')} type="number" step="0.01" required />
            <Button type="submit">{t('bankroll_start_tracking')}</Button>
          </form>
        </Card>
      </div>
    );
  }

  const profitColor = profit >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-white">{t('bankroll_title')}</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title={t('bankroll_initial_capital')} value={`${initialCapital.toFixed(2)} €`} />
        <StatCard title={t('bankroll_current_bankroll')} value={`${currentBankroll?.toFixed(2)} €`} color={profitColor} />
        <StatCard title={t('bankroll_profit_loss')} value={`${profit.toFixed(2)} €`} color={profitColor} />
        <StatCard title={t('bankroll_roi')} value={`${roi.toFixed(2)} %`} color={profitColor} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <Card>
            <h2 className="text-2xl font-bold text-white mb-4">{t('bankroll_add_bet')}</h2>
            <form onSubmit={handleAddBet} className="space-y-4">
              <Input id="description" label={t('bankroll_bet_description')} value={description} onChange={e => setDescription(e.target.value)} required />
              <Input id="stake" label={t('bankroll_stake')} type="number" step="0.01" value={stake} onChange={e => setStake(e.target.value)} required />
              <Input id="odds" label={t('bankroll_odds')} type="number" step="0.01" value={odds} onChange={e => setOdds(e.target.value)} required />
              <Button type="submit" className="w-full">{t('bankroll_add_button')}</Button>
            </form>
          </Card>
          {currentBankroll !== null && (
            <KellyCalculator 
                bankroll={currentBankroll} 
                onStakeCalculated={(calculatedStake) => setStake(calculatedStake.toFixed(2))} 
            />
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-2xl font-bold text-white mb-4">{t('bankroll_history')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-3">{t('bankroll_bet_date')}</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-right">{t('bankroll_bet_stake')}</th>
                    <th className="px-4 py-3 text-right">{t('bankroll_bet_odds')}</th>
                    <th className="px-4 py-3 text-center">{t('bankroll_bet_result')}</th>
                    <th className="px-4 py-3 text-right">{t('bankroll_bet_profit')}</th>
                    <th className="px-4 py-3 text-center">{t('bankroll_bet_actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {bets.length > 0 ? bets.map(bet => (
                    <tr key={bet.id} className="border-b border-gray-800 hover:bg-gray-800/40">
                      <td className="px-4 py-3">{bet.date}</td>
                      <td className="px-4 py-3 font-medium text-white">{bet.description}</td>
                      <td className="px-4 py-3 text-right">{bet.stake.toFixed(2)}€</td>
                      <td className="px-4 py-3 text-right">@{bet.odds.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          bet.result === 'win' ? 'bg-green-500/20 text-green-400' : 
                          bet.result === 'loss' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700/50 text-gray-400'
                        }`}>
                          {bet.result === 'win' ? t('bankroll_bet_won') : bet.result === 'loss' ? t('bankroll_bet_lost') : t('bankroll_bet_pending')}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${bet.profitOrLoss > 0 ? 'text-green-400' : bet.profitOrLoss < 0 ? 'text-red-400' : ''}`}>
                        {bet.profitOrLoss.toFixed(2)}€
                      </td>
                      <td className="px-4 py-3">
                        {bet.result === 'pending' ? (
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => handleUpdateBetResult(bet.id, 'win')} className="text-xs bg-green-500 hover:bg-green-400 text-white font-bold py-1 px-2 rounded">✓</button>
                            <button onClick={() => handleUpdateBetResult(bet.id, 'loss')} className="text-xs bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-2 rounded">✗</button>
                          </div>
                        ) : <button onClick={() => handleDeleteBet(bet.id)} className="text-gray-500 hover:text-red-500 transition-colors mx-auto block">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg>
                         </button>}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">{t('bankroll_no_bets')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BankrollPage;
