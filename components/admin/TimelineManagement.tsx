"use client";

import { useState } from "react";
import { GlassyCard, GlassyButton, GlassyInput, PremiumModal } from "@/components/ui/PremiumComponents";
import { ScheduleItem } from "@/types";
import toast from "react-hot-toast";

// For now, using static data - can be extended to Firestore
import { schedule as defaultSchedule } from "@/data/schedule";

export default function TimelineManagement() {
  const [items, setItems] = useState<ScheduleItem[]>(defaultSchedule);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    time: "",
    title: "",
    description: "",
    location: "",
  });

  const handleOpenModal = (index?: number) => {
    if (index !== undefined) {
      setEditingIndex(index);
      setFormData(items[index]);
    } else {
      setEditingIndex(null);
      setFormData({ time: "", title: "", description: "", location: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.time || !formData.title) {
      toast.error("Please fill in time and title");
      return;
    }

    if (editingIndex !== null) {
      const newItems = [...items];
      newItems[editingIndex] = formData;
      setItems(newItems);
      toast.success("Timeline event updated");
    } else {
      setItems([...items, formData]);
      toast.success("Timeline event added");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setItems(items.filter((_, i) => i !== index));
      toast.success("Event deleted");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Event Timeline</h1>
        <GlassyButton onClick={() => handleOpenModal()}>
          + Add Event
        </GlassyButton>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <GlassyCard key={index} variant="medium">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="bg-blue-500/30 border border-blue-500/50 rounded-lg px-4 py-2">
                    <span className="text-white font-bold">{item.time}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-white/70 mb-2">{item.description}</p>
                <p className="text-white/60 text-sm">📍 {item.location}</p>
              </div>
              <div className="flex gap-2">
                <GlassyButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenModal(index)}
                >
                  Edit
                </GlassyButton>
                <GlassyButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(index)}
                  className="text-red-400 border-red-400/30"
                >
                  Delete
                </GlassyButton>
              </div>
            </div>
          </GlassyCard>
        ))}
      </div>

      <PremiumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndex !== null ? "Edit Event" : "Add Event"}
      >
        <div className="space-y-4">
          <GlassyInput
            label="Time (e.g., 9:00 AM - 10:00 AM)"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            placeholder="9:00 AM"
          />
          <GlassyInput
            label="Event Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Opening Ceremony"
          />
          <GlassyInput
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., Main Auditorium"
          />
          <div>
            <label className="block text-white font-medium mb-2 text-sm">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:bg-white/20 focus:border-white/40 focus:ring-2 focus:ring-blue-400/50"
              rows={3}
              placeholder="Event description..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <GlassyButton variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </GlassyButton>
            <GlassyButton onClick={handleSave} className="flex-1">
              {editingIndex !== null ? "Update" : "Add"}
            </GlassyButton>
          </div>
        </div>
      </PremiumModal>
    </div>
  );
}
