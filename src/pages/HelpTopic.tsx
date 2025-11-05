import { useParams } from "react-router-dom";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const topicContent: Record<string, { title: string; articles: Array<{ title: string; content: string }> }> = {
  payment: {
    title: "Payment Methods",
    articles: [
      {
        title: "Accepted Payment Methods",
        content: "We accept credit cards (Visa, Mastercard), mobile money, and cash on delivery."
      },
      {
        title: "Is my payment secure?",
        content: "Yes, all payments are encrypted and processed through secure payment gateways."
      },
      {
        title: "Payment Failed - What to do?",
        content: "If your payment fails, please check your card details or try an alternative payment method."
      },
    ],
  },
  shipping: {
    title: "Shipping & Delivery",
    articles: [
      {
        title: "Delivery Times",
        content: "Standard delivery takes 3-7 business days. Express options are available."
      },
      {
        title: "Track Your Order",
        content: "You can track your order in the Orders section of your account."
      },
      {
        title: "Shipping Costs",
        content: "Shipping costs vary by location and order size. Free shipping on orders over $100."
      },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    articles: [
      {
        title: "Return Policy",
        content: "Items can be returned within 30 days of delivery in original condition."
      },
      {
        title: "How to Return an Item",
        content: "Go to Orders, select the item, and click 'Return Item'. Follow the instructions."
      },
      {
        title: "Refund Timeline",
        content: "Refunds are processed within 5-7 business days after we receive your return."
      },
    ],
  },
  protection: {
    title: "Buyer Protection",
    articles: [
      {
        title: "What is Buyer Protection?",
        content: "Your purchase is protected if the item doesn't arrive or doesn't match the description."
      },
      {
        title: "How to File a Claim",
        content: "Contact the seller first. If unresolved, file a dispute in your order details."
      },
      {
        title: "Protection Coverage",
        content: "Coverage includes full refund for non-delivery or significantly misrepresented items."
      },
    ],
  },
};

export default function HelpTopic() {
  const { topic } = useParams();
  const content = topicContent[topic || "payment"];

  if (!content) {
    return (
      <PageContainer>
        <HeaderBar title="Help Topic" />
        <div className="p-4">
          <p>Topic not found</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <HeaderBar title={content.title} />

      <div className="p-4 space-y-3">
        {content.articles.map((article, index) => (
          <Card key={index} className="p-4">
            <button className="w-full text-left">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">{article.title}</h3>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">{article.content}</p>
            </button>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
