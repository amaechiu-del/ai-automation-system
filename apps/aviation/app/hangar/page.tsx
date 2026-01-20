'use client'
export default function AviationHangar() {
  const tutors = [
    { name: "Capt Tunde", role: "Air Law", color: "border-blue-500", icon: "?????" },
    { name: "OB Danger", role: "Radio Comms", color: "border-red-500", icon: "??" },
    { name: "Engr. Chinyo", role: "Turbines", color: "border-orange-500", icon: "??" }
  ];
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-10 font-sans">
      <h1 className="text-5xl font-black tracking-tighter mb-12">DOMISLINK ACADEMY</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tutors.map((t) => (
          <div key={t.name} className={p-8 bg-white/5 border-t-4 \ rounded-xl hover:bg-white/10 transition cursor-pointer}>
            <div className="text-6xl mb-4">{t.icon}</div>
            <h2 className="text-2xl font-bold">{t.name}</h2>
            <p className="text-slate-500 mt-2">{t.role}</p>
            <button className="mt-6 w-full py-3 bg-white/10 rounded font-bold uppercase text-xs">Enter Session</button>
          </div>
        ))}
      </div>
    </div>
  );
}
