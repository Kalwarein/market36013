import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import CategoryListing from "./pages/CategoryListing";
import Messenger from "./pages/Messenger";
import ConversationDetail from "./pages/ConversationDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import SellerSetup from "./pages/SellerSetup";
import Checkout from "./pages/Checkout";
import Settings from "./pages/Settings";
import AccountSettings from "./pages/settings/Account";
import NotificationSettings from "./pages/settings/Notifications";
import LanguageSettings from "./pages/settings/Language";
import SecuritySettings from "./pages/settings/Security";
import AboutSettings from "./pages/settings/About";
import Coupons from "./pages/Coupons";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Help from "./pages/Help";
import HelpTopic from "./pages/HelpTopic";
import SupportChat from "./pages/SupportChat";
import Quotation from "./pages/Quotation";
import Customization from "./pages/Customization";
import Ranking from "./pages/Ranking";
import SellerDashboard from "./pages/seller/Dashboard";
import SellerProducts from "./pages/seller/Products";
import SellerProductNew from "./pages/seller/ProductNew";
import SellerEarnings from "./pages/seller/Earnings";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import Notifications from "./pages/Notifications";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/categories" element={<ProtectedRoute><CategoryListing /></ProtectedRoute>} />
          <Route path="/messenger" element={<ProtectedRoute><Messenger /></ProtectedRoute>} />
          <Route path="/messenger/:id" element={<ProtectedRoute><ConversationDetail /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          
          {/* Settings Routes */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/account" element={<AccountSettings />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
          <Route path="/settings/language" element={<LanguageSettings />} />
          <Route path="/settings/security" element={<SecuritySettings />} />
          <Route path="/settings/about" element={<AboutSettings />} />
          
          {/* User Routes */}
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/history" element={<History />} />
          <Route path="/addresses" element={<NotFound />} />
          <Route path="/payment" element={<NotFound />} />
          
          {/* Help & Support */}
          <Route path="/help" element={<Help />} />
          <Route path="/help/:topic" element={<HelpTopic />} />
          <Route path="/support/chat" element={<SupportChat />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Business Features */}
          <Route path="/quotation" element={<Quotation />} />
          <Route path="/customization" element={<Customization />} />
          <Route path="/ranking" element={<Ranking />} />
          
          {/* Seller Routes */}
          <Route path="/seller/setup" element={<SellerSetup />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/store" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route path="/seller/products/new" element={<SellerProductNew />} />
          <Route path="/seller/orders" element={<Orders />} />
          <Route path="/seller/earnings" element={<SellerEarnings />} />
          <Route path="/seller/analytics" element={<NotFound />} />
          
          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
