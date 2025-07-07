import React from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl";
  shadowLevel?: "none" | "sm" | "md" | "lg" | "xl";
  hoverEffect?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const shadowMap = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  width = "w-full",
  height = "h-auto",
  rounded = "xl",
  shadowLevel = "md",
  hoverEffect = true,
  className = "",
  children,
}) => {
  return (
    <div
      className={`bg-secondary/80 ${width} ${height} p-4 transition-all duration-200 ${shadowMap[shadowLevel]} ${hoverEffect ? "hover:scale-[1.02] hover:shadow-xl" : ""} rounded-${rounded} ${className}`}
    >
      {(icon || title || subtitle) && (
        <div className="flex items-center gap-3 mb-3">
          {icon && <div className="text-xl">{icon}</div>}
          <div>
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {subtitle && <p className="text-sm text-secondary-txt">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
