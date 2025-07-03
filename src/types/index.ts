export interface CleaningOption {
  id: string;
  name: string;
  enabled: boolean;
  size: number;
  description: string;
}

export interface SystemStats {
  totalSpace: number;
  freeSpace: number;
  usedSpace: number;
  tempSize: number;
  cacheSize: number;
  logsSize: number;
}

export interface CleaningResult {
  name: string;
  freedSpace: number;
  status: 'success' | 'warning' | 'error';
  details: string;
}