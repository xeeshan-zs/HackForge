"use client";

import { useState, useEffect } from "react";
import { getAdminContactInfo, updateAdminContactInfo } from "@/lib/firestore";
import { AdminContactInfo } from "@/types";
import { GlassyCard, GlassyButton, GlassyInput } from "@/components/ui/PremiumComponents";
import toast from "react-hot-toast";

const defaultContactInfo: AdminContactInfo = {
  email: "",
  phone: "",
  whatsapp: "",
  instagram: "",
  linkedin: "",
  twitter: "",
};

export default function ContactInfoManagement() {
  const [formData, setFormData] = useState<AdminContactInfo>(defaultContactInfo);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminContactInfo();
      if (data) {
        setFormData(data);
      }
    } catch (error) {
      toast.error("Failed to load contact info");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateAdminContactInfo(formData);
      toast.success("Contact information updated successfully");
    } catch (error) {
      toast.error("Failed to save contact information");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-white/60">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Contact Information</h1>

      <GlassyCard variant="medium">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassyInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@hackforge.com"
            />
            <GlassyInput
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+92 300 1234567"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassyInput
              label="WhatsApp"
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="+92 300 1234567"
            />
            <GlassyInput
              label="Instagram"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="@hackforge_numl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassyInput
              label="LinkedIn"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/company/..."
            />
            <GlassyInput
              label="Twitter/X"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              placeholder="@hackforge_numl"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <GlassyButton variant="secondary" onClick={loadContactInfo} className="flex-1">
              Cancel
            </GlassyButton>
            <GlassyButton
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </GlassyButton>
          </div>
        </div>
      </GlassyCard>

      <GlassyCard variant="subtle">
        <p className="text-white/70 text-sm">
          💡 <strong>Tip:</strong> These contact details will be displayed on the public website and in registration forms.
        </p>
      </GlassyCard>
    </div>
  );
}
