import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const SectionHeading = ({ title, subtitle, center = false, className }) => {
    return (
        <div className={twMerge(clsx("mb-10", center && "text-center", className))}>
            {subtitle && (
                <span className="block text-saffron-600 font-medium tracking-wider uppercase text-sm mb-2">
                    {subtitle}
                </span>
            )}
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 relative inline-block">
                {title}
                <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-saffron-500 rounded-full"></span>
            </h2>
        </div>
    );
};

export default SectionHeading;
