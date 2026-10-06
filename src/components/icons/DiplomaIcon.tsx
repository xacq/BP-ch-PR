import type { SVGProps } from "react";

/**
 * Icon set for the "Professionelle Qualifikationen" cards on /ueber-andrea.
 *
 * The CMS only stores the KEY in `Diploma.icon` (VarChar(16)); the artwork lives
 * here so the icons stay inside the monochrome brand system instead of being
 * emojis. Monoline strokes on a 24x24 grid, rendered with `currentColor`.
 *
 * This module is plain data + JSX (no hooks, no server-only imports), so both
 * the public server components and the "use client" admin picker can import it.
 */

type IconDef = {
  /** German label shown in the admin icon picker. */
  label: string;
  /** SVG path definitions, drawn as strokes. */
  paths: string[];
};

export const DIPLOMA_ICONS = {
  cosmetics: {
    label: "Kosmetik",
    paths: [
      "M4.25 5.5h15.5v3.25H4.25z",
      "M5.75 8.75V17a3.25 3.25 0 0 0 3.25 3.25h6A3.25 3.25 0 0 0 18.25 17V8.75",
      "M12 12.25v3.5M10.25 14h3.5",
    ],
  },
  permanent: {
    label: "Permanent Make-up",
    paths: ["M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2.5 22l1.5-5L17 3Z", "M15 5l4 4"],
  },
  massage: {
    label: "Massage",
    paths: [
      "M9 12.5V6a1.5 1.5 0 0 1 3 0v5",
      "M12 11V5a1.5 1.5 0 0 1 3 0v6",
      "M15 11.5V7.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-12 0v-3a1.5 1.5 0 0 1 3 0v1.5",
    ],
  },
  bamboo: {
    label: "Bambus",
    paths: [
      "M12 21V5",
      "M9.5 10h5M9.5 15h5",
      "M12 10c0-3 2-5 5-5 0 3-2 5-5 5Z",
      "M12 15c0-2.5-1.7-4-4-4 0 2.5 1.7 4 4 4Z",
    ],
  },
  hotstone: {
    label: "Hot Stone",
    paths: [
      "M12 15.5c3.87 0 7 1.12 7 2.5s-3.13 2.5-7 2.5-7-1.12-7-2.5 3.13-2.5 7-2.5Z",
      "M12 11c3.04 0 5.5.9 5.5 2s-2.46 2-5.5 2-5.5-.9-5.5-2 2.46-2 5.5-2Z",
      "M12 7c2.21 0 4 .78 4 1.75S14.21 10.5 12 10.5 8 9.72 8 8.75 9.79 7 12 7Z",
    ],
  },
  nails: {
    label: "Nagelpflege",
    paths: [
      "M10 2.5h4v4h-4z",
      "M12 6.5v2",
      "M8.5 11.5a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v8a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 8.5 19.5v-8Z",
    ],
  },
  honey: {
    label: "Bienen / Honig",
    paths: [
      "M12 2.5 19.5 6.75v8.5L12 19.5 4.5 15.25v-8.5L12 2.5Z",
      "M12 9c1.6 1.8 2.5 3.1 2.5 4.1a2.5 2.5 0 0 1-5 0c0-1 .9-2.3 2.5-4.1Z",
    ],
  },
  sparkle: {
    label: "Allgemein",
    paths: ["M12 3c0 4.5 1.5 6 6 6-4.5 0-6 1.5-6 6 0-4.5-1.5-6-6-6 4.5 0 6-1.5 6-6Z"],
  },
} as const satisfies Record<string, IconDef>;

export type DiplomaIconName = keyof typeof DIPLOMA_ICONS;

export const DIPLOMA_ICON_NAMES = Object.keys(DIPLOMA_ICONS) as DiplomaIconName[];

const FALLBACK: DiplomaIconName = "sparkle";

/** Narrows an arbitrary CMS string to a known icon key, falling back to the generic one. */
export function resolveDiplomaIcon(name: string): DiplomaIconName {
  return name in DIPLOMA_ICONS ? (name as DiplomaIconName) : FALLBACK;
}

export default function DiplomaIcon({
  name,
  ...props
}: { name: string } & Omit<SVGProps<SVGSVGElement>, "name">) {
  const icon = DIPLOMA_ICONS[resolveDiplomaIcon(name)];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {icon.paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
