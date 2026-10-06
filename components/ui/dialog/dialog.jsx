
export function Dialog({ children, isOpen, className }) {
    return isOpen ? (
      <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${className}`}>
        {children}
      </div>
    ) : null;
  }
  
  export function DialogTrigger({ children, onClick }) {
    return <div onClick={onClick}>{children}</div>;
  }
  
  export function DialogContent({ children, className }) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-lg w-96 ${className}`}>{children}</div>
    );
  }
  
  export function DialogHeader({ children, className }) {
    return <div className={`text-xl font-semibold mb-4 ${className}`}>{children}</div>;
  }
  
  export function DialogTitle({ children, className }) {
    return <h2 className={`text-lg font-medium ${className}`}>{children}</h2>;
  }
  