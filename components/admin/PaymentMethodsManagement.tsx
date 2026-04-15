"use client";

import { useState, useEffect } from "react";
import { getAllPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } from "@/lib/firestore";
import { PaymentMethod } from "@/types";
import { GlassyCard, GlassyButton, GlassyInput, PremiumModal } from "@/components/ui/PremiumComponents";
import toast from "react-hot-toast";

export default function PaymentMethodsManagement() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    accountName: "",
    accountNumber: "",
    reference: "",
    isActive: true,
  });

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const data = await getAllPaymentMethods();
      setMethods(data);
    } catch (error) {
      toast.error("Failed to load payment methods");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (method?: PaymentMethod) => {
    if (method) {
      setEditingId(method.id);
      setFormData({
        name: method.name,
        accountName: method.accountName,
        accountNumber: method.accountNumber,
        reference: method.reference || "",
        isActive: method.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        accountName: "",
        accountNumber: "",
        reference: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.accountName || !formData.accountNumber) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editingId) {
        await updatePaymentMethod(editingId, formData);
        toast.success("Payment method updated");
      } else {
        await addPaymentMethod(formData);
        toast.success("Payment method added");
      }
      setIsModalOpen(false);
      await loadPaymentMethods();
    } catch (error) {
      toast.error("Failed to save payment method");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;
    try {
      await deletePaymentMethod(id);
      toast.success("Payment method deleted");
      await loadPaymentMethods();
    } catch (error) {
      toast.error("Failed to delete payment method");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Payment Methods</h1>
        <GlassyButton onClick={() => handleOpenModal()}>
          + Add Payment Method
        </GlassyButton>
      </div>

      {isLoading ? (
        <div className="text-center text-white/60">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {methods.map((method) => (
            <GlassyCard key={method.id} variant="medium">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{method.name}</h3>
                  <div className="space-y-1 text-white/70 text-sm">
                    <p><strong>Account Name:</strong> {method.accountName}</p>
                    <p><strong>Account Number:</strong> {method.accountNumber}</p>
                    {method.reference && (
                      <p><strong>Reference:</strong> {method.reference}</p>
                    )}
                    <p><strong>Status:</strong> {method.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <GlassyButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenModal(method)}
                  >
                    Edit
                  </GlassyButton>
                  <GlassyButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(method.id)}
                    className="text-red-400 border-red-400/30"
                  >
                    Delete
                  </GlassyButton>
                </div>
              </div>
            </GlassyCard>
          ))}
        </div>
      )}

      <PremiumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Payment Method" : "Add Payment Method"}
      >
        <div className="space-y-4">
          <GlassyInput
            label="Payment Method Name"
            placeholder="e.g., JazzCash, EasyPaisa, Bank Transfer"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <GlassyInput
            label="Account Name"
            placeholder="e.g., ACM NUML Hackathon"
            value={formData.accountName}
            onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
          />
          <GlassyInput
            label="Account Number"
            placeholder="e.g., 03001234567 or Bank Account Number"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
          />
          <GlassyInput
            label="Reference (Optional)"
            placeholder="e.g., Branch name or additional info"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          />
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-white">Active</span>
          </label>
          <div className="flex gap-3 pt-4">
            <GlassyButton variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </GlassyButton>
            <GlassyButton onClick={handleSave} className="flex-1">
              {editingId ? "Update" : "Add"}
            </GlassyButton>
          </div>
        </div>
      </PremiumModal>
    </div>
  );
}
