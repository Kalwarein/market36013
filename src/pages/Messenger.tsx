import { useState, useEffect } from "react";
import { BottomNav } from "@/components/market360/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Bell, 
  MoreHorizontal, 
  ShoppingCart,
  Package,
  MoreVertical,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";


export default function Messenger() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "notifications" | "others">("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [conversations, setConversations] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchProducts();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const { data } = await supabase
        .from('conversation_members' as any)
        .select('*')
        .eq('user_id', user?.id);

      setConversations(data || []);
      const unread = data?.reduce((sum: number, conv: any) => sum + (conv.unread_count || 0), 0) || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, images:product_images(url)')
      .eq('published', true)
      .limit(2);
    
    setProducts(data || []);
  };

  const filteredConversations = conversations.filter(conv => 
    (filter === "all" || conv.unread_count > 0) &&
    (searchQuery === "" || 
     conv.conversation?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-1 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Messenger</h1>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-around px-4 pb-3">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex flex-col items-center gap-1 pb-2 ${
              activeTab === "orders" ? "border-b-2 border-primary" : ""
            }`}
          >
            <Package className="w-5 h-5" />
            <span className={`text-xs ${activeTab === "orders" ? "font-bold" : ""}`}>
              Orders
            </span>
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex flex-col items-center gap-1 pb-2 relative ${
              activeTab === "notifications" ? "border-b-2 border-primary" : ""
            }`}
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <span className={`text-xs ${activeTab === "notifications" ? "font-bold" : ""}`}>
              Notifications
            </span>
          </button>
          <button
            onClick={() => setActiveTab("others")}
            className={`flex flex-col items-center gap-1 pb-2 ${
              activeTab === "others" ? "border-b-2 border-primary" : ""
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className={`text-xs ${activeTab === "others" ? "font-bold" : ""}`}>
              Others
            </span>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-card border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search messages or suppliers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full bg-muted border-0"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-4 py-3">
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setFilter(filter === "unread" ? "all" : "unread")}
        >
          Unread
          {filteredConversations.filter(c => c.unread_count > 0).length > 0 && (
            <Badge className="ml-2 h-5 w-5 p-0 rounded-full">
              {filteredConversations.filter(c => c.unread_count > 0).length}
            </Badge>
          )}
        </Button>
        <Button variant="outline" size="sm" className="rounded-full">
          My label
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No conversations yet
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conv) => {
              const lastMessage = conv.conversation?.messages?.[0];
              return (
                <button
                  key={conv.id}
                  onClick={() => navigate(`/conversation/${conv.conversation_id}`)}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        C
                      </AvatarFallback>
                    </Avatar>
                    {conv.unread_count > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full">
                        {conv.unread_count}
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-sm">{conv.conversation?.title || 'Conversation'}</h3>
                      <span className="text-xs text-muted-foreground">
                        {lastMessage?.created_at ? new Date(lastMessage.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-sm truncate">{lastMessage?.body || 'No messages yet'}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Info Message */}
        <div className="px-4 py-6 text-center">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="shrink-0">✓</span>
            <p>Up to 1,000 messages from the past 10 years can be loaded (messages may be limited by retention policies)</p>
          </div>
          <p className="text-xs text-green-600 mt-2">Updated at 12:54 PM</p>
        </div>

        {/* Recommended Products */}
        <div className="px-4 pb-4">
          <h3 className="font-bold mb-3">Recommended for you</h3>
          <ScrollArea className="w-full">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="shrink-0">All</Button>
              <Button variant="ghost" size="sm" className="shrink-0">Consumer Electronics</Button>
              <Button variant="ghost" size="sm" className="shrink-0">Jewelry, Eyewear, Watches</Button>
            </div>
          </ScrollArea>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="text-left"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-muted">
                  <img 
                    src={product.images?.[0]?.url || '/placeholder.svg'} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium line-clamp-2">{product.title}</p>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <BottomNav visible={true} />
    </div>
  );
}
