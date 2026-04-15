import React from "react";

interface GlassyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "subtle" | "medium" | "strong";
  hover?: boolean;
}

export const GlassyCard = React.forwardRef<HTMLDivElement, GlassyCardProps>(
  ({ children, variant = "medium", hover = true, className = "", ...props }, ref) => {
    const variants = {
      subtle: "bg-white/10 backdrop-blur-md border border-white/20",
      medium: "bg-white/15 backdrop-blur-lg border border-white/30",
      strong: "bg-white/20 backdrop-blur-xl border border-white/40",
    };

    return (
      <div
        ref={ref}
        className={`${variants[variant]} ${
          hover
            ? "transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:shadow-xl hover:scale-[1.02]"
            : ""
        } rounded-2xl shadow-2xl p-6 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassyCard.displayName = "GlassyCard";

interface GlassyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const GlassyButton = React.forwardRef<
  HTMLButtonElement,
  GlassyButtonProps
>(({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/50",
    secondary:
      "bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 hover:border-white/40",
    outline:
      "border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      ref={ref}
      className={`${variants[variant]} ${sizes[size]} rounded-xl font-semibold transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

GlassyButton.displayName = "GlassyButton";

interface NeomorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "raised" | "pressed" | "flat";
}

export const NeomorphicButton = React.forwardRef<
  HTMLButtonElement,
  NeomorphicButtonProps
>(({ variant = "raised", className = "", children, ...props }, ref) => {
  const variants = {
    raised:
      "bg-gradient-to-br from-white via-gray-100 to-gray-200 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.7)]",
    pressed:
      "bg-gradient-to-br from-gray-100 to-gray-200 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.1),inset_-8px_-8px_16px_rgba(255,255,255,0.7)]",
    flat: "bg-gradient-to-br from-gray-100 to-gray-150 shadow-none hover:from-gray-200 hover:to-gray-300",
  };

  return (
    <button
      ref={ref}
      className={`${variants[variant]} px-6 py-3 rounded-2xl font-semibold text-gray-800 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

NeomorphicButton.displayName = "NeomorphicButton";

interface GlassyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const GlassyInput = React.forwardRef<HTMLInputElement, GlassyInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-white font-medium mb-2 text-sm">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:bg-white/20 focus:border-white/40 focus:ring-2 focus:ring-blue-400/50 ${className}`}
          {...props}
        />
        {error && <span className="text-red-400 text-sm mt-1 block">{error}</span>}
      </div>
    );
  }
);

GlassyInput.displayName = "GlassyInput";

interface GlassySelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const GlassySelect = React.forwardRef<HTMLSelectElement, GlassySelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-white font-medium mb-2 text-sm">{label}</label>
        )}
        <select
          ref={ref}
          className={`w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white transition-all duration-300 focus:outline-none focus:bg-white/20 focus:border-white/40 focus:ring-2 focus:ring-blue-400/50 ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-red-400 text-sm mt-1 block">{error}</span>}
      </div>
    );
  }
);

GlassySelect.displayName = "GlassySelect";

interface AnimatedBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info";
  animate?: boolean;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  children,
  variant = "info",
  animate = true,
}) => {
  const variants = {
    success: "bg-green-500/20 text-green-300 border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    error: "bg-red-500/20 text-red-300 border-red-500/30",
    info: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  };

  return (
    <span
      className={`${variants[variant]} ${
        animate ? "animate-pulse" : ""
      } border px-3 py-1 rounded-full text-sm font-medium inline-block`}
    >
      {children}
    </span>
  );
};

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <GlassyCard variant="strong" className="relative z-10 max-w-2xl w-full mx-4 animate-in fade-in scale-in duration-300">
        <div className="flex justify-between items-center mb-6">
          {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </GlassyCard>
    </div>
  );
};
