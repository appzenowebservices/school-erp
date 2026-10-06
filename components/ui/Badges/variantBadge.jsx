export default function VariantBadge({ label, price, active = false, onClick, disabled = false }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium 
          transition-all duration-200 border select-none
          rounded-lg
          ${disabled 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : active
              ? "bg-accent text-white border-accent ring-2 ring-accent/40 shadow-sm"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:shadow-sm cursor-pointer"
          }
        `}
      >
        <span>{label}</span>
        <span className="text-xs font-semibold opacity-80">₹{price}</span>
      </button>
    );
  }
  