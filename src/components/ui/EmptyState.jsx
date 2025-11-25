import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './Button';

const EmptyState = ({ icon: Icon, title, description, actionLabel, actionLink }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 bg-luminous-gold/10 rounded-full flex items-center justify-center mb-6"
            >
                <Icon size={48} className="text-luminous-gold" />
            </motion.div>
            <h3 className="text-2xl font-display font-bold text-luminous-maroon dark:text-luminous-gold mb-2">
                {title}
            </h3>
            <p className="text-luminous-text/60 dark:text-stone-400 max-w-md mb-8">
                {description}
            </p>
            {actionLabel && actionLink && (
                <Link to={actionLink}>
                    <Button>{actionLabel}</Button>
                </Link>
            )}
        </div>
    );
};

export default EmptyState;
