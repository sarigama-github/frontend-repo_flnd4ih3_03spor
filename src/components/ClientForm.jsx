import { useEffect, useState } from "react";

const empty = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  company: "",
  address: { street: "", city: "", province: "", postal_code: "", country: "" },
  tags: [],
  notes: "",
  newsletter_subscribed: true,
  contact_preferences: { preferred_channel: "email", allow_marketing: true, best_time: "" },
  lead_status: "lead",
};

export default function ClientForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(initial || empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setForm(initial || empty); }, [initial]);

  const backend = import.meta.env.VITE_BACKEND_URL || "";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((f) => ({ ...f, address: { ...(f.address||{}), [key]: value } }));
    } else if (name.startsWith("contact_preferences.")) {
      const key = name.split(".")[1];
      const val = type === "checkbox" ? checked : value;
      setForm((f) => ({ ...f, contact_preferences: { ...(f.contact_preferences||{}), [key]: val } }));
    } else if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = form.id ? "PUT" : "POST";
      const url = form.id ? `${backend}/api/clients/${form.id}` : `${backend}/api/clients`;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Errore salvataggio");
      const data = await res.json().catch(() => ({}));
      onSaved && onSaved(data);
    } catch (err) {
      setError(err.message || "Errore");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="Nome" name="first_name" value={form.first_name}
               onChange={handleChange} required />
        <input className="input" placeholder="Cognome" name="last_name" value={form.last_name}
               onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="Email" name="email" value={form.email||""} onChange={handleChange} />
        <input className="input" placeholder="Telefono" name="phone" value={form.phone||""} onChange={handleChange} />
      </div>
      <input className="input" placeholder="Azienda" name="company" value={form.company||""} onChange={handleChange} />

      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="Via" name="address.street" value={form.address?.street||""} onChange={handleChange} />
        <input className="input" placeholder="Città" name="address.city" value={form.address?.city||""} onChange={handleChange} />
        <input className="input" placeholder="Provincia" name="address.province" value={form.address?.province||""} onChange={handleChange} />
        <input className="input" placeholder="CAP" name="address.postal_code" value={form.address?.postal_code||""} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <select className="input" name="lead_status" value={form.lead_status||"lead"} onChange={handleChange}>
          <option value="lead">Lead</option>
          <option value="prospect">Prospect</option>
          <option value="customer">Customer</option>
          <option value="inactive">Inactive</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" name="newsletter_subscribed" checked={!!form.newsletter_subscribed} onChange={handleChange} />
          Iscrizione newsletter
        </label>
        <select className="input" name="contact_preferences.preferred_channel" value={form.contact_preferences?.preferred_channel||"email"} onChange={handleChange}>
          <option value="email">Email</option>
          <option value="phone">Telefono</option>
          <option value="sms">SMS</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="none">Nessuno</option>
        </select>
      </div>

      <textarea className="input min-h-[80px]" placeholder="Note" name="notes" value={form.notes||""} onChange={handleChange} />

      <div className="flex gap-3 justify-end">
        <button type="button" className="btn-secondary" onClick={onCancel}>Annulla</button>
        <button type="submit" className="btn-primary" disabled={loading}>{form.id ? "Salva" : "Crea"}</button>
      </div>
    </form>
  );
}
