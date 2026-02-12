'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/providers/GameProvider';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { ShopItem } from '@/types';
import { formatNumber } from '@/lib/utils';

const SHOP_ITEMS: ShopItem[] = [
  // Avatars
  { id: 'avatar-robot', name: 'Robot', description: 'A cool robot friend', type: 'avatar', cost: 100, icon: '🤖' },
  { id: 'avatar-alien', name: 'Alien', description: 'From outer space', type: 'avatar', cost: 150, icon: '👽' },
  { id: 'avatar-wizard', name: 'Wizard', description: 'Master of magic', type: 'avatar', cost: 200, icon: '🧙' },
  { id: 'avatar-ninja', name: 'Ninja', description: 'Silent and swift', type: 'avatar', cost: 200, icon: '🥷' },
  { id: 'avatar-astronaut', name: 'Astronaut', description: 'Space explorer', type: 'avatar', cost: 300, icon: '👨‍🚀' },
  { id: 'avatar-superhero', name: 'Superhero', description: 'Saves the day!', type: 'avatar', cost: 500, icon: '🦸' },
  // Themes
  { id: 'theme-ocean', name: 'Ocean Theme', description: 'Deep sea adventure', type: 'theme', cost: 200, icon: '🌊' },
  { id: 'theme-space', name: 'Space Theme', description: 'Explore the galaxy', type: 'theme', cost: 200, icon: '🚀' },
  { id: 'theme-forest', name: 'Forest Theme', description: 'Enchanted woods', type: 'theme', cost: 200, icon: '🌲' },
  { id: 'theme-candy', name: 'Candy Theme', description: 'Sweet world', type: 'theme', cost: 300, icon: '🍬' },
  // Power-ups
  { id: 'powerup-streak-freeze', name: 'Streak Freeze', description: 'Protect your streak for one day', type: 'powerup', cost: 50, icon: '🧊' },
  { id: 'powerup-double-xp', name: 'Double XP', description: 'Double XP for the next level', type: 'powerup', cost: 75, icon: '⚡' },
  { id: 'powerup-extra-hearts', name: 'Extra Hearts', description: 'Start with 8 hearts', type: 'powerup', cost: 40, icon: '💝' },
  { id: 'powerup-hint', name: 'Free Hint', description: 'Get a free hint on any question', type: 'powerup', cost: 30, icon: '💡' },
];

type Tab = 'avatars' | 'themes' | 'powerups';

export default function ShopPage() {
  const t = useTranslations('shop');
  const { state, spendCoins, addShopPurchase } = useGame();
  const [activeTab, setActiveTab] = useState<Tab>('avatars');
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'avatars', label: t('avatars'), icon: '🦸' },
    { key: 'themes', label: t('themes'), icon: '🎨' },
    { key: 'powerups', label: t('powerups'), icon: '⚡' },
  ];

  const filteredItems = SHOP_ITEMS.filter(item => {
    if (activeTab === 'avatars') return item.type === 'avatar';
    if (activeTab === 'themes') return item.type === 'theme';
    return item.type === 'powerup';
  });

  const handlePurchase = (item: ShopItem) => {
    if (state.shopPurchases.includes(item.id) && item.type !== 'powerup') return;
    if (spendCoins(item.cost)) {
      addShopPurchase(item.id);
      setPurchaseMessage(t('purchased'));
      setTimeout(() => setPurchaseMessage(null), 2000);
    } else {
      setPurchaseMessage(t('notEnoughCoins'));
      setTimeout(() => setPurchaseMessage(null), 2000);
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-16">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-black">{t('title')}</h1>
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
            <span className="text-xl">💰</span>
            <span className="font-bold text-yellow-400">{formatNumber(state.coins)}</span>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-purple-500/50 text-white'
                  : 'glass text-white/50 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Purchase notification */}
        <AnimatePresence>
          {purchaseMessage && (
            <motion.div
              className={`text-center py-2 px-4 rounded-xl mb-4 font-bold ${
                purchaseMessage === t('purchased') ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {purchaseMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item, i) => {
            const isOwned = state.shopPurchases.includes(item.id) && item.type !== 'powerup';
            const canAfford = state.coins >= item.cost;

            return (
              <motion.div
                key={item.id}
                className={`glass rounded-2xl p-4 text-center relative overflow-hidden ${isOwned ? 'opacity-60' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isOwned ? 0.6 : 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="text-5xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-sm">{item.name}</h3>
                <p className="text-[10px] text-white/40 mb-3">{item.description}</p>

                {isOwned ? (
                  <div className="px-4 py-2 bg-green-500/20 rounded-lg text-green-400 text-sm font-bold">
                    {t('owned')} ✓
                  </div>
                ) : (
                  <motion.button
                    onClick={() => handlePurchase(item)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all w-full ${
                      canAfford
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-lg'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                    whileHover={canAfford ? { scale: 1.05 } : {}}
                    whileTap={canAfford ? { scale: 0.95 } : {}}
                  >
                    💰 {item.cost}
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
