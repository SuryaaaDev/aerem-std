import { login } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Tech Grid Details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      <div className="w-full max-w-sm relative z-10 border border-border bg-black/40 backdrop-blur-md p-8 md:p-10">
        {/* Tech corners */}
        <div className="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-accent" />
        <div className="absolute -top-px -right-px w-2 h-2 border-t-2 border-r-2 border-accent" />
        <div className="absolute -bottom-px -left-px w-2 h-2 border-b-2 border-l-2 border-accent" />
        <div className="absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 border-accent" />

        {/* Header */}
        <div className="mb-8 relative pb-6 border-b border-border/40">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 bg-accent animate-pulse" />
            <span className="text-[9px] font-mono tracking-[0.3em] text-accent uppercase font-bold">
              SYS_AUTH_PORTAL
            </span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-foreground font-mono">
            Admin Access
          </h1>
          <p className="text-foreground/45 text-[10px] uppercase tracking-wider font-mono mt-1">
            Sign in to manage portfolio database
          </p>
        </div>

        <form className="flex flex-col gap-5">
          {searchParams.error && (
            <div className="bg-red-500/10 text-red-400 text-xs p-3.5 border border-red-500/20 font-mono uppercase tracking-wider leading-relaxed">
              <span className="text-red-500 font-bold block mb-1">!! ERROR_LOG:</span>
              {searchParams.error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 font-mono">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="ENTER EMAIL..."
              className="px-3.5 py-3 bg-black/40 border border-border/40 text-xs focus:outline-none focus:border-accent text-foreground transition-all font-mono uppercase tracking-wider placeholder:text-foreground/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 font-mono">
              Access Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="ENTER PASSWORD..."
              className="px-3.5 py-3 bg-black/40 border border-border/40 text-xs focus:outline-none focus:border-accent text-foreground transition-all font-mono placeholder:text-foreground/20"
            />
          </div>

          <button
            formAction={login}
            className="mt-4 w-full bg-accent text-black hover:bg-black hover:text-accent hover:border-accent border border-transparent font-bold uppercase tracking-widest px-4 py-3 text-xs font-mono transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            Authenticate //
          </button>
        </form>
      </div>
    </div>
  )
}

