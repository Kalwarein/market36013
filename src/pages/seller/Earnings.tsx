import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

const transactions = [
  { id: "TXN-001", type: "sale", amount: 950, date: "Nov 1, 2025", order: "ORD-001" },
  { id: "TXN-002", type: "sale", amount: 850, date: "Oct 28, 2025", order: "ORD-002" },
  { id: "TXN-003", type: "withdrawal", amount: -1500, date: "Oct 25, 2025", order: null },
  { id: "TXN-004", type: "sale", amount: 2000, date: "Oct 20, 2025", order: "ORD-003" },
];

export default function SellerEarnings() {
  const balance = 2300;
  const pending = 850;
  const totalEarned = 12450;

  return (
    <PageContainer>
      <HeaderBar title="Earnings" />

      <div className="p-4 space-y-4">
        {/* Balance Cards */}
        <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <p className="text-sm opacity-90 mb-1">Available Balance</p>
          <p className="text-4xl font-bold mb-4">${balance.toLocaleString()}</p>
          <Button variant="secondary" className="w-full">
            Withdraw Funds
          </Button>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-bold">${pending}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
            <p className="text-2xl font-bold">${totalEarned.toLocaleString()}</p>
          </Card>
        </div>

        {/* Transactions */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Recent Transactions</h3>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>

          <div className="space-y-3">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    txn.type === "sale" ? "bg-green-500/10" : "bg-red-500/10"
                  }`}>
                    {txn.type === "sale" ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {txn.type === "sale" ? "Sale" : "Withdrawal"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {txn.order || txn.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${txn.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {txn.amount > 0 ? "+" : ""}${Math.abs(txn.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">{txn.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Payout Info */}
        <Card className="p-4">
          <h3 className="font-bold mb-3">Payout Method</h3>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <DollarSign className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium text-sm">Bank Account</p>
              <p className="text-xs text-muted-foreground">••••  •••• 4567</p>
            </div>
            <Button size="sm" variant="outline">Change</Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
