import React from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
    children,
    variant = 'primary',
    className,
    to,
    onClick,
    type = 'button',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-luminous-saffron text-white hover:bg-luminous-maroon focus:ring-luminous-saffron shadow-lg hover:shadow-xl",
        secondary: "bg-white text-luminous-maroon border-2 border-luminous-maroon hover:bg-luminous-bg focus:ring-luminous-maroon",
        outline: "bg-transparent text-luminous-text border border-luminous-text/30 hover:bg-luminous-text/5 focus:ring-luminous-text",
        ghost: "bg-transparent text-luminous-maroon hover:bg-luminous-gold/10 hover:text-luminous-maroon",
    };

    const classes = twMerge(clsx(baseStyles, variants[variant], className));

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} className={classes} onClick={onClick} {...props}>
            {children}
        </button>
    );
};

export default Button;
