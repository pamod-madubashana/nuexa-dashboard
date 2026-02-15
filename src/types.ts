export type NavItemId = 'dashboard' | 'revenue' | 'history' | 'profits' | 'transactions'

export type NavItem = {
  id: NavItemId
  label: string
}

export type TxStatus = 'Success' | 'Failed' | 'Processing'

export type Transaction = {
  id: string
  sender: {
    name: string
    handle: string
  }
  recipient: {
    name: string
    handle: string
  }
  amount: number
  cardRef: string
  status: TxStatus
}
