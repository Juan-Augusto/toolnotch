import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Design System | ToolNotch',
  robots: { index: false },
}

// ─── Swatch ────────────────────────────────────────────────────────────
function Swatch({ label, value, style }: { label: string; value: string; style?: React.CSSProperties }) {
  return (
    <div className="flex items-center gap-3">
      <div
        style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '8px',
          border: '1px solid var(--base-border)',
          flexShrink: 0,
          ...style,
        }}
      />
      <div>
        <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
        <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{value}</div>
      </div>
    </div>
  )
}

// ─── Section ───────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        className="text-2xl font-bold mb-8"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

// ─── Divider ───────────────────────────────────────────────────────────
function Divider() {
  return <hr className="divider-neon my-16" />
}

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--base-bg)' }}>

      {/* ── Header ── */}
      <header style={{ borderBottom: '1px solid var(--base-border)' }}>
        <div className="max-w-4xl mx-auto px-6 py-14">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="badge-neon">Internal</span>
            <span className="badge-neon">v1.0</span>
            <span className="badge-neon">Surgical Neon</span>
          </div>
          <h1
            className="text-6xl font-bold mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.035em',
            }}
          >
            Design System
          </h1>
          <p className="text-lg max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            ToolNotch — Surgical Neon. Dark-first UI with one mint neon accent.
            Precision, restraint, function.
          </p>

          {/* Neon token preview */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div>
              <div className="label-neon">Primary neon</div>
              <div
                className="text-2xl font-bold font-mono text-glow"
                style={{ color: 'var(--neon)', fontFamily: 'var(--font-mono)' }}
              >
                #00e5a0
              </div>
            </div>
            <div>
              <div className="label-neon">Display font</div>
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Syne
              </div>
            </div>
            <div>
              <div className="label-neon">Body font</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Plus Jakarta Sans
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-14 space-y-0">

        {/* ── Colors ── */}
        <Section title="Color System">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

            {/* Dark surfaces */}
            <div className="card-neon p-6">
              <div className="label-neon mb-5">Surfaces (dark mode)</div>
              <div className="space-y-4">
                <Swatch label="--base-bg" value="#07070f" style={{ background: '#07070f' }} />
                <Swatch label="--base-surface" value="#0d0d1c" style={{ background: '#0d0d1c' }} />
                <Swatch label="--base-elevated" value="#131328" style={{ background: '#131328' }} />
                <Swatch label="--base-border" value="#1c1c36" style={{ background: '#1c1c36' }} />
              </div>
            </div>

            {/* Neon */}
            <div className="card-neon p-6">
              <div className="label-neon mb-5">Neon accent</div>
              <div className="space-y-4">
                <Swatch label="--neon (dark)" value="#00e5a0" style={{ background: '#00e5a0', boxShadow: '0 0 12px #00e5a060' }} />
                <Swatch label="--neon (light)" value="#00a86b" style={{ background: '#00a86b' }} />
                <Swatch label="--neon-dim" value="neon / 7%" style={{ background: 'var(--neon-dim)', border: '1px solid var(--neon-border)' }} />
                <Swatch label="--neon-border" value="neon / 22%" style={{ background: 'var(--neon-border)' }} />
              </div>
            </div>

            {/* Text */}
            <div className="card-neon p-6">
              <div className="label-neon mb-5">Typography colors</div>
              <div className="space-y-4">
                <Swatch label="--text-primary" value="#e8e8f6" style={{ background: '#e8e8f6' }} />
                <Swatch label="--text-secondary" value="#8e8eb6" style={{ background: '#8e8eb6' }} />
                <Swatch label="--text-muted" value="#4e4e72" style={{ background: '#4e4e72' }} />
              </div>
            </div>

            {/* Status */}
            <div className="card-neon p-6">
              <div className="label-neon mb-5">Status</div>
              <div className="space-y-4">
                <Swatch label="Danger" value="#ff3366" style={{ background: '#ff3366', boxShadow: '0 0 10px #ff336650' }} />
                <Swatch label="Warning" value="#ffaa00" style={{ background: '#ffaa00', boxShadow: '0 0 10px #ffaa0050' }} />
                <Swatch label="Info" value="#0099ff" style={{ background: '#0099ff', boxShadow: '0 0 10px #0099ff50' }} />
              </div>
            </div>
          </div>
        </Section>

        <Divider />

        {/* ── Typography ── */}
        <Section title="Typography">
          <div className="space-y-8">

            <div className="card-neon p-8 space-y-6">
              {/* Display */}
              <div>
                <div className="label-neon mb-2">Display — Syne 700/800</div>
                {(['text-6xl', 'text-5xl', 'text-4xl', 'text-3xl', 'text-2xl', 'text-xl'] as const).map((size, i) => (
                  <div
                    key={i}
                    className={`${size} font-bold leading-tight`}
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.025em',
                    }}
                  >
                    {size} Display
                  </div>
                ))}
              </div>

              <hr className="divider-neon" />

              {/* Body */}
              <div>
                <div className="label-neon mb-2">Body — Plus Jakarta Sans</div>
                <p className="text-base leading-relaxed mb-2" style={{ color: 'var(--text-primary)' }}>
                  Base (1rem): Free online tools that run entirely in your browser. No sign-up required,
                  no data sent to any server. Your files stay private.
                </p>
                <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Small (0.875rem): Secondary text, descriptions, helper copy. Used for supporting
                  information that doesn't need full prominence.
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  XSmall (0.75rem): Labels, captions, metadata, timestamps. Lowest level of the
                  text hierarchy.
                </p>
              </div>

              <hr className="divider-neon" />

              {/* Mono */}
              <div>
                <div className="label-neon mb-2">Mono — JetBrains Mono (fallback)</div>
                <code
                  className="text-sm"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--neon)' }}
                >
                  {'const result = calculateBmi({ weight: 70, height: 175, unit: "metric" })'}
                </code>
              </div>
            </div>
          </div>
        </Section>

        <Divider />

        {/* ── Components ── */}
        <Section title="Components">
          <div className="space-y-8">

            {/* Buttons */}
            <div>
              <div className="label-neon mb-4">Buttons</div>
              <div className="card-neon p-6 flex flex-wrap gap-4 items-center">
                <button className="btn-neon">Primary action</button>
                <button className="btn-neon" disabled>Disabled</button>
                <button className="btn-ghost">Ghost button</button>
                <button
                  className="btn-neon text-sm"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}
                >
                  Small
                </button>
              </div>
            </div>

            {/* Badges */}
            <div>
              <div className="label-neon mb-4">Badges</div>
              <div className="card-neon p-6 flex flex-wrap gap-3 items-center">
                <span className="badge-neon">Privacy secured</span>
                <span className="badge-neon">Free</span>
                <span className="badge-neon">New</span>
                <span
                  className="badge-neon"
                  style={{ color: '#ff3366', background: 'rgb(255 51 102 / 0.07)', borderColor: 'rgb(255 51 102 / 0.3)' }}
                >
                  Danger
                </span>
                <span
                  className="badge-neon"
                  style={{ color: '#0099ff', background: 'rgb(0 153 255 / 0.07)', borderColor: 'rgb(0 153 255 / 0.3)' }}
                >
                  Info
                </span>
              </div>
            </div>

            {/* Cards */}
            <div>
              <div className="label-neon mb-4">Cards</div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="card-neon p-5">
                  <div className="label-neon mb-2">Static card</div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Use for non-interactive content blocks. Hover shows neon border + glow.
                  </p>
                </div>
                <div className="card-neon-interactive p-5">
                  <div className="label-neon mb-2">Interactive card</div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Use for clickable items. Lifts on hover, neon border + glow.
                  </p>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <div className="label-neon mb-4">Form inputs</div>
              <div className="card-neon p-6 space-y-4">
                <div>
                  <label className="label-neon">Text field</label>
                  <input className="input-neon" placeholder="Placeholder text…" />
                </div>
                <div>
                  <label className="label-neon">Textarea</label>
                  <textarea
                    className="input-neon resize-none"
                    placeholder="Multi-line input…"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Pro-tip */}
            <div>
              <div className="label-neon mb-4">Pro-tip block</div>
              <div className="protip-neon">
                <p
                  className="text-xs font-bold mb-1.5 uppercase tracking-widest"
                  style={{ color: 'var(--neon)' }}
                >
                  Pro tip
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Use the left neon border + dim background to highlight important supplementary
                  information without overwhelming the main content hierarchy.
                </p>
              </div>
            </div>

          </div>
        </Section>

        <Divider />

        {/* ── Spacing & Radius ── */}
        <Section title="Spacing & Radius">
          <div className="card-neon p-6">
            <div className="label-neon mb-6">Border radius</div>
            <div className="flex flex-wrap gap-6 items-end">
              {[
                { label: 'sm', value: '4px', r: '4px' },
                { label: 'default', value: '8px', r: '8px' },
                { label: 'lg', value: '12px', r: '12px' },
                { label: 'xl', value: '16px', r: '16px' },
                { label: 'full', value: '999px', r: '999px' },
              ].map(({ label, value, r }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      background: 'var(--base-elevated)',
                      border: '1px solid var(--neon-border)',
                      borderRadius: r,
                    }}
                  />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Divider />

        {/* ── Animations ── */}
        <Section title="Animations">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card-neon p-5 flex flex-col gap-3">
              <div className="label-neon">fade-in-up</div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                0.35s ease-out. Used on tool cards and section entries.
              </p>
              <code
                className="text-xs"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--neon)' }}
              >
                className="animate-fade-in-up"
              </code>
            </div>
            <div className="card-neon p-5 flex flex-col gap-3">
              <div className="label-neon">neon-pulse</div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                2.4s infinite. Breathing effect for neon indicators.
              </p>
              <div
                className="w-2 h-2 rounded-full animate-neon-pulse"
                style={{ background: 'var(--neon)', boxShadow: 'var(--neon-glow-sm)' }}
              />
            </div>
          </div>
        </Section>

        <div className="pb-16" />
      </div>
    </main>
  )
}
