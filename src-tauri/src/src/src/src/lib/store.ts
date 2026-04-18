import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'
type Message = { role: 'user' | 'assistant', text: string }
type Store = {
  messages: Message[]
  indexing: boolean
  addPdf: (path: string) => Promise<void>
  ask: (q: string) => Promise<void>
}
export const useStore = create<Store>((set) => ({
  messages: [],
  indexing: false,
  addPdf: async (path: string) => {
    set({ indexing: true })
    await invoke('index_pdf', { path })
    set({ indexing: false })
  },
  ask: async (q: string) => {
    set(s => ({ messages: [...s.messages, { role: 'user', text: q }] }))
    const ans = await invoke<{text: string}>('ask', { question: q })
    set(s => ({ messages: [...s.messages, { role: 'assistant', text: ans.text }] }))
  }
}))
