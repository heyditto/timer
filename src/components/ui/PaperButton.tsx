import type { ButtonHTMLAttributes } from "react";
import "./PaperButton.css";

type PaperButtonVariant = "primary" | "secondary" | "ghost";

interface PaperButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PaperButtonVariant;
}

/** A layered-paper styled button used across the timer controls. */
export const PaperButton = ({
  variant = "secondary",
  className,
  type = "button",
  ...props
}: PaperButtonProps) => {
  const classes = ["paper-button", `paper-button--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return <button type={type} className={classes} {...props} />;
};
