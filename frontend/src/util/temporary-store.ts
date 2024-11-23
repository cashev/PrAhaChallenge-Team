interface StoredData {
  seasonNumber: number
  students: {
    firstName: string
    lastName: string
    email: string
    teamName: string
  }[]
}

class TemporaryStore {
  private static instance: TemporaryStore
  private store: Map<string, StoredData>

  private constructor() {
    this.store = new Map()
  }

  static getInstance(): TemporaryStore {
    if (!TemporaryStore.instance) {
      TemporaryStore.instance = new TemporaryStore()
    }
    return TemporaryStore.instance
  }

  setData(data: StoredData) {
    const id = crypto.randomUUID()
    this.store.set(id, data)
    return id
  }

  getData(id: string): StoredData | null {
    const data = this.store.get(id)
    this.store.delete(id) // 一度取得したら削除
    return data || null
  }
}

export const temporaryStore = TemporaryStore.getInstance()
