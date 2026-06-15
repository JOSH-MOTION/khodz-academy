"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BalancePaymentPage() {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return {
      min: minutes.toString().padStart(2, "0"),
      sec: seconds.toString().padStart(2, "0"),
    };
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Paystack balance checkout triggered. Processing GHS 1,250.00...");
  };

  const time = formatTime();

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary selection:text-background min-h-screen">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-gutter py-stack-md max-w-container-max mx-auto bg-surface/70 dark:bg-surface/70 backdrop-blur-xl border-b border-white/10 max-w-[1280px] mx-auto px-6 py-4 left-1/2 -translate-x-1/2">
        <Link href="/" className="font-syne text-display-md font-bold text-primary tracking-tighter text-2xl">
          KHODZ ACADEMY
        </Link>
        <div className="flex items-center gap-stack-md gap-4 text-xs">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">notifications</span>
          <div className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center overflow-hidden">
            <img
              alt="User avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0Xnx18iYtmFEw4knho76sXCWO8XgBKZUJfiUwtaL8vN6rXN9wXlmq9nGf3Z8zaB5GNytK2-aKh9bMRi4ekMeFQaL5EY_TBix7IIzXv8h8iNJ_GMIXeS-Rfi_fYS3Tvm1kn3IpwTuRyLJfe2twsWRyluElXyZl7IuFPo7DHX7qxKls4Gsfihlzvu_l25NRNUZeu5kZ8jeILpfGrkbtAwiX-EcpfK9XXIshNQu6ozzLfyo4XV_K6VJ3v5vDpn2Avb9bsF0uyAllN_A"
            />
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-gutter max-w-container-max mx-auto max-w-[1280px] px-6">
        {/* Header Section */}
        <div className="mb-stack-lg mb-8">
          <h1 className="font-syne text-display-md text-3xl font-extrabold mb-2 text-white">Complete Your Enrollment</h1>
          <p className="text-on-surface-variant text-sm max-w-2xl">
            Secure your spot in the High Performance LMS Architecture course. Your seat is temporarily held while you finalize the payment.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg gap-8">
          
          {/* Left Column: Payment Methods & Actions */}
          <div className="lg:col-span-7 space-y-stack-lg space-y-6">
            
            {/* Countdown Timer */}
            <div className="glass-card p-stack-lg p-6 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-stack-sm gap-2 text-xs">
                <span className="material-symbols-outlined text-tertiary-container animate-pulse">timer</span>
                <span className="font-label-md text-on-surface-variant font-bold uppercase tracking-wider">Payment Deadline</span>
              </div>
              <div className="flex gap-2 text-xs" id="countdown">
                <div className="countdown-segment px-3 py-2 rounded text-primary font-bold text-sm bg-white/5 border border-white/10">
                  {time.min}
                </div>
                <span className="text-primary font-bold self-center text-sm">:</span>
                <div className="countdown-segment px-3 py-2 rounded text-primary font-bold text-sm bg-white/5 border border-white/10">
                  {time.sec}
                </div>
              </div>
            </div>

            {/* Paystack UI Simulation */}
            <div className="glass-card rounded-xl overflow-hidden inner-glow">
              <div className="bg-surface-container-high p-stack-md p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-stack-sm gap-2 text-xs">
                  <span className="material-symbols-outlined text-primary text-lg">account_balance_wallet</span>
                  <span className="font-syne font-bold text-sm text-white">Secure Payment</span>
                </div>
                <img
                  alt="Paystack Logo"
                  className="h-6 opacity-80 grayscale brightness-200"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP8LAtg6R2gTGUqNyTFm1BqIgsaYZHHZcAh39JDbqM9gcHDOGWHXGFy5REgicOaRxVjYTjRayDZBOPCP6v-QLdXPGX0ffUDhivScj3G6g2X4m0Gak1DqJLhAOw2hbynptXGqFOVfkVBwV1z2d7ePqyU0mogLX-oIKvZhv6Xm4OgsVzFXw8r5pDO6_DFxTyhe-mbQDa03kPnJDEoTpvckEp0eaLFo5sB1kQAgD_gJIVQyWz8PqalhrNBNZisJsT1fnPNrutbNs6-4c"
                />
              </div>
              
              <div className="p-stack-lg p-6">
                <form onSubmit={handlePay} className="space-y-stack-md space-y-4 text-xs">
                  <div className="flex flex-col">
                    <label className="text-on-surface-variant mb-2 uppercase font-bold text-[10px]">Card Number</label>
                    <div className="relative">
                      <input
                        required
                        className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-on-surface focus:border-primary outline-none transition-all text-white bg-[#0d1510]"
                        placeholder="0000 0000 0000 0000"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-stack-md gap-4">
                    <div className="flex flex-col">
                      <label className="text-on-surface-variant mb-2 uppercase font-bold text-[10px]">Expiry Date</label>
                      <input
                        required
                        className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-on-surface focus:border-primary outline-none transition-all text-white bg-[#0d1510]"
                        placeholder="MM / YY"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-on-surface-variant mb-2 uppercase font-bold text-[10px]">CVV</label>
                      <input
                        required
                        className="w-full bg-surface-container-low border border-white/10 rounded-lg p-3 text-on-surface focus:border-primary outline-none transition-all text-white bg-[#0d1510]"
                        placeholder="***"
                        type="password"
                      />
                    </div>
                  </div>
                  <button
                    className="w-full bg-primary text-background font-bold py-4 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-all primary-glow mt-4 cursor-pointer text-xs uppercase tracking-wider text-black font-bold shadow-[0_0_20px_rgba(69,236,157,0.2)]"
                    type="submit"
                  >
                    Pay Balance $1,250.00
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </form>
              </div>
              <div className="bg-surface-container-low p-stack-md p-4 text-center border-t border-white/5 text-[10px]">
                <p className="text-on-surface-variant flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Encrypted with 256-bit SSL security
                </p>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-stack-md gap-4 text-xs font-semibold">
              <div className="glass-card p-stack-md p-4 rounded-lg text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                <span>Secure Data</span>
              </div>
              <div className="glass-card p-stack-md p-4 rounded-lg text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">history</span>
                <span>Refund Policy</span>
              </div>
              <div className="glass-card p-stack-md p-4 rounded-lg text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">support_agent</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Summary Breakdown */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 glass-card rounded-xl p-stack-lg p-6 inner-glow">
              <h2 className="font-syne text-headline-md text-sm font-bold mb-stack-md mb-4 text-white">Order Summary</h2>
              
              {/* Breakdown */}
              <div className="space-y-stack-md space-y-3 mb-stack-lg mb-6 text-xs text-on-surface-variant">
                <div className="flex justify-between items-center">
                  <span>Program Fee (LMS Architecture)</span>
                  <span className="text-on-surface font-semibold">$2,500.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Admission Fee Paid</span>
                  <span className="text-secondary font-bold">-$250.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Deposit Requirement</span>
                  <span className="text-on-surface font-semibold">$1,000.00</span>
                </div>
                <div className="h-px bg-white/10 my-stack-md my-4"></div>
                <div className="flex justify-between items-center text-sm mt-4">
                  <div className="flex flex-col">
                    <span className="font-syne text-headline-md font-bold text-white">Remaining Balance</span>
                    <span className="text-[10px] text-on-surface-variant font-semibold">Due within 30 days</span>
                  </div>
                  <span className="font-syne text-primary text-base font-bold">$1,250.00</span>
                </div>
              </div>

              {/* Selected Program Info */}
              <div className="bg-surface-container-high rounded-lg p-stack-md p-4 border border-white/5 flex gap-stack-md gap-4 text-xs">
                <div className="w-20 h-20 bg-surface rounded overflow-hidden flex-shrink-0">
                  <img
                    alt="Course Thumbnail"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcABy8c7N5sS__juAmm3yuFoRaYpT8mcYRcIbDUPF6MFmyjENimZl4821MZZvQPrCW11BvqqQ0GEKxvHG8fZ4lC8HeAJocQkcNRPCJFB3GML5zvt5FK6R6Di2YoqdWvAnOU2HwLWy9WllVoYQqRznH-Dmk-g-wXMvcDXYQYbQ4kT9GZBi_SepsGsYqQzkybbhDvy4ChDnnxAG6giYaoD5EqHng36h9d6KVxdk-O5VEkSBuF6DXqFLpoJ43gyQBZpRWWWRT75D1WPA"
                  />
                </div>
                <div>
                  <span className="inline-block bg-secondary-container text-on-secondary-container text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm mb-1 tracking-widest">
                    Premium Track
                  </span>
                  <h3 className="font-bold text-on-surface leading-tight mt-1 text-xs">
                    High Performance LMS Systems Design
                  </h3>
                  <p className="text-[10px] text-on-surface-variant mt-1">Cohort Starts Oct 15, 2024</p>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-stack-lg mt-6 text-xs flex flex-col">
                <label className="block text-[10px] text-on-surface-variant uppercase mb-2 font-semibold">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-grow bg-surface-container-low border border-white/10 rounded p-2 text-on-surface outline-none focus:border-primary text-white bg-[#0d1510]"
                    placeholder="Enter code"
                    type="text"
                  />
                  <button className="bg-surface-container-highest px-4 py-2 rounded text-xs font-bold hover:bg-surface-variant transition-all cursor-pointer text-white">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-stack-lg py-8 px-gutter px-6 flex flex-col md:flex-row justify-between items-center border-t border-white/10 bg-background max-w-[1280px] mx-auto gap-4">
        <div className="mb-stack-md md:mb-0 text-center md:text-left">
          <span className="font-syne text-headline-md text-primary font-bold text-lg">KHODZ ACADEMY</span>
          <p className="text-xs text-on-surface-variant">© 2024 Khodz Academy. All rights reserved.</p>
        </div>
        <div className="flex gap-stack-lg gap-4 text-xs font-semibold">
          <a className="hover:text-primary underline transition-opacity duration-200" href="#">Terms of Service</a>
          <a className="hover:text-primary underline transition-opacity duration-200" href="#">Privacy Policy</a>
          <a className="hover:text-primary underline transition-opacity duration-200" href="#">Refund Policy</a>
          <a className="hover:text-primary underline transition-opacity duration-200" href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}
