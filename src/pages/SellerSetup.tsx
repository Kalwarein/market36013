import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Store, Upload, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SellerSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [idDocuments, setIdDocuments] = useState<File[]>([]);
  const [businessDocuments, setBusinessDocuments] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    // Personal Information
    full_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: user?.email || "",
    
    // Location
    country: "Sierra Leone",
    region: "",
    city: "",
    address_line1: "",
    address_line2: "",
    postal_code: "",
    
    // ID Information
    national_id_type: "",
    national_id_number: "",
    national_id_issue_date: "",
    national_id_expiry_date: "",
    
    // Business Information
    business_name: "",
    business_type: "",
    business_registration_number: "",
    business_address: "",
    product_categories: [] as string[],
    annual_turnover_estimate: "",
    
    // Referral
    how_heard_about_market360: "",
    other_notes: "",
  });

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${user?.id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;
    
    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 5) {
      setStep(step + 1);
      return;
    }

    // Final submission
    setLoading(true);
    
    try {
      // Upload ID documents
      const idDocUrls = await Promise.all(
        idDocuments.map(file => uploadFile(file, 'kyc-documents', 'id-documents'))
      );
      
      // Upload business documents
      const businessDocUrls = await Promise.all(
        businessDocuments.map(file => uploadFile(file, 'kyc-documents', 'business-documents'))
      );

      // Create seller application
      const { error } = await supabase
        .from('seller_applications')
        .insert({
          user_id: user?.id,
          application_data: formData,
          id_documents: idDocUrls,
          business_documents: businessDocUrls,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Application submitted successfully! We'll review it within 24 hours.");
      navigate("/profile");
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-1">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Become a Seller</h1>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-card border-b border-border">
        <div className="flex items-center justify-center gap-2 px-4 py-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs ${
                  step >= num
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {num}
              </div>
              {num < 5 && (
                <div
                  className={`w-8 h-1 mx-1 ${
                    step > num ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 max-w-2xl mx-auto">
        <Card className="p-6">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2">Personal Information</h2>
                  <p className="text-sm text-muted-foreground">Tell us about yourself</p>
                </div>

                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date_of_birth">Date of Birth *</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+232 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2">Location Details</h2>
                  <p className="text-sm text-muted-foreground">Where are you based?</p>
                </div>

                <div>
                  <Label htmlFor="region">Region/State *</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address_line1">Address Line 1 *</Label>
                  <Input
                    id="address_line1"
                    value={formData.address_line1}
                    onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address_line2">Address Line 2</Label>
                  <Input
                    id="address_line2"
                    value={formData.address_line2}
                    onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2">ID Verification</h2>
                  <p className="text-sm text-muted-foreground">Provide your identification</p>
                </div>

                <div>
                  <Label htmlFor="national_id_type">ID Type *</Label>
                  <Select
                    value={formData.national_id_type}
                    onValueChange={(value) => setFormData({ ...formData, national_id_type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national_id">National ID</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="drivers_license">Driver's License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="national_id_number">ID Number *</Label>
                  <Input
                    id="national_id_number"
                    value={formData.national_id_number}
                    onChange={(e) => setFormData({ ...formData, national_id_number: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="national_id_issue_date">Issue Date *</Label>
                    <Input
                      id="national_id_issue_date"
                      type="date"
                      value={formData.national_id_issue_date}
                      onChange={(e) => setFormData({ ...formData, national_id_issue_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="national_id_expiry_date">Expiry Date *</Label>
                    <Input
                      id="national_id_expiry_date"
                      type="date"
                      value={formData.national_id_expiry_date}
                      onChange={(e) => setFormData({ ...formData, national_id_expiry_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Upload ID Documents (Front & Back) *</Label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files) {
                        setIdDocuments(Array.from(e.target.files));
                      }
                    }}
                    className="hidden"
                    id="id-upload"
                  />
                  <label htmlFor="id-upload" className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer block">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
                  </label>
                  {idDocuments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {idDocuments.map((file, idx) => (
                        <div key={idx} className="text-sm flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2">Business Information</h2>
                  <p className="text-sm text-muted-foreground">Tell us about your business</p>
                </div>

                <div>
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="business_type">Business Type *</Label>
                  <Select
                    value={formData.business_type}
                    onValueChange={(value) => setFormData({ ...formData, business_type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="llc">Limited Liability Company</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="business_registration_number">Business Registration Number</Label>
                  <Input
                    id="business_registration_number"
                    value={formData.business_registration_number}
                    onChange={(e) => setFormData({ ...formData, business_registration_number: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="business_address">Business Address *</Label>
                  <Textarea
                    id="business_address"
                    rows={3}
                    value={formData.business_address}
                    onChange={(e) => setFormData({ ...formData, business_address: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="annual_turnover_estimate">Annual Turnover Estimate *</Label>
                  <Select
                    value={formData.annual_turnover_estimate}
                    onValueChange={(value) => setFormData({ ...formData, annual_turnover_estimate: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-10k">$0 - $10,000</SelectItem>
                      <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                      <SelectItem value="500k+">$500,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Upload Business Documents</Label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files) {
                        setBusinessDocuments(Array.from(e.target.files));
                      }
                    }}
                    className="hidden"
                    id="business-upload"
                  />
                  <label htmlFor="business-upload" className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer block">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload</p>
                    <p className="text-xs text-muted-foreground">Business license, certificates, etc.</p>
                  </label>
                  {businessDocuments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {businessDocuments.map((file, idx) => (
                        <div key={idx} className="text-sm flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2">Final Details</h2>
                  <p className="text-sm text-muted-foreground">Almost done!</p>
                </div>

                <div>
                  <Label htmlFor="how_heard_about_market360">How did you hear about Market360? *</Label>
                  <Select
                    value={formData.how_heard_about_market360}
                    onValueChange={(value) => setFormData({ ...formData, how_heard_about_market360: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="search_engine">Search Engine</SelectItem>
                      <SelectItem value="friend_referral">Friend Referral</SelectItem>
                      <SelectItem value="advertisement">Advertisement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="other_notes">Additional Notes</Label>
                  <Textarea
                    id="other_notes"
                    rows={4}
                    placeholder="Any additional information you'd like to share..."
                    value={formData.other_notes}
                    onChange={(e) => setFormData({ ...formData, other_notes: e.target.value })}
                  />
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-primary mb-1">Ready to Submit!</p>
                      <p className="text-muted-foreground">
                        After submission, your application will be reviewed within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                  disabled={loading}
                >
                  Back
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Submitting..." : step === 5 ? "Submit Application" : "Continue"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
