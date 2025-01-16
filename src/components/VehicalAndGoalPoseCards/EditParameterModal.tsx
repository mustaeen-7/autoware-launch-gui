"use client";

import React, { useState } from "react";
import styles from "./index.module.css";
import { SubParameter } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EditParameterModalProps {
  isVisible: boolean;
  onClose: () => void;
  formData: Record<string, SubParameter>;
  onSubmit: (selectedParameterCardTitle: string, selectedParameterLabel: string) => void;
  selectedParameterCardTitle: string;
  selectedParameterLabel: string;
  onChange: (key: string, value: string, key2: string, value2: string) => void;
  resetCurrentFormData: (selectedParameterCardTitle: string, selectedParameterLabel: string) => void;
}
const EditParameterModal = ({
  selectedParameterCardTitle,
  isVisible,
  onSubmit,
  formData,
  onChange,
  onClose,
  resetCurrentFormData,
  selectedParameterLabel,
}: EditParameterModalProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleReset = () => {
    resetCurrentFormData(selectedParameterCardTitle, selectedParameterLabel);
    setErrors({}); // Clear errors on reset
  };

  const handleValidateAndSubmit = () => {
    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, field]) => {
      //@ts-ignore
      if (field.required && !field.value.trim()) {
        newErrors[key] = `Please fill out the ${field.label || key} field.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      onSubmit(selectedParameterCardTitle, selectedParameterLabel);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="flex justify-between items-center">
          <h3 className="flex-1 text-center">{selectedParameterCardTitle}</h3>
          {/* Add a close button */}
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="flex flex-col items-center gap-2 mb-4">
          <h3>Edit Parameter</h3>
          <span className={styles.description}>
            Enter the values of the parameter to add to the script
          </span>
        </div>
        {Object.entries(formData).map(([key, field]) => (
          <div key={key} className={styles.inputGroup}>
            <Label>{field.label || key}</Label>
            <div className="w-full">
            <Input
              type="text"
              className="w-full"
              //@ts-ignore
              value={field.value}
              onChange={(e) =>
                onChange(
                  selectedParameterCardTitle,
                  selectedParameterLabel,
                  key,
                  e.target.value
                )
              }
              placeholder={`Enter ${field.label || key}`}
            />
            <span
              className={`${styles.errorText} ${
                errors[key] ? styles.visible : ""
              }`}
            >
              {errors[key] || ""}
            </span>
            </div>
          </div>
        ))}
        <div className={styles.modalActions}>
          <Button   variant="outline" className={styles.resetButton} onClick={handleReset}>
            Reset
          </Button>
          <Button
          variant="secondary"
            className={styles.updateButton}
            onClick={handleValidateAndSubmit}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditParameterModal;
