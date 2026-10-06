import type { SVGProps } from "react";

/**
 * North-east arrow used on every "go there" button and link.
 *
 * It replaces the literal "↗" (U+2197): that character has an emoji
 * presentation variant, so iOS and Android fell back to the colour emoji font
 * and the arrow showed up as a blue emoji tile on mobile. Same monoline 24x24
 * grid and `currentColor` stroke as DiplomaIcon.
 */
export default function ArrowUpRight({
  className = "h-3.5 w-3.5",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}
