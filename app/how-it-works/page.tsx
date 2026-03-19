import Link from 'next/link'

// ─────────────────────────────────────────────
// Reusable phone frame wrapper
// ─────────────────────────────────────────────
function PhoneFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative w-[200px] bg-slate-900 rounded-[2.8rem] p-[6px] shadow-2xl ${className}`}>
      {/* Speaker notch */}
      <div className="absolute top-[13px] left-1/2 -translate-x-1/2 w-14 h-[5px] bg-slate-700 rounded-full z-10" />
      {/* Screen */}
      <div className="w-full bg-white rounded-[2.4rem] overflow-hidden">
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Phone mockup: Kid's account screen
// ─────────────────────────────────────────────
function PhoneKidAccount() {
  return (
    <PhoneFrame>
      {/* Colored hero header */}
      <div className="px-4 pt-8 pb-8" style={{ background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)' }}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">My Account</span>
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-[8px]">⚙️</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-black text-xs">A</span>
          </div>
          <div>
            <p className="text-[8px] text-white/60 font-bold uppercase tracking-widest">Account</p>
            <p className="text-white font-black text-sm">Alex</p>
          </div>
        </div>
        <p className="text-[8px] font-bold uppercase tracking-widest text-white/60 mb-0.5">Balance</p>
        <p className="text-white font-black text-3xl">$245.50</p>
      </div>
      {/* Content card */}
      <div className="bg-slate-50 px-3 pt-3 pb-5">
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          <div className="bg-indigo-600 rounded-xl py-2 text-center">
            <p className="text-white font-black text-[9px]">+ Add</p>
          </div>
          <div className="border border-slate-200 bg-white rounded-xl py-2 text-center">
            <p className="text-slate-700 font-black text-[9px]">Set Balance</p>
          </div>
        </div>
        {/* Mini transactions */}
        {[
          { label: 'Allowance', amt: '+$20.00', color: 'text-emerald-600' },
          { label: 'Interest', amt: '+$1.02', color: 'text-emerald-600' },
          { label: 'Toy store', amt: '-$12.50', color: 'text-rose-500' },
          { label: 'Birthday money', amt: '+$50.00', color: 'text-emerald-600' },
        ].map((tx) => (
          <div key={tx.label} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
            <p className="text-[9px] font-bold text-slate-700">{tx.label}</p>
            <p className={`text-[9px] font-black ${tx.color}`}>{tx.amt}</p>
          </div>
        ))}
      </div>
    </PhoneFrame>
  )
}

// ─────────────────────────────────────────────
// Phone mockup: Banker dashboard
// ─────────────────────────────────────────────
function PhoneBankerDashboard() {
  return (
    <PhoneFrame>
      {/* Dark header */}
      <div className="px-4 pt-8 pb-5 bg-slate-900">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Your Bank</p>
        <p className="text-white font-black text-sm leading-tight mb-3">The Johnson Bank</p>
        <div className="flex justify-between items-center">
          <p className="text-[8px] text-slate-400 font-bold">3 kids · 5% interest</p>
          <div className="bg-indigo-600 rounded-lg px-2 py-1">
            <p className="text-white text-[8px] font-black">+ Add Kid</p>
          </div>
        </div>
      </div>
      {/* Kids list */}
      <div className="bg-slate-50 px-3 py-3 space-y-2">
        {[
          { name: 'Alex', balance: '$245.50', color: '#38bdf8', initial: 'A' },
          { name: 'Jordan', balance: '$180.00', color: '#a78bfa', initial: 'J' },
          { name: 'Casey', balance: '$92.75', color: '#34d399', initial: 'C' },
        ].map((kid) => (
          <div key={kid.name} className="bg-white rounded-2xl px-3 py-2.5 flex items-center justify-between border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${kid.color}25` }}>
                <span className="font-black text-xs" style={{ color: kid.color }}>{kid.initial}</span>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-800">{kid.name}</p>
                <p className="text-[7px] text-slate-400 font-medium">Last activity: today</p>
              </div>
            </div>
            <p className="text-xs font-black text-slate-800">{kid.balance}</p>
          </div>
        ))}
        {/* Interest rate badge */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-3 py-2 flex items-center justify-between mt-1">
          <p className="text-[9px] font-black text-indigo-700">Annual Interest Rate</p>
          <p className="text-[10px] font-black text-indigo-600">5.0%</p>
        </div>
      </div>
    </PhoneFrame>
  )
}

// ─────────────────────────────────────────────
// Phone mockup: Add transaction modal
// ─────────────────────────────────────────────
function PhoneAddTransaction() {
  return (
    <PhoneFrame>
      {/* Blurred background peek */}
      <div className="relative">
        <div className="px-4 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #c084fc, #a855f7)' }}>
          <p className="text-[8px] text-white/60 font-bold uppercase tracking-widest mb-1">Balance</p>
          <p className="text-white font-black text-2xl">$92.75</p>
        </div>
        {/* Modal overlay */}
        <div className="bg-white rounded-t-3xl px-4 pt-4 pb-5 -mt-2 relative shadow-2xl">
          <div className="w-8 h-1 bg-slate-200 rounded-full mx-auto mb-3" />
          <p className="font-black text-slate-800 text-sm mb-3">Add Transaction</p>
          {/* Type buttons */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <div className="bg-emerald-500 rounded-xl py-2 text-center">
              <p className="text-white font-black text-[9px]">↑ Money In</p>
            </div>
            <div className="border border-slate-200 rounded-xl py-2 text-center">
              <p className="text-slate-500 font-black text-[9px]">↓ Money Out</p>
            </div>
          </div>
          {/* Amount field */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 mb-2 flex items-center gap-1.5">
            <span className="text-slate-400 font-black text-[10px]">$</span>
            <p className="text-slate-300 text-[10px]">0.00</p>
          </div>
          {/* Description field */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 mb-3">
            <p className="text-slate-300 text-[9px]">e.g. Birthday money</p>
          </div>
          {/* Save button */}
          <div className="bg-indigo-600 rounded-xl py-2.5 text-center">
            <p className="text-white font-black text-[10px]">Save</p>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Sticky Nav ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/login" className="text-lg font-black text-slate-800 tracking-tight hover:text-indigo-700 transition-colors">
            🏦 Bank of Mom &amp; Dad
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline text-sm font-black text-slate-400 uppercase tracking-widest">
              How It Works
            </span>
            <Link href="/login" className="text-sm font-black text-indigo-700 border-2 border-indigo-200 rounded-xl px-4 py-2 hover:border-indigo-400 transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl px-4 py-2 transition-colors shadow">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 px-6 py-16 sm:py-20 overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">

          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-4">For Families</p>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Teach your kids the value of money — without the spreadsheets.
            </h1>
            <p className="mt-5 text-indigo-200 text-lg leading-relaxed max-w-xl">
              Bank of Mom &amp; Dad is a simple, fun banking app that lets parents manage their kids&apos;
              savings accounts, track transactions, and automatically earn interest.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
              <Link href="/signup" className="bg-white text-indigo-700 font-black rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto text-center">
                Create Your Bank →
              </Link>
              <Link href="/login" className="border-2 border-white/40 text-white font-black rounded-2xl px-8 py-4 hover:bg-white/10 transition-colors w-full sm:w-auto text-center">
                Log In
              </Link>
            </div>
          </div>

          {/* Phone */}
          <div className="flex-shrink-0 flex justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-white/10 rounded-[3rem] blur-2xl scale-110" />
              <PhoneKidAccount />
            </div>
          </div>

        </div>
      </section>

      {/* ── Feature Highlights ── */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 text-center mb-10">
            Everything you need, nothing you don&apos;t
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-black text-slate-800 mb-2">Real savings, real lessons</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Set up individual accounts for each kid. Track every deposit, withdrawal, and balance change in one place.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-lg font-black text-slate-800 mb-2">Watch your money grow</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Set a custom annual interest rate for your family bank. Kids see their savings grow automatically — just like a real bank.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-black text-slate-800 mb-2">Make it yours</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Each kid picks their own color theme. Logging in feels personal, not like a chore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Phone Showcase ── */}
      <section className="py-16 px-6 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 text-center mb-2">See it in action</h2>
          <p className="text-slate-400 text-center text-sm mb-12">Three screens. That&apos;s really all there is to it.</p>

          <div className="flex flex-col sm:flex-row items-start justify-center gap-8 sm:gap-6">

            {/* Phone 1 */}
            <div className="flex flex-col items-center gap-4 mx-auto sm:mx-0">
              <PhoneBankerDashboard />
              <div className="text-center max-w-[200px]">
                <p className="font-black text-slate-800 text-sm">Your bank at a glance</p>
                <p className="text-slate-400 text-xs mt-1">See all kids, balances, and interest rate in one place.</p>
              </div>
            </div>

            {/* Phone 2 — raised */}
            <div className="flex flex-col items-center gap-4 mx-auto sm:mx-0 sm:-mt-6">
              <PhoneKidAccount />
              <div className="text-center max-w-[200px]">
                <p className="font-black text-slate-800 text-sm">Kid&apos;s personal account</p>
                <p className="text-slate-400 text-xs mt-1">Balance, full transaction history, and a custom color.</p>
              </div>
            </div>

            {/* Phone 3 */}
            <div className="flex flex-col items-center gap-4 mx-auto sm:mx-0">
              <PhoneAddTransaction />
              <div className="text-center max-w-[200px]">
                <p className="font-black text-slate-800 text-sm">Log a transaction</p>
                <p className="text-slate-400 text-xs mt-1">Money in or out in seconds — with a note for context.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── How It Works (Steps) ── */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-2">Get started in minutes</h2>
          <p className="text-slate-500 mb-10">No complicated setup. No monthly fees. Just you and your kids.</p>
          <ol className="space-y-8">
            {[
              {
                n: '1',
                title: 'Create your bank',
                body: 'Sign up with a username, password, and a name for your family bank (like \u201cThe Johnson Bank\u201d).',
              },
              {
                n: '2',
                title: 'Add your kids',
                body: "Create an account for each child with their name, a login username, and a password they'll remember.",
              },
              {
                n: '3',
                title: 'Record transactions',
                body: 'Log money in (allowance, birthday money, chores) and money out (spending). Add a note so kids know what each transaction was for.',
              },
              {
                n: '4',
                title: 'Watch them learn',
                body: 'Kids log in to check their balance, see transaction history, and watch their interest add up. Money lessons that actually stick.',
              },
            ].map((step) => (
              <li key={step.n} className="flex items-start gap-5">
                <span className="flex-shrink-0 w-11 h-11 rounded-full bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  {step.n}
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-800 mb-1">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Demo Callout ── */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8">
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Try the demo first</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Not ready to sign up? Log in with username <strong className="text-slate-800">demo</strong> and
              password <strong className="text-slate-800">demobank</strong> to explore the app with sample data.
            </p>
            <Link href="/login" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl px-6 py-3 text-sm transition-colors shadow">
              Try Demo Account →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Ready to open the bank?</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Join families already using Bank of Mom &amp; Dad to make money lessons fun.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="bg-white text-indigo-700 font-black rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto text-center">
              Create Your Bank →
            </Link>
            <Link href="/login" className="border-2 border-white/40 text-white font-black rounded-2xl px-8 py-4 hover:bg-white/10 transition-colors w-full sm:w-auto text-center">
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 bg-white border-t border-slate-100">
        <p className="text-center text-slate-400 text-sm">
          © 2026 Bank of Mom &amp; Dad · Built with ❤️ for families
        </p>
      </footer>

    </div>
  )
}
