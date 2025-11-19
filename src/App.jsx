import { useMemo, useState } from "react";
import ClientList from "./components/ClientList";
import ClientForm from "./components/ClientForm";

function App() {
  const [mode, setMode] = useState("list");
  const [current, setCurrent] = useState(null);

  const title = useMemo(() => {
    if (mode === "create") return "Nuovo cliente";
    if (mode === "edit") return "Modifica cliente";
    return "Clienti";
  }, [mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">CRM Basic</h1>
          <p className="text-white/60">Gestione semplice clienti: crea, modifica, elimina e cerca</p>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{title}</h2>
            {mode !== "list" && (
              <button className="btn-secondary" onClick={() => { setMode("list"); setCurrent(null); }}>
                Torna alla lista
              </button>
            )}
          </div>

          {mode === "list" && (
            <ClientList
              onAdd={() => { setCurrent(null); setMode("create"); }}
              onEdit={(c) => { setCurrent(c); setMode("edit"); }}
            />
          )}

          {mode !== "list" && (
            <ClientForm
              initial={current}
              onCancel={() => { setMode("list"); setCurrent(null); }}
              onSaved={() => { setMode("list"); setCurrent(null); }}
            />
          )}
        </div>

        <footer className="mt-8 text-center text-white/50 text-xs">
          Costruita con Flames Blue
        </footer>
      </div>
    </div>
  );
}

export default App
