import { useEffect, useMemo, useState } from "react";

export default function ClientList({ onAdd, onEdit }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const backend = import.meta.env.VITE_BACKEND_URL || "";

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backend}/api/clients`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return items.filter((i) =>
      [i.first_name, i.last_name, i.email, i.phone, i.company]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [items, q]);

  const remove = async (id) => {
    if (!confirm("Eliminare il cliente?")) return;
    await fetch(`${backend}/api/clients/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <input className="input flex-1" placeholder="Cerca" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn-primary" onClick={onAdd}>Nuovo</button>
      </div>
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/80">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Contatti</th>
              <th className="px-4 py-3 text-left">Stato</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
              <tr><td className="px-4 py-6 text-center text-white/60" colSpan={4}>Caricamento...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="px-4 py-6 text-center text-white/60" colSpan={4}>Nessun cliente</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{c.first_name} {c.last_name}<div className="text-white/50 text-xs">{c.company||""}</div></td>
                  <td className="px-4 py-3 text-white/80">
                    <div>{c.email||"-"}</div>
                    <div className="text-white/60">{c.phone||"-"}</div>
                  </td>
                  <td className="px-4 py-3 text-white/80">{c.lead_status||"-"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button className="btn-secondary" onClick={() => onEdit(c)}>Modifica</button>
                      <button className="btn-danger" onClick={() => remove(c.id)}>Elimina</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
