import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Store, 
  UserCircle2, 
  Plus, 
  Smile,
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertTriangle,
  Truck,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  date?: string;
  status?: "sent" | "delivered" | "read";
}

const mockMessages: Message[] = [
  { 
    id: "1", 
    sender: "seller", 
    text: "Hello, we are a factory specializing in cloning mobile phones. The mobile phones sold are not the original ones. Do you need to buy a cloned mobile phone?",
    timestamp: "11:22",
    date: "Wednesday"
  },
  { 
    id: "2", 
    sender: "buyer", 
    text: "no I want the original iphone 17",
    timestamp: "13:49",
    status: "read"
  },
  { 
    id: "3", 
    sender: "seller", 
    text: "sorry",
    timestamp: "13:49"
  },
  { 
    id: "4", 
    sender: "seller", 
    text: "not original",
    timestamp: "13:49"
  },
  { 
    id: "5", 
    sender: "buyer", 
    text: "ok",
    timestamp: "13:49",
    date: "Friday",
    status: "read"
  },
];

export default function ConversationDetail() {
  const navigate = useNavigate();
  const { id: conversationId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showProductCard, setShowProductCard] = useState(true);

  useEffect(() => {
    if (conversationId && user) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [conversationId, user]);

  const fetchMessages = async () => {
    const { data } = await (supabase as any).from('messages').select('*').eq('conversation_id', conversationId).order('created_at');
    if (data) setMessages(data.map((m: any) => ({ id: m.id, sender: m.sender_id === user?.id ? 'You' : 'Supplier', text: m.body, timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })));
  };

  const subscribeToMessages = () => {
    const channel = supabase.channel(`conv-${conversationId}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
      const m = payload.new as any;
      setMessages(prev => [...prev, { id: m.id, sender: m.sender_id === user?.id ? 'You' : 'Supplier', text: m.body, timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    await (supabase as any).from('messages').insert({ conversation_id: conversationId, sender_id: user.id, body: newMessage });
    setNewMessage("");
  };

  const handleQuickAction = async (action: string) => {
    const actions: any = { confirm: '✅ Confirmed shipment', report: '⚠️ Reported issue', fulfill: '🚚 Order fulfilled', refund: '💰 Refund requested' };
    await (supabase as any).from('messages').insert({ conversation_id: conversationId, sender_id: user?.id, body: actions[action], message_type: 'action' });
  };

  return (
    <div className="min-h-screen bg-surface-1 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold">Jessia TU</h1>
              <p className="text-xs text-muted-foreground">08:54 PM local time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Store className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <UserCircle2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Product Card */}
      {showProductCard && (
        <div className="px-4 pt-3">
          <Card className="p-3 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => setShowProductCard(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="flex gap-3">
              <img
                src="https://images.unsplash.com/photo-1592286927505-c80d0affd5c8?w=100"
                alt="Product"
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold mb-1">US$95-145</p>
                <p className="text-xs text-muted-foreground">Min.Order: 1.0 Piece</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4">
          {messages.map((msg, index) => {
            const showDate = msg.date || (index > 0 && messages[index - 1].date !== msg.date);
            
            return (
              <div key={msg.id}>
                {showDate && msg.date && (
                  <div className="flex justify-center mb-4">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {msg.date}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${msg.sender === "buyer" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[75%] ${msg.sender === "buyer" ? "flex-row-reverse" : ""}`}>
                    {msg.sender === "seller" && (
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          J
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          msg.sender === "buyer"
                            ? "bg-yellow-200 text-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-2">
                        <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                        {msg.sender === "buyer" && msg.status && (
                          <span className="text-[10px] text-muted-foreground">• {msg.status}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Translation prompt */}
          <div className="flex justify-center">
            <Card className="px-4 py-3 text-center max-w-sm">
              <p className="text-xs text-muted-foreground mb-1">
                Need translation? Try our automatic translation feature for smoother communication.
              </p>
              <Button variant="link" size="sm" className="text-primary h-auto p-0">
                Try it
              </Button>
            </Card>
          </div>
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="border-t border-border bg-card">
        <ScrollArea className="w-full">
          <div className="flex gap-2 px-4 py-2">
            <Button variant="outline" size="sm" className="shrink-0">Rate supplier</Button>
            <Button variant="outline" size="sm" className="shrink-0">Send order request</Button>
            <Button variant="outline" size="sm" className="shrink-0">Mini-site</Button>
            <Button variant="outline" size="sm" className="shrink-0">Logistics Inquiry</Button>
            <Button variant="outline" size="sm" className="shrink-0">File a...</Button>
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Plus className="w-5 h-5" />
          </Button>
          <Input
            type="text"
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" className="shrink-0">
            <Smile className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0">
            <ImageIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
