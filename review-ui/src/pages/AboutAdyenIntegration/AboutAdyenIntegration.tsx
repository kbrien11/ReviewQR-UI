
import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Reveal className="mb-10">
      <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
        {eyebrow}
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h2>

      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        {description}
      </p>
    </Reveal>
  );
}

function CodeBlock({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-400" />
        <div className="h-3 w-3 rounded-full bg-yellow-400" />
        <div className="h-3 w-3 rounded-full bg-green-400" />

        {title && (
          <span className="ml-3 text-xs text-slate-500">{title}</span>
        )}
      </div>

      <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-300">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function ArchitectureNode({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="group relative flex-1">
      <div className="relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-2xl">
        <div className="absolute right-5 top-5 text-xs font-bold text-slate-300">
          {number}
        </div>

        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>

        <h3 className="text-xl font-bold text-slate-900">{title}</h3>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="hidden items-center justify-center px-3 lg:flex">
      <div className="relative flex items-center">
        <div className="h-px w-16 overflow-hidden bg-slate-200">
          <div className="h-full w-1/2 animate-[flow_2s_linear_infinite] bg-indigo-500" />
        </div>

        <div className="text-indigo-500 transition-transform duration-300 hover:translate-x-1">
          →
        </div>
      </div>
    </div>
  );
}

function LifecycleStep({
  number,
  title,
  description,
  icon,
  delay,
}: {
  number: string;
  title: string;
  description: string;
  icon: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="group relative">
        <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:bg-indigo-600">
          {icon}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            Step {number}
          </div>

          <h3 className="mt-2 font-bold text-slate-900">{title}</h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

function CheckItem({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-600 transition-transform duration-300 group-hover:scale-110">
          ✓
        </div>

        <div className="text-sm leading-6 text-slate-700">{children}</div>
      </div>
    </Reveal>
  );
}

function SecurityCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="group h-full rounded-3xl border border-slate-800 bg-slate-900/70 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-indigo-500/60 hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-950/40">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-2xl ring-1 ring-indigo-500/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-indigo-500/20">
          {icon}
        </div>

        <h3 className="text-lg font-bold text-white">{title}</h3>

        <p className="mt-3 text-sm leading-7 text-slate-400">
          {description}
        </p>
      </div>
    </Reveal>
  );
}

export default function AboutAdyenIntegration() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-18px);
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translate(0px, 0px);
          }
          50% {
            transform: translate(12px, -20px);
          }
        }

        @keyframes flow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }

        @keyframes pulseSoft {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.08);
          }
        }

        @keyframes shieldPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.15);
          }
          50% {
            transform: scale(1.04);
            box-shadow: 0 0 0 16px rgba(99, 102, 241, 0);
          }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: floatSlow 8s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulseSoft 4s ease-in-out infinite;
        }

        .animate-shield {
          animation: shieldPulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative isolate overflow-hidden bg-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-[8%] top-20 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl animate-float" />

          <div
            className="absolute right-[10%] top-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl animate-float-slow"
            style={{ animationDelay: "1s" }}
          />

          <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-200/20 blur-3xl animate-pulse-soft" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-24 lg:px-8 lg:pb-32 lg:pt-32">
          <div className="max-w-4xl">
            <Reveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                </span>

                Technical Integration Overview
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-5xl font-bold tracking-tight text-slate-950 md:text-7xl">
                Building with{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                  Adyen Drop-in
                </span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600">
                A practical architecture for integrating payments while
                keeping customer experience, business logic, security, and
                payment processing clearly separated.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10 flex flex-wrap gap-4">
                {[
                  "Sessions API",
                  "Drop-in",
                  "Webhooks",
                  "3DS",
                  "Security",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================
          OVERVIEW
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <SectionTitle
          eyebrow="01 — Overview"
          title="What is Adyen Drop-in?"
          description="Drop-in is a pre-built payment UI that handles much of the complexity of collecting and processing payment details."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: "🎨",
              title: "Customer experience",
              text: "A ready-made payment interface that supports cards, wallets, authentication, and other payment methods.",
            },
            {
              icon: "⚙️",
              title: "Payment orchestration",
              text: "Adyen handles the underlying payment processing and authentication flows.",
            },
            {
              icon: "🔐",
              title: "Reduced complexity",
              text: "The application does not need to build every payment method and authentication flow from scratch.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 120}>
              <div className="group h-full rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-2xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold">{item.title}</h3>

                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =========================================================
          ARCHITECTURE
      ========================================================= */}

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionTitle
            eyebrow="02 — Architecture"
            title="Three responsibilities, clearly separated"
            description="The cleanest integration keeps the browser focused on the customer experience, the backend responsible for business logic, and Adyen responsible for payment processing."
          />

          <div className="flex flex-col items-stretch lg:flex-row lg:items-center">
            <ArchitectureNode
              number="01"
              icon="🖥️"
              title="Frontend"
              description="Displays Drop-in, starts the checkout experience, and responds to the customer's payment state."
            />

            <FlowArrow />

            <ArchitectureNode
              number="02"
              icon="⚙️"
              title="Backend"
              description="Creates sessions, protects private credentials, manages orders, and processes verified webhooks."
            />

            <FlowArrow />

            <ArchitectureNode
              number="03"
              icon="💳"
              title="Adyen"
              description="Processes the payment, performs authentication when required, and sends payment results and notifications."
            />
          </div>

          <Reveal delay={250} className="mt-10">
            <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-6">
              <div className="flex flex-col items-center justify-between gap-4 text-sm font-medium text-slate-600 md:flex-row">
                <span>Customer</span>
                <span className="text-indigo-500">→</span>
                <span>React / Drop-in</span>
                <span className="text-indigo-500">→</span>
                <span>Backend / Sessions API</span>
                <span className="text-indigo-500">→</span>
                <span>Adyen</span>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden bg-indigo-100">
                <div className="h-full w-32 bg-indigo-500 animate-[flow_3s_linear_infinite]" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          SESSIONS
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <SectionTitle
          eyebrow="03 — Sessions API"
          title="Start the payment securely"
          description="The backend creates the payment session. The frontend receives the session information needed to initialize Drop-in."
        />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <CodeBlock title="backend">
{`POST /api/create-session

const session = await adyen.checkout.sessions({
  amount: {
    currency: "USD",
    value: 5000
  },
  reference: "ORDER-123",
  merchantAccount: MERCHANT_ACCOUNT,
  returnUrl: RETURN_URL
});

return session;`}
            </CodeBlock>
          </Reveal>

          <Reveal delay={150}>
            <div className="space-y-5">
              {[
                [
                  "1",
                  "Customer starts checkout",
                  "The frontend asks your backend to create a payment session.",
                ],
                [
                  "2",
                  "Backend calls Adyen",
                  "The backend uses the private API credential to create the session.",
                ],
                [
                  "3",
                  "Session is returned",
                  "The backend sends the appropriate session information to the frontend.",
                ],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600 transition-transform duration-300 group-hover:scale-110">
                    {number}
                  </div>

                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          DROP-IN
      ========================================================= */}

      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
              04 — Frontend
            </div>

            <h2 className="text-3xl font-bold md:text-4xl">
              Initialize and mount Drop-in
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
              The browser uses the client key and session information to
              initialize the Adyen checkout experience.
            </p>
          </Reveal>

          <Reveal delay={150} className="mt-10">
            <CodeBlock title="React / TypeScript">
{`const checkout = await AdyenCheckout({
  environment: "test",
  clientKey,
  session,
  onPaymentCompleted: (result) => {
    console.log(result);
  },
  onError: (error) => {
    console.error(error);
  }
});

const dropin = checkout.create("dropin");

dropin.mount("#dropin-container");`}
            </CodeBlock>
          </Reveal>

          <Reveal delay={250} className="mt-8">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Client key", "Safe for browser-side use"],
                ["Session", "Created by the backend"],
                ["Private API key", "Never expose to the browser"],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50"
                >
                  <div className="text-sm font-bold text-white">{title}</div>
                  <div className="mt-2 text-sm text-slate-400">{text}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          LIFECYCLE
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <SectionTitle
          eyebrow="05 — Payment lifecycle"
          title="Follow the payment from start to finish"
          description="The session is created before Drop-in is mounted. The webhook is a separate asynchronous notification, so it may arrive before or after the shopper sees the result."
        />

        <div className="relative grid gap-8 md:grid-cols-3 lg:grid-cols-5">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-slate-200 lg:block" />

          <LifecycleStep number="01" icon="🛒" title="Start checkout" description="Customer opens checkout; frontend requests a session." delay={0} />
          <LifecycleStep number="02" icon="📦" title="Create session" description="Backend calls Adyen and returns session data." delay={100} />
          <LifecycleStep number="03" icon="💳" title="Mount Drop-in" description="Frontend initializes Drop-in; customer selects a payment method." delay={200} />
          <LifecycleStep number="04" icon="🔐" title="Submit & process" description="Adyen processes the payment and may request 3DS authentication." delay={300} />
          <LifecycleStep number="05" icon="✅" title="Show result" description="Frontend presents the result; backend reconciles payment state using verified webhooks." delay={400} />
        </div>

        <Reveal delay={450} className="mt-8">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 md:p-6">
            <p className="text-sm leading-7 text-slate-700"><span className="font-bold text-slate-900">Webhook is asynchronous:</span> Adyen notifies your backend separately. Your backend verifies the event and updates the order; React only sees that update if it fetches the latest status or receives a separate push notification.</p>
          </div>
        </Reveal>
      </section>

      {/* =========================================================
          PAYMENT METHODS IN DROP-IN
      ========================================================= */}

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionTitle
            eyebrow="06 — Payment methods"
            title="How payment options appear in Drop-in"
            description="Drop-in is a configurable payment interface, not a fixed list of every payment method Adyen supports. It displays the methods that are enabled for the merchant and eligible for the shopper's checkout context."
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "💳", title: "Cards", examples: "Visa, Mastercard, American Express", text: "The shopper enters card details in the card form. Depending on the transaction and issuer, additional authentication such as 3D Secure may be required." },
              { icon: "📱", title: "Digital wallets", examples: "Apple Pay, Google Pay", text: "When supported and eligible, a wallet option can appear so the shopper can pay using a wallet and its available credentials. Device, browser, domain, and configuration requirements can apply." },
              { icon: "🏦", title: "Bank-based methods", examples: "Bank redirects, online banking, bank transfers", text: "The shopper may be redirected to their bank or follow a bank-specific flow to authorize or complete payment. Availability and confirmation timing vary by method." },
              { icon: "🛍️", title: "Buy now, pay later", examples: "Pay-later providers where supported", text: "Eligible shoppers may be offered a pay-later option. The provider may collect additional information or make an eligibility decision during checkout." },
              { icon: "🌍", title: "Local payment methods", examples: "Methods popular in a shopper's country or region", text: "Local methods can make checkout more familiar. The options depend on the markets, currencies, and payment methods the merchant has enabled." },
              { icon: "🔁", title: "Stored details / recurring", examples: "Saved payment details when configured", text: "If the merchant has implemented and configured stored payment details or recurring payments, returning shoppers may be able to use an eligible saved method." },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
                <div className="group h-full rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-xl">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110">{item.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">{item.examples}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={250} className="mt-8">
            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-7 text-white md:p-8">
              <h3 className="text-xl font-bold">Why does one shopper see different options from another?</h3>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">The available list can depend on the merchant's Adyen configuration and enabled payment methods, shopper country or region, transaction currency and amount, device/browser capabilities, and method-specific eligibility rules. Drop-in presents eligible configured methods; it does not automatically enable every method in Adyen's catalogue.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Merchant setup", "Methods enabled in the account"],
                  ["Shopper location", "Country or region"],
                  ["Transaction", "Currency and amount"],
                  ["Eligibility", "Device, browser, and method rules"],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <div className="text-sm font-bold text-white">{title}</div>
                    <div className="mt-1 text-xs leading-5 text-slate-400">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={300} className="mt-6">
            <p className="text-sm leading-7 text-slate-500"><span className="font-semibold text-slate-700">Implementation takeaway:</span> configure the methods you want to offer in Adyen, provide the relevant shopper and transaction context, and test the checkout across target countries, currencies, devices, and browsers. The examples above are illustrative; the exact methods depend on your account and integration configuration.</p>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          WEBHOOKS
      ========================================================= */}

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionTitle
            eyebrow="07 — Webhooks"
            title="The backend should trust verified events"
            description="The frontend is responsible for the user experience. Your backend should use verified webhook events to update the actual business state."
          />

          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl border border-slate-200 bg-slate-50 p-8 transition-all duration-500 hover:shadow-xl">
                <div className="mb-5 text-3xl">🔔</div>

                <h3 className="text-2xl font-bold">
                  Why webhooks matter
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  The browser can lose connectivity, the customer can close
                  the page, or an authentication process can continue after
                  the original request. A webhook gives the backend a reliable
                  asynchronous notification of the payment state.
                </p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="h-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-xl">
                <div className="mb-5 text-3xl">🛡️</div>

                <h3 className="text-2xl font-bold">
                  Recommended flow
                </h3>

                <div className="mt-6 space-y-3">
                  {[
                    "Receive webhook",
                    "Verify authenticity",
                    "Check event type",
                    "Update order/payment state",
                    "Return successful response",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition-all duration-300 hover:translate-x-2"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                        {index + 1}
                      </div>

                      <span className="text-sm font-medium text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================
          CUSTOMER-FACING ERROR HANDLING
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <SectionTitle
          eyebrow="08 — Handling payment issues"
          title="Help customers recover from common payment issues"
          description="A smooth checkout experience does more than handle successful payments. It gives customers clear guidance when something goes wrong and helps them understand what to do next."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              icon: "💳",
              title: "Payment declined",
              message:
                "Your payment couldn't be completed. Please try another payment method.",
              takeaway:
                "Treat this as a payment outcome, not necessarily a technical error. Let the customer retry or choose another method where appropriate.",
              label: "Payment outcome",
              labelClass: "bg-amber-50 text-amber-700",
            },
            {
              icon: "📡",
              title: "Network interruption",
              message:
                "We couldn't confirm your payment status. Please check before trying again.",
              takeaway:
                "A timeout doesn't prove the payment failed. Check the payment status before starting another attempt to avoid duplicate payments.",
              label: "Check status first",
              labelClass: "bg-orange-50 text-orange-700",
            },
            {
              icon: "🔐",
              title: "Additional authentication",
              message:
                "Please verify your payment with your bank to continue.",
              takeaway:
                "Drop-in can present additional authentication, such as 3D Secure, when required. Explain the step clearly and allow the payment flow to complete.",
              label: "Authentication",
              labelClass: "bg-indigo-50 text-indigo-700",
            },
            {
              icon: "📝",
              title: "Invalid payment details",
              message:
                "Please check your card details and try again.",
              takeaway:
                "Use clear, actionable validation messages so customers know what to correct without having to restart checkout unnecessarily.",
              label: "Input validation",
              labelClass: "bg-blue-50 text-blue-700",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 100}>
              <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-indigo-100 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-2xl transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${item.labelClass}`}
                  >
                    {item.label}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>

                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Example customer message
                  </div>
                  <p className="text-sm leading-6 text-slate-700">
                    “{item.message}”
                  </p>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  <span className="font-semibold text-slate-800">Demo takeaway: </span>
                  {item.takeaway}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={250} className="mt-8">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-6 md:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                💡
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  The principle to communicate
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Drop-in handles much of the payment UI and payment-method interaction. Our application still needs to provide helpful messaging, distinguish a declined payment from an uncertain result, and avoid telling customers a payment succeeded until the result is confirmed.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================================================
          SECURITY & COMPLIANCE
      ========================================================= */}

      <section className="relative overflow-hidden bg-slate-950 py-28 text-white">
        {/* Background effects */}
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl animate-pulse-soft" />

        <div
          className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl animate-float-slow"
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

          <Reveal>
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
                  09 — Security & compliance
                </div>

                <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                  Security isn't an afterthought at Adyen.
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-400">
                  Adyen operates payment infrastructure under a security and
                  compliance framework designed specifically for handling
                  highly sensitive financial information.
                </p>
              </div>

              <div className="animate-shield flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 text-5xl">
                🛡️
              </div>
            </div>
          </Reveal>

          {/* Security credentials */}
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <SecurityCard
              icon="🏅"
              title="PCI DSS Level 1"
              description="Adyen is PCI DSS v4.0.1 Level 1 compliant, with compliance assessed annually by an independent Qualified Security Assessor."
              delay={0}
            />

            <SecurityCard
              icon="📋"
              title="SOC 2 Type 2"
              description="Adyen undergoes annual independent auditing of controls covering security, availability, confidentiality, and privacy."
              delay={100}
            />

            <SecurityCard
              icon="🌐"
              title="ISO 27001"
              description="Adyen maintains ISO 27001 certification, demonstrating a formal information-security management framework."
              delay={200}
            />

            <SecurityCard
              icon="🔑"
              title="Access controls"
              description="Administrative access to production systems is restricted to approved personnel under privilege-management controls."
              delay={300}
            />

          </div>

          {/* Data protection */}
          <Reveal delay={350} className="mt-8">
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
              <div className="border-b border-slate-800 px-7 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                    🔐
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      How Adyen protects payment data
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Security is built into the payment flow itself.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3">
                {[
                  {
                    title: "Encrypted communication",
                    text: "Adyen uses TLS to protect communications between merchant systems and the Adyen platform.",
                  },
                  {
                    title: "Encrypted payment data",
                    text: "With encrypted payment integrations such as Drop-in, sensitive card data is encrypted in the shopper's browser before reaching the merchant's systems.",
                  },
                  {
                    title: "Tokenization",
                    text: "Adyen can replace sensitive payment details with tokens, reducing exposure to raw card data and helping reduce PCI DSS scope.",
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className={`
                      p-7
                      transition-all duration-500
                      hover:bg-slate-800/60
                      ${index !== 2 ? "border-b md:border-b-0 md:border-r border-slate-800" : ""}
                    `}
                  >
                    <div className="mb-3 text-sm font-bold text-indigo-400">
                      0{index + 1}
                    </div>

                    <h4 className="font-bold text-white">
                      {item.title}
                    </h4>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* PCI scope */}
          <Reveal delay={450} className="mt-8">
            <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-transparent p-8">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">

                <div>
                  <div className="mb-3 text-sm font-bold uppercase tracking-wider text-indigo-400">
                    Why this matters to the merchant
                  </div>

                  <h3 className="text-2xl font-bold">
                    Drop-in can significantly reduce the merchant's PCI
                    exposure.
                  </h3>

                  <p className="mt-4 leading-7 text-slate-400">
                    With the appropriate Drop-in integration, the merchant
                    does not need to handle raw, unencrypted card data.
                    Adyen's encrypted payment components handle the sensitive
                    card-data flow, helping reduce the merchant's PCI DSS
                    scope.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      Merchant application
                    </span>

                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                      Reduced exposure
                    </span>
                  </div>

                  <div className="my-5 h-px bg-slate-800" />

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                      🖥️
                    </div>

                    <div className="h-px flex-1 bg-gradient-to-r from-indigo-500 to-transparent" />

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-xl">
                      🔐
                    </div>

                    <div className="h-px flex-1 bg-gradient-to-r from-indigo-500 to-transparent" />

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                      💳
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between text-xs text-slate-500">
                    <span>Merchant</span>
                    <span>Encrypted flow</span>
                    <span>Adyen</span>
                  </div>
                </div>

              </div>
            </div>
          </Reveal>

          {/* Shared responsibility */}
          <Reveal delay={550} className="mt-8">
            <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-7">
              <div className="flex gap-4">
                <div className="text-2xl">⚠️</div>

                <div>
                  <h3 className="font-bold text-white">
                    Important: security is still a shared responsibility
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    Adyen's security controls do not eliminate the merchant's
                    responsibilities. The merchant still needs to secure its
                    own website, servers, credentials, integrations, and
                    payment-page environment. The exact PCI DSS obligations
                    depend on the integration and environment.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      {/* =========================================================
          PRODUCTION CHECKLIST
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <SectionTitle
          eyebrow="10 — Production readiness"
          title="Before going live"
          description="The integration is more than simply getting Drop-in to render. These are the areas I would validate before production."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {[
            "Production API and client keys configured",
            "Production allowed origins and HTTPS verified",
            "Webhook endpoint configured and signatures verified",
            "Payment states, declines, and errors handled",
            "3D Secure and key payment flows tested",
            "Monitoring, logging, and alerts enabled",
          ].map((item, index) => (
            <CheckItem key={item} delay={index * 60}>
              {item}
            </CheckItem>
          ))}
        </div>
      </section>

      {/* =========================================================
          SUMMARY
      ========================================================= */}

      <section className="relative overflow-hidden bg-white py-24">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500" />

        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <Reveal>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-4xl shadow-sm animate-float">
              💳
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              The key architectural principle
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-xl leading-9 text-slate-600">
              Keep the responsibilities clear:
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Frontend", "Customer experience"],
              ["Backend", "Business logic & credentials"],
              ["Adyen", "Payment processing"],
            ].map(([title, text], index) => (
              <Reveal key={title} delay={index * 120}>
                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                  <div className="text-lg font-bold text-indigo-600">
                    {title}
                  </div>

                  <div className="mt-2 text-sm text-slate-600">{text}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <p className="mx-auto mt-12 max-w-2xl text-sm leading-7 text-slate-500">
              This separation makes the integration easier to secure, test,
              monitor, troubleshoot, and evolve as payment requirements grow.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

