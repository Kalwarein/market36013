import { useState } from "react";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "fr", name: "French", native: "Français" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "sw", name: "Swahili", native: "Kiswahili" },
];

export default function LanguageSettings() {
  const [selected, setSelected] = useState("en");

  return (
    <PageContainer>
      <HeaderBar title="Language" />

      <div className="p-4">
        <Card className="divide-y">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="text-left">
                <p className="font-medium">{lang.name}</p>
                <p className="text-sm text-muted-foreground">{lang.native}</p>
              </div>
              {selected === lang.code && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </button>
          ))}
        </Card>
      </div>
    </PageContainer>
  );
}
