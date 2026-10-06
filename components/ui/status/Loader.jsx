import Image from 'next/image';

const Loader = () => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" // Increased opacity, added backdrop-blur
            aria-live="polite" // Announce changes to screen readers
            role="status" // Indicate status update for accessibility
        >
            <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center space-y-4 border border-gray-100"> {/* Rounded corners, more padding, stronger shadow, subtle border */}
                <Image
                    src="/logo/logo.png"
                    alt="Loading content, please wait..." // More descriptive alt text
                    width={80} // Slightly larger logo
                    height={80} // Slightly larger logo
                    className="animate-pulse" // Changed to pulse animation for a softer look
                    priority // Prioritize loading of the logo image
                />
                <p className="text-gray-700 text-lg font-medium tracking-wide">
                    Loading
                    <span className="animate-dots">...</span> {/* Custom animation for dots */}
                </p>
            </div>

            {/* Custom CSS for dots animation (can be added in global.css or a style tag if needed) */}
            <style jsx global>{`
                @keyframes dots {
                    0%, 20% {
                        color: rgba(107, 114, 128, 0.2); /* gray-400 */
                    }
                    40% {
                        color: rgba(107, 114, 128, 1); /* gray-700 */
                    }
                    100% {
                        color: rgba(107, 114, 128, 0.2);
                    }
                }
                .animate-dots span:nth-child(1) {
                    animation: dots 1s infinite steps(1);
                }
                .animate-dots span:nth-child(2) {
                    animation: dots 1s infinite steps(1) 0.1s;
                }
                .animate-dots span:nth-child(3) {
                    animation: dots 1s infinite steps(1) 0.2s;
                }
            `}</style>
        </div>
    );
};

export default Loader;