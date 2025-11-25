import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname, search } = useLocation();
    const navType = useNavigationType();

    useEffect(() => {
        if (navType !== 'POP') {
            window.scrollTo(0, 0);
        }
    }, [pathname, search, navType]);

    return null;
};

export default ScrollToTop;
