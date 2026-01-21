export default function Tooltip({ label, children }) {
  return (
    <div className="relative group inline-flex">
      {children}

      <div
        className="
          pointer-events-none
          absolute left-full top-1/2 ml-3 -translate-y-1/2
          whitespace-nowrap
          rounded-md bg-gray-900 px-3 py-1.5
          text-xs text-white
          opacity-0
          transition-opacity duration-150
          group-hover:opacity-100
        "
      >
        {label}
      </div>
    </div>
  );
}
