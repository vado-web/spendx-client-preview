"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Fingerprint,
  Headphones,
  History,
  House,
  Layers,
  LockKeyhole,
  LogOut,
  Mail,
  Plus,
  ScanFace,
  Send,
  Settings,
  ShieldCheck,
  Snowflake,
  Sparkles,
  User,
  WalletCards,
  X,
} from "lucide-react";
import {
  type CSSProperties,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type Screen =
  | "welcome"
  | "signup"
  | "kyc"
  | "catalog"
  | "product"
  | "payment"
  | "tracking"
  | "card"
  | "profile";

type Sheet = "topup" | "send" | "history" | "settings" | null;

type Plan = {
  code: string;
  name: string;
  image: string;
  issueFee: string;
  dailyLimit: string;
  monthlyLimit: string;
  topupFee: string;
  tone: string;
  wallet: string;
};

const plans: Plan[] = [
  {
    code: "essential",
    name: "Essential",
    image: "/brand/card-essential.png",
    issueFee: "$25",
    dailyLimit: "$2,500",
    monthlyLimit: "$75,000",
    topupFee: "3.5%",
    tone: "Ice",
    wallet: "Apple Pay & Google Pay",
  },
  {
    code: "plus",
    name: "Plus",
    image: "/brand/card-plus.png",
    issueFee: "$35",
    dailyLimit: "$5,000",
    monthlyLimit: "$150,000",
    topupFee: "3.0%",
    tone: "Blue",
    wallet: "Apple Pay & Google Pay",
  },
  {
    code: "prime",
    name: "Prime",
    image: "/brand/card-prime.png",
    issueFee: "$75",
    dailyLimit: "$20,000",
    monthlyLimit: "$600,000",
    topupFee: "2.5%",
    tone: "Silver",
    wallet: "Apple Pay & Google Pay",
  },
  {
    code: "supreme",
    name: "Supreme",
    image: "/brand/card-supreme.png",
    issueFee: "$150",
    dailyLimit: "$100,000",
    monthlyLimit: "$3,000,000",
    topupFee: "2.0%",
    tone: "Black",
    wallet: "Apple Pay & Google Pay",
  },
  {
    code: "business",
    name: "Business",
    image: "/brand/card-business.png",
    issueFee: "$150",
    dailyLimit: "$100,000",
    monthlyLimit: "$3,000,000",
    topupFee: "2.0%",
    tone: "Black",
    wallet: "Google Pay",
  },
];

function SpendXCard({
  plan,
  className = "",
}: {
  plan: Plan;
  className?: string;
}) {
  return (
    <div
      aria-label={`SpendX ${plan.name} card`}
      className={`spendx-card spendx-card--${plan.code} ${className}`}
      role="img"
    >
      <span aria-hidden="true" className="spendx-card__circuit" />
      <span className="spendx-card__brand">
        <Image
          alt=""
          height={158}
          src="/brand/spendx-logo.png"
          unoptimized
          width={570}
        />
      </span>
      <span aria-hidden="true" className="spendx-card__chip">
        <i />
        <i />
        <i />
      </span>
      <strong className="spendx-card__plan">{plan.name}</strong>
      <span aria-hidden="true" className="spendx-card__shine" />
    </div>
  );
}

const backMap: Partial<Record<Screen, Screen>> = {
  signup: "welcome",
  kyc: "signup",
  catalog: "welcome",
  product: "catalog",
  payment: "product",
  tracking: "catalog",
  card: "tracking",
  profile: "catalog",
};

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "brand-mark brand-mark--compact" : "brand-mark"}>
      <Image
        alt="SpendX"
        height={158}
        priority
        src="/brand/spendx-logo.png"
        unoptimized
        width={570}
      />
    </span>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div aria-label={`Step ${step} of 3`} className="progress-bar">
      {[1, 2, 3].map((item) => (
        <span
          className={
            item <= step
              ? "progress-bar__item is-active"
              : "progress-bar__item"
          }
          key={item}
        />
      ))}
    </div>
  );
}

function ScreenHeader({
  label,
  onBack,
  trailing,
}: {
  label: string;
  onBack?: () => void;
  trailing?: ReactNode;
}) {
  return (
    <header className="screen-header">
      {onBack ? (
        <button
          aria-label="Go back"
          className="icon-button icon-button--ghost"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft size={21} strokeWidth={2.1} />
        </button>
      ) : (
        <BrandMark compact />
      )}
      <span className="screen-header__title">{label}</span>
      <div className="screen-header__trailing">{trailing}</div>
    </header>
  );
}

function BottomNav({
  active,
  hasOrder,
  onNavigate,
}: {
  active: "explore" | "cards" | "profile";
  hasOrder: boolean;
  onNavigate: (screen: Screen) => void;
}) {
  const items = [
    {
      id: "explore",
      label: "Explore",
      icon: House,
      screen: "catalog" as Screen,
    },
    {
      id: "cards",
      label: "Cards",
      icon: CreditCard,
      screen: (hasOrder ? "tracking" : "catalog") as Screen,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      screen: "profile" as Screen,
    },
  ];

  return (
    <nav aria-label="Main navigation" className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const selected = active === item.id;
        return (
          <button
            aria-current={selected ? "page" : undefined}
            className={
              selected
                ? "bottom-nav__item is-active"
                : "bottom-nav__item"
            }
            key={item.id}
            onClick={() => onNavigate(item.screen)}
            type="button"
          >
            <Icon size={20} strokeWidth={selected ? 2.4 : 1.9} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function WelcomeScreen({
  onCreate,
  onExplore,
}: {
  onCreate: () => void;
  onExplore: () => void;
}) {
  return (
    <section className="screen screen--welcome" data-testid="welcome-screen">
      <div className="welcome-orbit welcome-orbit--one" />
      <div className="welcome-orbit welcome-orbit--two" />
      <header className="welcome-header">
        <BrandMark />
        <button
          aria-label="Notifications"
          className="icon-button icon-button--glass"
          type="button"
        >
          <Bell size={19} />
        </button>
      </header>

      <div aria-hidden="true" className="welcome-art">
        <div className="welcome-card welcome-card--back">
          <SpendXCard plan={plans[1]} />
        </div>
        <div className="welcome-card welcome-card--front">
          <SpendXCard plan={plans[3]} />
        </div>
        <span className="welcome-art__glow" />
      </div>

      <div className="welcome-copy">
        <span className="eyebrow eyebrow--light">
          <Sparkles size={14} />
          Crypto made spendable
        </span>
        <h1>
          One card.
          <br />
          One tap.
          <br />
          <em>Worldwide.</em>
        </h1>
        <p>
          Choose your plan, verify once and spend crypto wherever cards are
          accepted.
        </p>
      </div>

      <div className="welcome-actions">
        <button
          className="primary-button primary-button--light"
          onClick={onCreate}
          type="button"
        >
          Create account
          <ArrowRight size={19} />
        </button>
        <button
          className="text-button text-button--light"
          onClick={onExplore}
          type="button"
        >
          Explore cards
        </button>
      </div>
      <p className="demo-caption">Interactive concept · Demo data only</p>
    </section>
  );
}

function SignupScreen({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onContinue();
  };

  return (
    <section className="screen screen--light" data-testid="signup-screen">
      <ScreenHeader label="Create account" onBack={onBack} />
      <main className="screen-content auth-content">
        <ProgressBar step={1} />
        <div className="intro-block">
          <span className="eyebrow">Welcome to SpendX</span>
          <h2>Start with the essentials.</h2>
          <p>A secure account takes less than a minute to create.</p>
        </div>

        <form className="form-stack" onSubmit={submit}>
          <label className="field">
            <span>Full name</span>
            <div className="field__control">
              <User size={18} />
              <input defaultValue="Elena Novikova" required type="text" />
            </div>
          </label>
          <label className="field">
            <span>Email address</span>
            <div className="field__control">
              <Mail size={18} />
              <input
                defaultValue="elena@spendx.com"
                required
                type="email"
              />
            </div>
          </label>
          <label className="field">
            <span>Password</span>
            <div className="field__control">
              <LockKeyhole size={18} />
              <input
                defaultValue="spendx-demo"
                minLength={8}
                required
                type="password"
              />
            </div>
          </label>

          <div className="security-note">
            <ShieldCheck size={19} />
            <span>Your data is encrypted and protected.</span>
          </div>

          <button className="primary-button" type="submit">
            Continue
            <ArrowRight size={19} />
          </button>
        </form>
      </main>
    </section>
  );
}

function KycScreen({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <section className="screen screen--light" data-testid="kyc-screen">
      <ScreenHeader label="Identity check" onBack={onBack} />
      <main className="screen-content">
        <ProgressBar step={2} />
        <div className="intro-block">
          <span className="eyebrow">Verification</span>
          <h2>Unlock your SpendX card.</h2>
          <p>
            Complete a quick identity check to access available card plans.
          </p>
        </div>

        <div className="verification-visual">
          <span className="verification-visual__ring verification-visual__ring--one" />
          <span className="verification-visual__ring verification-visual__ring--two" />
          <span className="verification-visual__core">
            <ScanFace size={46} strokeWidth={1.45} />
          </span>
          <span className="verification-visual__badge">
            <Check size={15} strokeWidth={3} />
          </span>
        </div>

        <div className="checklist-card">
          <div>
            <span className="checklist-card__icon">
              <FileText size={19} />
            </span>
            <div>
              <strong>Identity document</strong>
              <small>Passport or national ID</small>
            </div>
            <CheckCircle2 className="checklist-card__check" size={20} />
          </div>
          <div>
            <span className="checklist-card__icon">
              <ScanFace size={19} />
            </span>
            <div>
              <strong>Face verification</strong>
              <small>A short secure scan</small>
            </div>
            <Clock className="checklist-card__muted" size={20} />
          </div>
        </div>

        <button
          className="primary-button"
          onClick={onContinue}
          type="button"
        >
          Start secure check
          <ArrowRight size={19} />
        </button>
        <p className="fine-print">
          Demo flow only. No document or personal data is uploaded.
        </p>
      </main>
    </section>
  );
}

function PlanStats({ plan }: { plan: Plan }) {
  return (
    <div className="plan-stats">
      <div>
        <span>Daily limit</span>
        <strong>{plan.dailyLimit}</strong>
      </div>
      <div>
        <span>Top-up fee</span>
        <strong>{plan.topupFee}</strong>
      </div>
      <div>
        <span>Monthly</span>
        <strong>{plan.monthlyLimit}</strong>
      </div>
    </div>
  );
}

function CatalogScreen({
  activeIndex,
  hasOrder,
  onOpenPlan,
  onSelect,
  onNavigate,
}: {
  activeIndex: number;
  hasOrder: boolean;
  onOpenPlan: () => void;
  onSelect: (index: number) => void;
  onNavigate: (screen: Screen) => void;
}) {
  const plan = plans[activeIndex] ?? plans[0];
  const pointerStart = useRef<number | null>(null);
  const dragLimit = useRef(320);
  const swipeThreshold = useRef(60);
  const lastDragX = useRef(0);
  const didDrag = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const wrapCardIndex = (index: number) =>
    (index + plans.length) % plans.length;

  const selectCard = (index: number) => {
    if (index === activeIndex) return;
    onSelect(index);
  };

  const startGalleryGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStart.current = event.clientX;
    didDrag.current = false;
    setDragging(false);
    setDragX(0);
    lastDragX.current = 0;
    dragLimit.current = event.currentTarget.clientWidth * 1.02;
    swipeThreshold.current = Math.min(86, event.currentTarget.clientWidth * 0.17);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveGalleryGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const delta = event.clientX - pointerStart.current;
    if (Math.abs(delta) > 6) {
      didDrag.current = true;
      setDragging(true);
    }
    const nextDragX = Math.max(
      -dragLimit.current,
      Math.min(dragLimit.current, delta),
    );
    lastDragX.current = nextDragX;
    setDragX(nextDragX);
  };

  const finishGalleryGesture = (delta: number, cancelled = false) => {
    if (pointerStart.current === null) return;

    if (!cancelled && Math.abs(delta) > swipeThreshold.current) {
      selectCard(
        delta < 0
          ? wrapCardIndex(activeIndex + 1)
          : wrapCardIndex(activeIndex - 1),
      );
    }

    pointerStart.current = null;
    lastDragX.current = 0;
    setDragX(0);
    setDragging(false);
    if (didDrag.current) {
      setTimeout(() => {
        didDrag.current = false;
      }, 0);
    }
  };

  return (
    <section className="screen screen--light" data-testid="catalog-screen">
      <ScreenHeader
        label="Explore cards"
        trailing={
          <button
            aria-label="Notifications"
            className="icon-button icon-button--ghost"
            type="button"
          >
            <Bell size={20} />
            <span className="notification-dot" />
          </button>
        }
      />
      <main className="screen-content catalog-content">
        <div className="catalog-intro">
          <span className="eyebrow">Find your card</span>
          <h2>Made for the way you spend.</h2>
          <p>Five plans. Clear limits. One global payment experience.</p>
        </div>

        <div aria-label="Card plans" className="plan-tabs" role="tablist">
          {plans.map((item, index) => (
            <button
              aria-selected={index === activeIndex}
              className={index === activeIndex ? "plan-tab is-active" : "plan-tab"}
              key={item.code}
              onClick={() => selectCard(index)}
              role="tab"
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="card-stage">
          <div
            aria-label="Card gallery. Swipe to browse."
            className={`card-gallery${dragging ? " is-dragging" : ""}${
              dragging && dragX < 0
                ? " is-dragging-next"
                : dragging && dragX > 0
                  ? " is-dragging-previous"
                  : ""
            }`}
            onContextMenu={(event) => event.preventDefault()}
            onLostPointerCapture={() =>
              finishGalleryGesture(lastDragX.current)
            }
            onPointerCancel={() =>
              finishGalleryGesture(lastDragX.current, true)
            }
            onPointerDown={startGalleryGesture}
            onPointerMove={moveGalleryGesture}
            onPointerUp={(event) =>
              finishGalleryGesture(
                pointerStart.current === null
                  ? lastDragX.current
                  : event.clientX - pointerStart.current,
              )
            }
            style={{ "--drag-x": `${dragX}px` } as CSSProperties}
          >
            {plans.map((item, index) => {
              let offset = index - activeIndex;
              if (offset > plans.length / 2) offset -= plans.length;
              if (offset < -plans.length / 2) offset += plans.length;
              const position =
                offset === 0
                  ? "active"
                  : offset === -1
                    ? "previous"
                    : offset === 1
                      ? "next"
                      : offset < 0
                        ? "far-previous"
                        : "far-next";
              return (
                <button
                  aria-current={offset === 0 ? "true" : undefined}
                  aria-label={
                    offset === 0
                      ? `Current ${item.name} card`
                      : `Select ${item.name} card`
                  }
                  className={`gallery-card gallery-card--${position}`}
                  key={item.code}
                  onClick={() => {
                    if (!didDrag.current && offset !== 0) selectCard(index);
                  }}
                  type="button"
                >
                  <SpendXCard plan={item} />
                </button>
              );
            })}
          </div>
          <div className="card-stage__controls">
            <button
              aria-label="Previous card"
              onClick={() => selectCard(wrapCardIndex(activeIndex - 1))}
              type="button"
            >
              <ArrowLeft size={18} />
            </button>
            <div
              aria-label={`${activeIndex + 1} of ${plans.length}`}
              className="card-dots"
            >
              {plans.map((item, index) => (
                <button
                  aria-label={`Select ${item.name}`}
                  className={
                    index === activeIndex ? "card-dot is-active" : "card-dot"
                  }
                  key={item.code}
                  onClick={() => selectCard(index)}
                  type="button"
                />
              ))}
            </div>
            <button
              aria-label="Next card"
              onClick={() => selectCard(wrapCardIndex(activeIndex + 1))}
              type="button"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="plan-summary">
          <div className="plan-summary__heading">
            <div>
              <span>{plan.tone} virtual card</span>
              <h3>SpendX {plan.name}</h3>
            </div>
            <div className="price-chip">
              <small>Issue fee</small>
              <strong>{plan.issueFee}</strong>
            </div>
          </div>
          <PlanStats plan={plan} />
          <button
            className="primary-button"
            onClick={onOpenPlan}
            type="button"
          >
            View plan
            <ChevronRight size={19} />
          </button>
        </div>

        <div className="trust-row">
          <span>
            <ShieldCheck size={17} />
            KYC protected
          </span>
          <span>
            <WalletCards size={17} />
            Crypto funded
          </span>
        </div>
      </main>
      <BottomNav active="explore" hasOrder={hasOrder} onNavigate={onNavigate} />
    </section>
  );
}

function ProductScreen({
  plan,
  onBack,
  onOrder,
}: {
  plan: Plan;
  onBack: () => void;
  onOrder: () => void;
}) {
  return (
    <section className="screen screen--light" data-testid="product-screen">
      <ScreenHeader
        label={`${plan.name} plan`}
        onBack={onBack}
        trailing={
          <button
            aria-label="Help"
            className="icon-button icon-button--ghost"
            type="button"
          >
            <Headphones size={20} />
          </button>
        }
      />
      <main className="screen-content product-content">
        <div className="product-hero">
          <span className="product-hero__glow" />
          <div className="product-hero__image">
            <SpendXCard plan={plan} />
            <span className="product-hero__badge">
              <BadgeCheck size={16} />
              Available
            </span>
          </div>
        </div>

        <div className="product-title">
          <div>
            <span className="eyebrow">{plan.tone} virtual card</span>
            <h2>SpendX {plan.name}</h2>
          </div>
          <div className="product-price">
            <strong>{plan.issueFee}</strong>
            <span>one-time</span>
          </div>
        </div>

        <PlanStats plan={plan} />

        <div className="benefit-list">
          <div>
            <span>
              <WalletCards size={19} />
            </span>
            <div>
              <strong>Global card payments</strong>
              <small>Online and offline wherever cards are accepted</small>
            </div>
          </div>
          <div>
            <span>
              <Fingerprint size={19} />
            </span>
            <div>
              <strong>Secure by design</strong>
              <small>Biometrics, instant freeze and private details</small>
            </div>
          </div>
          <div>
            <span>
              <CreditCard size={19} />
            </span>
            <div>
              <strong>{plan.wallet}</strong>
              <small>Add to your preferred mobile wallet</small>
            </div>
          </div>
        </div>

        <div className="order-total">
          <span>Due now</span>
          <p>Card issue fee only. Initial funding is handled separately.</p>
          <strong>{plan.issueFee}</strong>
        </div>

        <button className="primary-button" onClick={onOrder} type="button">
          Order {plan.name}
          <ArrowRight size={19} />
        </button>
      </main>
    </section>
  );
}

function PaymentScreen({
  plan,
  onBack,
  onPaid,
}: {
  plan: Plan;
  onBack: () => void;
  onPaid: () => void;
}) {
  const [chain, setChain] = useState("TRON");
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText("TDEMO9K3V8SPENDX3P8X");
    } finally {
      setCopied(true);
    }
  };

  return (
    <section className="screen screen--light" data-testid="payment-screen">
      <ScreenHeader label="Pay issue fee" onBack={onBack} />
      <main className="screen-content payment-content">
        <div className="payment-title">
          <span className="eyebrow">Order secured</span>
          <h2>Complete your payment.</h2>
          <p>Send the exact amount shown below using your preferred network.</p>
        </div>

        <div className="fee-receipt">
          <div className="fee-receipt__top">
            <span>SpendX {plan.name}</span>
            <span>Issue fee</span>
          </div>
          <strong>
            {plan.issueFee}
            <small> USDT</small>
          </strong>
          <div className="fee-receipt__line" />
          <div className="fee-receipt__meta">
            <span>
              <ShieldCheck size={16} /> Quote protected
            </span>
            <span>
              <Clock size={16} /> 48:32
            </span>
          </div>
        </div>

        <div className="choice-block">
          <span className="choice-block__label">Payment network</span>
          <div className="network-picker">
            {["TRON", "BSC", "SOLANA"].map((item) => (
              <button
                aria-pressed={chain === item}
                className={
                  chain === item ? "network-option is-active" : "network-option"
                }
                key={item}
                onClick={() => setChain(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="address-card">
          <div className="address-card__icon">
            <ScanFace size={28} />
            <small>DEMO</small>
          </div>
          <div className="address-card__copy">
            <span>{chain} deposit address</span>
            <strong>TDEMO9K3...3P8X</strong>
          </div>
          <button aria-label="Copy deposit address" onClick={copyAddress} type="button">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="payment-notice">
          <ShieldCheck size={18} />
          <p>
            Send only USDT on {chain}. This prototype never creates a real
            payment.
          </p>
        </div>

        <button className="primary-button" onClick={onPaid} type="button">
          Simulate payment
          <ArrowRight size={19} />
        </button>
      </main>
    </section>
  );
}

function TrackingScreen({
  plan,
  onBack,
  onPreviewCard,
  onNavigate,
}: {
  plan: Plan;
  onBack: () => void;
  onPreviewCard: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <section className="screen screen--light" data-testid="tracking-screen">
      <ScreenHeader
        label="Your order"
        onBack={onBack}
        trailing={
          <span className="status-pill status-pill--blue">
            <span />
            In progress
          </span>
        }
      />
      <main className="screen-content tracking-content">
        <div className="order-card">
          <div className="order-card__image">
            <SpendXCard plan={plan} />
          </div>
          <div className="order-card__details">
            <span>Order SX-24038</span>
            <strong>SpendX {plan.name}</strong>
            <small>Issue fee paid · {plan.issueFee}</small>
          </div>
          <span className="order-card__status" aria-label="Payment confirmed">
            <Check size={15} strokeWidth={3} />
          </span>
        </div>

        <div className="tracking-hero">
          <span className="tracking-hero__icon">
            <BadgeCheck size={34} />
          </span>
          <span className="eyebrow">Payment received</span>
          <h2>Your card is being prepared.</h2>
          <p>
            We’ll keep this screen updated as your order moves forward.
          </p>
        </div>

        <div className="journey">
          <div className="journey__item is-complete">
            <span className="journey__marker">
              <Check size={15} />
            </span>
            <div>
              <strong>Order created</strong>
              <small>Today, 12:42</small>
            </div>
          </div>
          <div className="journey__item is-complete">
            <span className="journey__marker">
              <Check size={15} />
            </span>
            <div>
              <strong>Issue fee received</strong>
              <small>Payment confirmed securely</small>
            </div>
          </div>
          <div className="journey__item is-current">
            <span className="journey__marker">
              <Clock size={15} />
            </span>
            <div>
              <strong>Card preparation</strong>
              <small>Provider setup in progress</small>
            </div>
          </div>
          <div className="journey__item">
            <span className="journey__marker">
              <CreditCard size={15} />
            </span>
            <div>
              <strong>Activation funding</strong>
              <small>Available after preparation</small>
            </div>
          </div>
        </div>

        <button
          className="secondary-button"
          onClick={onPreviewCard}
          type="button"
        >
          Preview issued card screen
          <ArrowRight size={18} />
        </button>
      </main>
      <BottomNav active="cards" hasOrder onNavigate={onNavigate} />
    </section>
  );
}

function QuickAction({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Plus;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={active ? "quick-action is-active" : "quick-action"}
      onClick={onClick}
      type="button"
    >
      <span>
        <Icon size={20} strokeWidth={2.2} />
      </span>
      <small>{label}</small>
    </button>
  );
}

function CardScreen({
  plan,
  onBack,
  onNavigate,
}: {
  plan: Plan;
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);

  return (
    <>
      <section className="screen screen--blue" data-testid="card-screen">
        <ScreenHeader
          label="Cards"
          onBack={onBack}
          trailing={
            <button className="header-link" type="button">
              <Plus size={18} />
              Add card
            </button>
          }
        />
        <main className="screen-content card-dashboard">
        <div className="card-dashboard__title">
          <span>Your virtual card</span>
          <h2>SpendX {plan.name}</h2>
        </div>

        <div className={frozen ? "managed-card is-frozen" : "managed-card"}>
          <SpendXCard plan={plan} />
          {frozen && (
            <span className="managed-card__frozen">
              <Snowflake size={18} />
              Frozen
            </span>
          )}
        </div>

        <div aria-label="Card 1 of 1" className="managed-dots">
          <span className="is-active" />
        </div>

        <div className="quick-actions">
          <QuickAction
            icon={CircleDollarSign}
            label="Top up"
            onClick={() => setSheet("topup")}
          />
          <QuickAction
            icon={Send}
            label="Send"
            onClick={() => setSheet("send")}
          />
          <QuickAction
            icon={History}
            label="History"
            onClick={() => setSheet("history")}
          />
          <QuickAction
            active={frozen}
            icon={Snowflake}
            label={frozen ? "Unfreeze" : "Freeze"}
            onClick={() => setFrozen((value) => !value)}
          />
          <QuickAction
            icon={Settings}
            label="Settings"
            onClick={() => setSheet("settings")}
          />
        </div>

        <div className="card-info">
          <div className="card-info__heading">
            <h3>Card information</h3>
            <button
              onClick={() => setDetailsVisible((value) => !value)}
              type="button"
            >
              {detailsVisible ? <EyeOff size={17} /> : <Eye size={17} />}
              {detailsVisible ? "Hide" : "Show details"}
            </button>
          </div>
          <dl>
            <div>
              <dt>Balance</dt>
              <dd>$0.00</dd>
            </div>
            <div>
              <dt>Card number</dt>
              <dd>
                {detailsVisible
                  ? "4242 9827 4100 9835"
                  : "•••• •••• •••• 9835"}
              </dd>
            </div>
            <div>
              <dt>Valid thru</dt>
              <dd>{detailsVisible ? "12/29" : "••/••"}</dd>
            </div>
            <div>
              <dt>CVV</dt>
              <dd>{detailsVisible ? "841" : "•••"}</dd>
            </div>
          </dl>
        </div>
        </main>
        {!sheet && <BottomNav active="cards" hasOrder onNavigate={onNavigate} />}
      </section>

      {sheet && (
        <div className="sheet-backdrop" role="presentation">
          <section aria-label={`${sheet} panel`} className="action-sheet">
            <div className="action-sheet__handle" />
            <button
              aria-label="Close panel"
              className="action-sheet__close"
              onClick={() => setSheet(null)}
              type="button"
            >
              <X size={20} />
            </button>
            {sheet === "topup" && (
              <>
                <span className="sheet-icon">
                  <CircleDollarSign size={25} />
                </span>
                <h3>Top up your card</h3>
                <p>Choose the amount you want to add after activation.</p>
                <div className="amount-field">
                  <small>Amount</small>
                  <strong>$500.00</strong>
                  <span>USD</span>
                </div>
                <button
                  className="primary-button"
                  onClick={() => setSheet(null)}
                  type="button"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              </>
            )}
            {sheet === "send" && (
              <>
                <span className="sheet-icon">
                  <Send size={25} />
                </span>
                <h3>Send funds</h3>
                <p>
                  Fast internal transfers will appear here when enabled for your
                  account.
                </p>
                <div className="coming-soon">
                  <LockKeyhole size={18} /> Available after activation
                </div>
              </>
            )}
            {sheet === "history" && (
              <>
                <span className="sheet-icon">
                  <History size={25} />
                </span>
                <h3>Recent activity</h3>
                <p>Your settled card activity will appear here.</p>
                <div className="empty-state">
                  <Clock size={24} />
                  <strong>No activity yet</strong>
                  <small>
                    Your new card is ready for its first transaction.
                  </small>
                </div>
              </>
            )}
            {sheet === "settings" && (
              <>
                <span className="sheet-icon">
                  <Settings size={25} />
                </span>
                <h3>Card settings</h3>
                <div className="settings-list">
                  <button type="button">
                    <span className="settings-list__leading">
                      <span className="settings-list__icon">
                        <Fingerprint size={19} />
                      </span>
                      <span className="settings-list__copy">
                        <strong>Biometric approval</strong>
                        <small>Confirm sensitive card actions</small>
                      </span>
                    </span>
                    <span className="toggle is-on" />
                  </button>
                  <button type="button">
                    <span className="settings-list__leading">
                      <span className="settings-list__icon">
                        <Bell size={19} />
                      </span>
                      <span className="settings-list__copy">
                        <strong>Payment alerts</strong>
                        <small>Instant updates for every payment</small>
                      </span>
                    </span>
                    <span className="toggle is-on" />
                  </button>
                  <button type="button">
                    <span className="settings-list__leading">
                      <span className="settings-list__icon">
                        <Layers size={19} />
                      </span>
                      <span className="settings-list__copy">
                        <strong>Spending limits</strong>
                        <small>Review card usage controls</small>
                      </span>
                    </span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}

function ProfileScreen({
  hasOrder,
  onNavigate,
}: {
  hasOrder: boolean;
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <section className="screen screen--light" data-testid="profile-screen">
      <ScreenHeader
        label="Profile"
        trailing={
          <button
            aria-label="Settings"
            className="icon-button icon-button--ghost"
            type="button"
          >
            <Settings size={20} />
          </button>
        }
      />
      <main className="screen-content profile-content">
        <div className="profile-hero">
          <span className="profile-avatar">EN</span>
          <div>
            <h2>Elena Novikova</h2>
            <p>elena@spendx.com</p>
          </div>
          <span className="status-pill status-pill--green">
            <Check size={13} />
            Verified
          </span>
        </div>

        <div className="profile-section">
          <span className="profile-section__label">Account</span>
          <div className="profile-list">
            <button type="button">
              <span className="profile-list__icon profile-list__icon--verified">
                <BadgeCheck size={20} />
              </span>
              <span className="profile-list__copy">
                <strong>Identity verification</strong>
                <small>Your identity check is complete</small>
              </span>
              <span className="profile-list__meta profile-list__meta--verified">
                Approved
              </span>
            </button>
            <button type="button">
              <span className="profile-list__icon">
                <ShieldCheck size={20} />
              </span>
              <span className="profile-list__copy">
                <strong>Security</strong>
                <small>Password, PIN and trusted devices</small>
              </span>
              <ChevronRight size={18} />
            </button>
            <button type="button">
              <span className="profile-list__icon">
                <Fingerprint size={20} />
              </span>
              <span className="profile-list__copy">
                <strong>Face ID</strong>
                <small>Approve access with biometrics</small>
              </span>
              <span className="toggle is-on" />
            </button>
          </div>
        </div>

        <div className="profile-section">
          <span className="profile-section__label">Support</span>
          <div className="profile-list">
            <button type="button">
              <span className="profile-list__icon">
                <Headphones size={20} />
              </span>
              <span className="profile-list__copy">
                <strong>Contact support</strong>
                <small>Get help from the SpendX team</small>
              </span>
              <ChevronRight size={18} />
            </button>
            <button type="button">
              <span className="profile-list__icon">
                <FileText size={20} />
              </span>
              <span className="profile-list__copy">
                <strong>Legal & privacy</strong>
                <small>Policies, terms and data controls</small>
              </span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={() => onNavigate("welcome")}
          type="button"
        >
          <LogOut size={18} />
          <span>Sign out of demo</span>
        </button>
      </main>
      <BottomNav active="profile" hasOrder={hasOrder} onNavigate={onNavigate} />
    </section>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [activePlanIndex, setActivePlanIndex] = useState(3);
  const [hasOrder, setHasOrder] = useState(false);
  const [orderedPlanIndex, setOrderedPlanIndex] = useState<number | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const activePlan = plans[activePlanIndex] ?? plans[3];
  const orderedPlan = plans[orderedPlanIndex ?? activePlanIndex] ?? plans[3];

  useEffect(() => {
    const currentScreen = frameRef.current?.querySelector<HTMLElement>(".screen");
    if (currentScreen) currentScreen.scrollTop = 0;
  }, [screen]);

  const navigate = (next: Screen) => {
    setScreen(next);
  };

  const goBack = () => navigate(backMap[screen] ?? "welcome");

  const completePayment = () => {
    setOrderedPlanIndex(activePlanIndex);
    setHasOrder(true);
    setScreen("tracking");
  };

  const previewScreens: Screen[] = [
    "welcome",
    "kyc",
    "catalog",
    "payment",
    "tracking",
    "card",
  ];

  return (
    <main className="preview-canvas">
      <div className="preview-aura preview-aura--left" />
      <div className="preview-aura preview-aura--right" />
      <aside aria-label="Concept information" className="preview-context">
        <BrandMark />
        <span className="preview-context__tag">Mobile experience concept</span>
        <h2>A clearer path from crypto to card.</h2>
        <p>
          Brand-aligned, focused and intentionally simple — with every major
          step available to explore.
        </p>
        <div className="preview-context__steps">
          {["Welcome", "Verify", "Choose", "Pay", "Track", "Manage"].map(
            (item, index) => (
              <button
                className={screen === previewScreens[index] ? "is-active" : ""}
                key={item}
                onClick={() => navigate(previewScreens[index] ?? "welcome")}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </button>
            ),
          )}
        </div>
      </aside>

      <div className="phone-shell">
        <div className="phone-shell__speaker" />
        <div className="phone-frame" ref={frameRef}>
          <div aria-hidden="true" className="status-bar">
            <span>9:41</span>
            <div>
              <span className="signal-bars">▮▮▮</span>
              <span>◉</span>
              <span className="battery">82</span>
            </div>
          </div>

          <div className="screen-transition" key={screen}>
            {screen === "welcome" && (
              <WelcomeScreen
                onCreate={() => navigate("signup")}
                onExplore={() => navigate("catalog")}
              />
            )}
            {screen === "signup" && (
              <SignupScreen
                onBack={goBack}
                onContinue={() => navigate("kyc")}
              />
            )}
            {screen === "kyc" && (
              <KycScreen
                onBack={goBack}
                onContinue={() => navigate("catalog")}
              />
            )}
            {screen === "catalog" && (
              <CatalogScreen
                activeIndex={activePlanIndex}
                hasOrder={hasOrder}
                onNavigate={navigate}
                onOpenPlan={() => navigate("product")}
                onSelect={setActivePlanIndex}
              />
            )}
            {screen === "product" && (
              <ProductScreen
                onBack={goBack}
                onOrder={() => navigate("payment")}
                plan={activePlan}
              />
            )}
            {screen === "payment" && (
              <PaymentScreen
                onBack={goBack}
                onPaid={completePayment}
                plan={activePlan}
              />
            )}
            {screen === "tracking" && (
              <TrackingScreen
                onBack={goBack}
                onNavigate={navigate}
                onPreviewCard={() => navigate("card")}
                plan={orderedPlan}
              />
            )}
            {screen === "card" && (
              <CardScreen
                onBack={goBack}
                onNavigate={navigate}
                plan={orderedPlan}
              />
            )}
            {screen === "profile" && (
              <ProfileScreen hasOrder={hasOrder} onNavigate={navigate} />
            )}
          </div>
        </div>
      </div>

      <div className="preview-footer-note">
        <span className={hasOrder ? "is-live" : ""} />
        {hasOrder ? "Demo order created" : "Interactive preview"}
      </div>
    </main>
  );
}
