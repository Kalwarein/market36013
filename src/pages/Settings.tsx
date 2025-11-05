import { useNavigate } from "react-router-dom";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { 
  User, 
  Bell, 
  Globe, 
  Shield, 
  Info,
  ChevronRight 
} from "lucide-react";

const settingsItems = [
  { icon: User, label: "Account Settings", path: "/settings/account" },
  { icon: Bell, label: "Notifications", path: "/settings/notifications" },
  { icon: Globe, label: "Language", path: "/settings/language" },
  { icon: Shield, label: "Security", path: "/settings/security" },
  { icon: Info, label: "About Market360", path: "/settings/about" },
];

export default function Settings() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <HeaderBar title="Settings" />

      <div className="p-4 space-y-2">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full bg-card rounded-xl p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-primary" />
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </PageContainer>
  );
}
