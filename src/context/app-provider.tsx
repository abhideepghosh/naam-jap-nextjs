"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Deity, CountRecord } from '@/types';
import { format, isToday, parseISO } from 'date-fns';

interface AppContextType {
  isLoaded: boolean;
  userName: string | null;
  deities: Deity[];
  countHistory: CountRecord[];
  activeDeity: Deity | null;
  showFloatingCounter: boolean;
  setUserName: (name: string) => void;
  addDeity: (name: string) => void;
  updateDeity: (id: string, name: string) => void;
  deleteDeity: (id: string) => void;
  setActiveDeity: (id: string) => void;
  reorderDeities: (id: string, direction: 'up' | 'down') => void;
  incrementCount: (deityId: string) => void;
  resetTodaysCount: (deityId: string) => void;
  toggleFloatingCounter: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getTodayDateString = () => format(new Date(), 'yyyy-MM-dd');

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserNameState] = useState<string | null>(null);
  const [deities, setDeities] = useState<Deity[]>([]);
  const [countHistory, setCountHistory] = useState<CountRecord[]>([]);
  const [lastResetDate, setLastResetDate] = useState<string | null>(null);
  const [showFloatingCounter, setShowFloatingCounter] = useState(true);

  useEffect(() => {
    const storedName = localStorage.getItem('naam_japper_userName');
    const storedDeities = JSON.parse(localStorage.getItem('naam_japper_deities') || '[]');
    const storedHistory = JSON.parse(localStorage.getItem('naam_japper_countHistory') || '[]');
    const storedResetDate = localStorage.getItem('naam_japper_lastResetDate');
    const storedFloatingCounter = localStorage.getItem('naam_japper_floatingCounter');
    
    setUserNameState(storedName);
    setDeities(storedDeities);
    setCountHistory(storedHistory);
    setLastResetDate(storedResetDate);

    if (storedFloatingCounter !== null) {
      setShowFloatingCounter(JSON.parse(storedFloatingCounter));
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const today = getTodayDateString();
    if (lastResetDate !== today) {
      // Midnight reset logic
      const deitiesToSave = deities.filter(d => d.dailyCount > 0);
      const newHistoryRecords: CountRecord[] = deitiesToSave.map(deity => ({
        date: lastResetDate || today, // Use last reset date or today if it's the first time
        deityId: deity.id,
        count: deity.dailyCount,
      }));

      if(newHistoryRecords.length > 0) {
        setCountHistory(prev => [...prev, ...newHistoryRecords]);
      }

      setDeities(prevDeities => prevDeities.map(d => ({ ...d, dailyCount: 0 })));
      setLastResetDate(today);
      localStorage.setItem('naam_japper_lastResetDate', today);
    }
  }, [isLoaded, lastResetDate, deities]);


  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('naam_japper_userName', userName || '');
  }, [userName, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('naam_japper_deities', JSON.stringify(deities));
  }, [deities, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('naam_japper_countHistory', JSON.stringify(countHistory));
  }, [countHistory, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('naam_japper_floatingCounter', JSON.stringify(showFloatingCounter));
  }, [showFloatingCounter, isLoaded]);

  const setUserName = (name: string) => setUserNameState(name);

  const addDeity = (name: string) => {
    const newDeity: Deity = {
      id: uuidv4(),
      name,
      isActive: deities.length === 0,
      orderIndex: deities.length,
      dailyCount: 0,
    };
    setDeities(prev => [...prev, newDeity]);
  };

  const updateDeity = (id: string, name: string) => {
    setDeities(prev => prev.map(d => (d.id === id ? { ...d, name } : d)));
  };

  const deleteDeity = (id: string) => {
    setDeities(prev => prev.filter(d => d.id !== id));
  };
  
  const setActiveDeity = (id: string) => {
    setDeities(prev => prev.map(d => ({ ...d, isActive: d.id === id })));
  };

  const reorderDeities = (id: string, direction: 'up' | 'down') => {
    setDeities(prev => {
        const list = [...prev].sort((a,b) => a.orderIndex - b.orderIndex);
        const index = list.findIndex(d => d.id === id);
        if (direction === 'up' && index > 0) {
            [list[index-1], list[index]] = [list[index], list[index-1]];
        } else if (direction === 'down' && index < list.length - 1) {
            [list[index], list[index+1]] = [list[index+1], list[index]];
        }
        return list.map((d, i) => ({...d, orderIndex: i}));
    });
  };

  const incrementCount = (deityId: string) => {
    setDeities(prev =>
      prev.map(d => (d.id === deityId ? { ...d, dailyCount: d.dailyCount + 1 } : d))
    );
  };
  
  const resetTodaysCount = (deityId: string) => {
    setDeities(prev =>
      prev.map(d => (d.id === deityId ? { ...d, dailyCount: 0 } : d))
    );
  };

  const toggleFloatingCounter = () => {
    setShowFloatingCounter(prev => !prev);
  }

  const activeDeity = deities.find(d => d.isActive) || null;

  const value = {
    isLoaded,
    userName,
    deities: deities.sort((a,b) => a.orderIndex - b.orderIndex),
    countHistory,
    activeDeity,
    showFloatingCounter,
    setUserName,
    addDeity,
    updateDeity,
    deleteDeity,
    setActiveDeity,
    reorderDeities,
    incrementCount,
    resetTodaysCount,
    toggleFloatingCounter,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
