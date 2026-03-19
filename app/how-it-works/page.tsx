import Link from 'next/link'

// Marketing "How It Works" page — server component, no interactivity needed

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white font-nunito">

      {/* ── Sticky Nav ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/login"
            className="text-lg font-black text-slate-800 tracking-tight hover:text-indigo-700 transition-colors"
          >
            🏦 Bank of Mom &amp; Dad
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Current page — muted */}
            <span className="hidden sm:inline text-sm font-black text-slate-400 uppercase tracking-widest">
              How It Works
            </span>
            {/* Log In — outline style */}
            <Link
              href="/login"
              className="text-sm font-black text-indigo-700 border-2 border-indigo-200 rounded-xl px-4 py-2 hover:border-indigo-400 transition-colors"
            >
              Log In
            </Link>
            {/* Sign Up — filled */}
            <Link
              href="/signup"
              className="text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl px-4 py-2 transition-colors shadow"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Eyebrow */}
          <p className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-4">
            For Families
          </p>
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Teach your kids the value of money — without the spreadsheets.
          </h1>
          {/* Subtext */}
          <p className="mt-5 text-indigo-200 text-lg leading-relaxed max-w-xl mx-auto">
            Bank of Mom &amp; Dad is a simple, fun banking app that lets parents manage their kids&apos;
            savings accounts, track transactions, and automatically earn interest.
          </p>
          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="bg-white text-indigo-700 font-black rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto text-center"
            >
              Create Your Bank →
            </Link>
            <Link
              href="/login"
              className="border-2 border-white/40 text-white font-black rounded-2xl px-8 py-4 hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
            >
              Log In
            </Link>
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

            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-black text-slate-800 mb-2">Real savings, real lessons</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Set up individual accounts for each kid. Track every deposit, withdrawal, and balance
                change in one place.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-lg font-black text-slate-800 mb-2">Watch your money grow</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Set a custom annual interest rate for your family bank. Kids see their savings grow
                automatically — just like a real bank.
              </p>
            </div>

            {/* Card 3 */}
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

      {/* ── How It Works (Steps) ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-2">Get started in minutes</h2>
          <p className="text-slate-500 mb-10">
            No complicated setup. No monthly fees. Just you and your kids.
          </p>

          <ol className="space-y-8">

            {/* Step 1 */}
            <li className="flex items-start gap-5">
              <span className="flex-shrink-0 w-11 h-11 rounded-full bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                1
              </span>
              <div>
                <h3 className="text-base font-black text-slate-800 mb-1">Create your bank</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Sign up with a username, password, and a name for your family bank (like &ldquo;The Johnson Bank&rdquo;).
                </p>
              </div>
            </li>

            {/* Step 2 */}
            <li className="flex items-start gap-5">
              <span className="flex-shrink-0 w-11 h-11 rounded-full bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                2
              </span>
              <div>
                <h3 className="text-base font-black text-slate-800 mb-1">Add your kids</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Create an account for each child with their name, a login username, and a password they&apos;ll remember.
                </p>
              </div>
            </li>

            {/* Step 3 */}
            <li className="flex items-start gap-5">
              <span className="flex-shrink-0 w-11 h-11 rounded-full bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                3
              </span>
              <div>
                <h3 className="text-base font-black text-slate-800 mb-1">Record transactions</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Log money in (allowance, birthday money, chores) and money out (spending). Add a note so kids know
                  what each transaction was for.
                </p>
              </div>
            </li>

            {/* Step 4 */}
            <li className="flex items-start gap-5">
              <span className="flex-shrink-0 w-11 h-11 rounded-full bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                4
              </span>
              <div>
                <h3 className="text-base font-black text-slate-800 mb-1">Watch them learn</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Kids log in to check their balance, see transaction history, and watch their interest add up.
                  Money lessons that actually stick.
                </p>
              </div>
            </li>

          </ol>
        </div>
      </section>

      {/* ── Demo Callout ── */}
      <section className="py-12 px-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8">
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Try the demo first</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Not ready to sign up? Log in with username <strong className="text-slate-800">demo</strong> and
              password <strong className="text-slate-800">demobank</strong> to explore the app with sample data.
            </p>
            <Link
              href="/login"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl px-6 py-3 text-sm transition-colors shadow"
            >
              Try Demo Account →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
            Ready to open the bank?
          </h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Join families already using Bank of Mom &amp; Dad to make money lessons fun.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="bg-white text-indigo-700 font-black rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto text-center"
            >
              Create Your Bank →
            </Link>
            <Link
              href="/login"
              className="border-2 border-white/40 text-white font-black rounded-2xl px-8 py-4 hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
            >
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
