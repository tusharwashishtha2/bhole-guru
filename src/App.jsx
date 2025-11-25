import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AnimatedRoutes from './components/AnimatedRoutes';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { ContentProvider } from './context/ContentContext';
import { WishlistProvider } from './context/WishlistContext';
import { ReviewProvider } from './context/ReviewContext';
import { QuickViewProvider } from './context/QuickViewContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ProductProvider } from './context/ProductContext';
import QuickViewModal from './components/ui/QuickViewModal';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ThemeProvider>
          <ProductProvider>
            <CartProvider>
              <OrderProvider>
                <WishlistProvider>
                  <ReviewProvider>
                    <QuickViewProvider>
                      <ContentProvider>
                        <Router>
                          <ScrollToTop />
                          <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100 font-sans transition-colors duration-300">
                            <Header />
                            <main className="flex-grow">
                              <AnimatedRoutes />
                            </main>
                            <Footer />
                            <QuickViewModal />
                          </div>
                        </Router>
                      </ContentProvider>
                    </QuickViewProvider>
                  </ReviewProvider>
                </WishlistProvider>
              </OrderProvider>
            </CartProvider>
          </ProductProvider>
        </ThemeProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
