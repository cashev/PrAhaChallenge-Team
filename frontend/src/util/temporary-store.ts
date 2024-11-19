type Student = {
  firstName: string
  lastName: string
  teamName?: string
}

class TemporaryStore {
  private static instance: TemporaryStore
  private store: Map<string, Student[]>

  private constructor() {
    this.store = new Map()
  }

  static getInstance(): TemporaryStore {
    if (!TemporaryStore.instance) {
      TemporaryStore.instance = new TemporaryStore()
    }
    return TemporaryStore.instance
  }

  setStudents(students: Student[]) {
    const id = crypto.randomUUID()
    this.store.set(id, students)
    return id
  }

  getStudents(id: string): Student[] | null {
    const students = this.store.get(id)
    this.store.delete(id) // 一度取得したら削除
    return students || null
  }
}

export const temporaryStore = TemporaryStore.getInstance()
