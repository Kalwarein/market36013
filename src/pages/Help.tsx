import { useNavigate } from "react-router-dom";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  CreditCard, 
  Truck, 
  RefreshCcw,
  Shield,
  MessageCircle,
  ChevronRight 
} from "lucide-react";

const helpTopics = [
  { icon: CreditCard, label: "Payment Methods", path: "/help/payment", articles: 8 },
  { icon: Truck, label: "Shipping & Delivery", path: "/help/shipping", articles: 12 },
  { icon: RefreshCcw, label: "Returns & Refunds", path: "/help/returns", articles: 6 },
  { icon: Shield, label: "Buyer Protection", path: "/help/protection", articles: 5 },
];

export default function Help() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <HeaderBar title="Help Center" />

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for help..."
            className="pl-10"
          />
        </div>

        {/* Quick Contact */}
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">Need Immediate Help?</h3>
              <p className="text-sm text-muted-foreground">Chat with our support team</p>
            </div>
          </div>
          <Button 
            className="w-full" 
            onClick={() => navigate("/support/chat")}
          >
            Start Chat
          </Button>
        </Card>

        {/* Help Topics */}
        <div>
          <h3 className="font-bold mb-3">Browse Topics</h3>
          <div className="space-y-2">
            {helpTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <button
                  key={topic.path}
                  onClick={() => navigate(topic.path)}
                  className="w-full bg-card rounded-xl p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{topic.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {topic.articles} articles
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <Card className="p-4">
          <h3 className="font-bold mb-3">Popular FAQs</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <p className="text-sm font-medium">How do I track my order?</p>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <p className="text-sm font-medium">What payment methods are accepted?</p>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <p className="text-sm font-medium">How do I return an item?</p>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <p className="text-sm font-medium">Is my purchase protected?</p>
            </button>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="p-4">
          <h3 className="font-bold mb-3">Other Ways to Reach Us</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Email:</span> support@market360.com</p>
            <p><span className="text-muted-foreground">Phone:</span> +232 76 123 456</p>
            <p><span className="text-muted-foreground">Hours:</span> Mon-Fri, 9AM-6PM GMT</p>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
