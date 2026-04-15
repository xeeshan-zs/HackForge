"use client";

import { useState, useEffect } from "react";
import { getAdminPrizes, updateAdminPrizes, getAdminCategories } from "@/lib/firestore";
import { Category, PrizeConfig } from "@/types";
import { GlassyCard, GlassyButton, GlassyInput } from "@/components/ui/PremiumComponents";
import toast from "react-hot-toast";

export default function PrizesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [prizes, setPrizes] = useState<Map<string, PrizeConfig>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [prizeData, setPrizeData] = useState({
    first: 0,
    second: 0,
    third: 0,
    bestProject: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, prizesData] = await Promise.all([
        getAdminCategories(),
        getAdminPrizes(),
      ]);
      setCategories(categoriesData);
      const prizeMap = new Map(
        prizesData.map((p) => [p.categoryId, p])
      );
      setPrizes(prizeMap);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (categoryId: string) => {
    const prize = prizes.get(categoryId);
    if (prize) {
      setPrizeData({
        first: prize.first,
        second: prize.second,
        third: prize.third,
        bestProject: prize.bestProject || 0,
      });
    } else {
      setPrizeData({ first: 0, second: 0, third: 0, bestProject: 0 });
    }
    setEditingId(categoryId);
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      setIsSaving(true);
      await updateAdminPrizes(editingId, {
        categoryId: editingId,
        ...prizeData,
      });
      toast.success("Prizes updated successfully");
      setEditingId(null);
      await loadData();
    } catch (error) {
      toast.error("Failed to save prizes");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-white/60">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Prize Management</h1>

      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => {
          const categoryPrizes = prizes.get(category.id);
          const isEditing = editingId === category.id;

          return (
            <GlassyCard key={category.id} variant="medium">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{category.icon}</span>
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <GlassyInput
                          label="1st Place Prize (PKR)"
                          type="number"
                          value={prizeData.first}
                          onChange={(e) =>
                            setPrizeData({ ...prizeData, first: parseInt(e.target.value) })
                          }
                        />
                        <GlassyInput
                          label="2nd Place Prize (PKR)"
                          type="number"
                          value={prizeData.second}
                          onChange={(e) =>
                            setPrizeData({ ...prizeData, second: parseInt(e.target.value) })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <GlassyInput
                          label="3rd Place Prize (PKR)"
                          type="number"
                          value={prizeData.third}
                          onChange={(e) =>
                            setPrizeData({ ...prizeData, third: parseInt(e.target.value) })
                          }
                        />
                        <GlassyInput
                          label="Best Project Prize (PKR)"
                          type="number"
                          value={prizeData.bestProject}
                          onChange={(e) =>
                            setPrizeData({
                              ...prizeData,
                              bestProject: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-3">
                        <GlassyButton
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingId(null)}
                          className="flex-1"
                        >
                          Cancel
                        </GlassyButton>
                        <GlassyButton
                          size="sm"
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex-1"
                        >
                          {isSaving ? "Saving..." : "Save"}
                        </GlassyButton>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-white/70">
                      <p>
                        <strong className="text-white">1st Place:</strong> PKR{" "}
                        {categoryPrizes?.first || "Not set"}
                      </p>
                      <p>
                        <strong className="text-white">2nd Place:</strong> PKR{" "}
                        {categoryPrizes?.second || "Not set"}
                      </p>
                      <p>
                        <strong className="text-white">3rd Place:</strong> PKR{" "}
                        {categoryPrizes?.third || "Not set"}
                      </p>
                      {categoryPrizes?.bestProject && (
                        <p>
                          <strong className="text-white">Best Project:</strong> PKR{" "}
                          {categoryPrizes.bestProject}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {!isEditing && (
                  <GlassyButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(category.id)}
                  >
                    Edit
                  </GlassyButton>
                )}
              </div>
            </GlassyCard>
          );
        })}
      </div>
    </div>
  );
}
