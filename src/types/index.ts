export interface Deity {
  id: string;
  name: string;
  isActive: boolean;
  orderIndex: number;
  dailyCount: number;
}

export interface CountRecord {
  date: string; // YYYY-MM-DD
  deityId: string;
  count: number;
}
