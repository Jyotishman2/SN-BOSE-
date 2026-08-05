import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm text-slate-900 ${className}`}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;
