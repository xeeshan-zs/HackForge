"use client";

import { useState, useEffect } from "react";
import { getAdminCategories, updateAdminCategory } from "@/lib/firestore";
import { Category } from "@/types";
import { GlassyCard, GlassyButton, GlassyInput, PremiumModal } from "@/components/ui/PremiumComponents";
import toast from "react-hot-toast";

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    registrationFee: 0,
    teamMemberLimit: 1,
    description: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      registrationFee: category.registrationFee || 0,
      teamMemberLimit: category.teamMemberLimit || 1,
      description: category.description,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedCategory) return;

    try {
      await updateAdminCategory(selectedCategory.id, {
        ...selectedCategory,
        ...formData,
      });
      toast.success("Category updated successfully");
      setIsModalOpen(false);
      await loadCategories();
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Manage Categories</h1>

      {isLoading ? (
        <div className="text-center text-white/60">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <GlassyCard key={category.id} variant="medium" className="flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-white/70 text-sm mb-4">{category.description}</p>
                <div className="space-y-2 text-sm text-white/60">
                  <p><strong>Registration Fee:</strong> PKR {category.registrationFee}</p>
                  <p><strong>Team Member Limit:</strong> {category.teamMemberLimit}</p>
                  <p><strong>Team Size:</strong> {category.teamSize}</p>
                </div>
              </div>
              <GlassyButton
                variant="secondary"
                size="sm"
                onClick={() => handleOpenModal(category)}
                className="mt-4 w-full"
              >
                Edit
              </GlassyButton>
            </GlassyCard>
          ))}
        </div>
      )}

      <PremiumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Edit ${selectedCategory?.name}`}
      >
        <div className="space-y-4">
          <GlassyInput
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled
          />
          <GlassyInput
            label="Registration Fee (PKR)"
            type="number"
            value={formData.registrationFee}
            onChange={(e) => setFormData({ ...formData, registrationFee: parseInt(e.target.value) })}
          />
          <GlassyInput
            label="Team Member Limit (1-4)"
            type="number"
            min="1"
            max="4"
            value={formData.teamMemberLimit}
            onChange={(e) => setFormData({ ...formData, teamMemberLimit: parseInt(e.target.value) })}
          />
          <div>
            <label className="block text-white font-medium mb-2 text-sm">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:bg-white/20 focus:border-white/40 focus:ring-2 focus:ring-blue-400/50"
              rows={4}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <GlassyButton variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </GlassyButton>
            <GlassyButton onClick={handleSave} className="flex-1">
              Save Changes
            </GlassyButton>
          </div>
        </div>
      </PremiumModal>
    </div>
  );
}
