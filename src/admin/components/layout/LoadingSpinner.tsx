// src/admin/components/LoadingSpinner.tsx
export default function LoadingSpinner({
    size = "md",
    className = "",
    inline = false
}: {
    size?: "sm" | "md" | "lg";
    className?: string;
    inline?: boolean;
}) {
    const sizeClasses = {
        sm: "h-4 w-4 border",
        md: "h-6 w-6 border-2",
        lg: "h-10 w-10 border-2",
    };

    const spinner = (
        <div
            className={`${sizeClasses[size]} border-purple-950/40 border-t-[#a356db] rounded-full animate-spin`}
        />
    );

    // If inline, return just the spinner without container
    if (inline) {
        return spinner;
    }

    // Otherwise, return spinner in a centered container
    return (
        <div className={`flex items-center justify-center min-h-screen ${className}`}>
            {spinner}
        </div>
    );
}