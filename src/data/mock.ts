import type { Transaction } from '../types'

export const kpis = {
  totalRevenue: { label: 'Total Revenue', value: 56420, deltaPct: 6.8 },
  netProfit: { label: 'Net Profit', value: 18960, deltaPct: 2.5 },
  totalTransactions: { label: 'Total Transactions', value: 342, deltaPct: -4.8 },
  activeAccounts: { label: 'Active Accounts', value: 563, deltaPct: -1.0 },
}

export const recentTransactions = [
  {
    date: '19 November 2025',
    items: [
      { name: 'Carla Johnson', handle: '0x242a...a4e4', amount: 325, deltaPct: 2.8 },
      { name: 'Amigos Palomo', handle: '0x827b...d4c4', amount: 325, deltaPct: 2.8 },
    ],
  },
  {
    date: '20 November 2025',
    items: [
      { name: 'Sebastian Tim', handle: '0x0f32...1a02', amount: 325, deltaPct: 2.8 },
      { name: 'Simara Tom', handle: '0x8841...9a21', amount: 325, deltaPct: 2.8 },
    ],
  },
] as const

export const topSpender = {
  name: 'Carla Johnson',
  handle: '0x242a...a4e4',
  amount: 325,
  deltaPct: 6.8,
}

export const netProfitSeries = [12, 18, 16, 20, 14, 15, 22, 19, 24] as const

export const donutBreakdown = [
  { label: 'Sales', value: 0.62 },
  { label: 'Fees', value: 0.23 },
  { label: 'Other', value: 0.15 },
] as const

export const dailyVolumes = [22, 14, 28, 33, 26, 18, 36, 29, 41] as const

export const historyTransactions: Transaction[] = [
  {
    id: 'tx_01',
    sender: { name: 'Everett Olson', handle: '0x28374967' },
    recipient: { name: 'Rosalie Jacobs', handle: '0x92837465' },
    amount: 450,
    cardRef: 'Card 43xxxce87',
    status: 'Processing',
  },
  {
    id: 'tx_02',
    sender: { name: 'Ricardo Nolan', handle: '0x85749302' },
    recipient: { name: 'Esmeralda Terry', handle: '0x27384956' },
    amount: 230,
    cardRef: 'Card 87xxxcu90',
    status: 'Failed',
  },
  {
    id: 'tx_03',
    sender: { name: 'Everett Olson', handle: '0x28374967' },
    recipient: { name: 'Naomi King', handle: '0x74658392' },
    amount: 150,
    cardRef: 'Card 98xxxco23',
    status: 'Success',
  },
  {
    id: 'tx_04',
    sender: { name: 'Ricardo Nolan', handle: '0x85749302' },
    recipient: { name: 'Rosalie Jacobs', handle: '0x92837465' },
    amount: 280,
    cardRef: 'Card 23xxxon56',
    status: 'Success',
  },
  {
    id: 'tx_05',
    sender: { name: 'Esmeralda Terry', handle: '0x27384956' },
    recipient: { name: 'Everett Olson', handle: '0x28374967' },
    amount: 310,
    cardRef: 'Card 54xxxon78',
    status: 'Success',
  },
  {
    id: 'tx_06',
    sender: { name: 'Naomi King', handle: '0x74658392' },
    recipient: { name: 'Ricardo Nolan', handle: '0x85749302' },
    amount: 190,
    cardRef: 'Card 76xxxce43',
    status: 'Success',
  },
  {
    id: 'tx_07',
    sender: { name: 'Rosalie Jacobs', handle: '0x92837465' },
    recipient: { name: 'Esmeralda Terry', handle: '0x27384956' },
    amount: 420,
    cardRef: 'Card 34xxxon67',
    status: 'Success',
  },
  {
    id: 'tx_08',
    sender: { name: 'Naomi King', handle: '0x74658392' },
    recipient: { name: 'Ricardo Nolan', handle: '0x85749302' },
    amount: 190,
    cardRef: 'Card 76xxxce43',
    status: 'Success',
  },
  {
    id: 'tx_09',
    sender: { name: 'Rosalie Jacobs', handle: '0x92837465' },
    recipient: { name: 'Esmeralda Terry', handle: '0x27384956' },
    amount: 420,
    cardRef: 'Card 34xxxon67',
    status: 'Success',
  },
] 
