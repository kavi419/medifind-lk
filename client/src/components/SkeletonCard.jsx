import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="glass-card p-6 flex flex-col gap-4 bg-white/5 border border-white/10 animate-pulse rounded-xl">
            {/* Header: Icon + Title/Subtitle */}
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl" />
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-5 w-3/4 bg-white/10 rounded" />
                    <div className="h-3 w-1/2 bg-white/10 rounded" />
                </div>
            </div>

            <div className="h-px w-full bg-white/5 my-1" />

            {/* Content: Location + Price/Qty */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4 w-2/3 bg-white/10 rounded" />
                        <div className="h-3 w-1/2 bg-white/10 rounded" />
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="space-y-1">
                        <div className="h-2 w-8 bg-white/10 rounded" />
                        <div className="h-5 w-20 bg-white/10 rounded" />
                    </div>
                    <div className="space-y-1 flex flex-col items-end">
                        <div className="h-2 w-6 bg-white/10 rounded" />
                        <div className="h-5 w-10 bg-white/10 rounded" />
                    </div>
                </div>
            </div>

            {/* Button */}
            <div className="h-10 w-full bg-white/10 rounded-lg mt-2" />
        </div>
    );
};

export default SkeletonCard;
