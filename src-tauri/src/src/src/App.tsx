import { useState } from 'react'
import { open } from '@tauri-apps/plugin-dialog'
import { useStore } from './lib/store'
import LiveBackground from './components/LiveBackground'

function App() {
  const [input, setInput] = useState('')
  const { messages, ask, addPdf, indexing } = useStore()

  const pickPdf = async () => {
    const selected = await open({ filters: [{ name: 'PDF', extensions: ['pdf'] }] })
    if (typeof selected === 'string') addPdf(selected)
  }

  return (
    <div className="h-screen w-screen bg-gray-950 text-gray-100 flex">
      <LiveBackground />
      <div className="w-64 border-r border-gray-800 p-4 z-10">
        <h1 className="text-xl font-bold mb-4">CogniPDF</h1>
        <button onClick={pickPdf} disabled={indexing}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 px-4 py-2 rounded-lg">
          {indexing? 'Indexing...' : '+ Add PDF'}
        </button>
      </div>
      <div className="flex-1 flex flex-col z-10">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && <div className="text-gray-500 text-center mt-20">Upload a PDF and ask a question</div>}
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user'? 'text-right' : ''}>
              <div className={`inline-block px-4 py-2 rounded-xl max-w-2xl ${m.role === 'user'? 'bg-indigo-600' : 'bg-gray-800'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && ask(input) && setInput('')}
              className="flex-1 bg-gray-900 px-4 py-3 rounded-lg outline-none"
              placeholder="Ask anything about your PDFs..." />
            <button onClick={() => {ask(input); setInput('')}}
              className="bg-indigo-600 px-6 rounded-lg">Ask</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default App
