'use client'
export default function TravelHub() {
  return (
    <div className="min-h-screen bg-black text-white p-10 text-center">
      <h1 className="text-7xl font-black uppercase tracking-tighter">Global <span className="text-blue-500">Propel</span></h1>
      <p className="text-slate-400 mt-4">Powered by Amadeus & Duffel | Payments via Paystack</p>
      <div className="mt-20 max-w-xl mx-auto p-10 border border-white/10 rounded-full">
        <input type="text" placeholder="Where to, Captain?" className="bg-transparent text-center w-full text-2xl outline-none" />
      </div>
    </div>
  );
}
