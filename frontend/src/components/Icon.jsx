const paths = {
  heart: "M12 21s-7-4.4-9.3-8.6C1 9.1 2.6 5.5 6 5.5c2 0 3.4 1.1 4.2 2.4h3.6c.8-1.3 2.2-2.4 4.2-2.4 3.4 0 5 3.6 3.3 6.9C19 16.6 12 21 12 21z",
  cart: "M3 4h2l2.4 11h10.2l2-8H6.2M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  spinner: "M12 3a9 9 0 109 9",
};

export default function Icon({ name, size = 18, filled = false, className = "" }) {
  return (
    <svg
      className={`icon ${name === "spinner" ? "spin" : ""} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
