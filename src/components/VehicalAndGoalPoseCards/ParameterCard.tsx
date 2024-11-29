"use client";

import React from "react";
import styles from "./index.module.css";
import { SubParameter, Parameter } from "./types";

interface ParameterCardProps {
  title: string;
  parameters: Parameter[];
  onEdit: (param: Parameter, title: string) => void;
  onRun: (parameterCardTitle: string, subParameterLabel: string) => void;
}
const ParameterCard = ({
  title,
  parameters,
  onEdit,
  onRun,
}: ParameterCardProps) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      {parameters.map((param: Parameter, index: number) => (
        <div key={index} className={styles.parameterRow}>
          <span>{param.label}</span>
          <div className="flex gap-4">
            <button
              className={styles.editButton}
              onClick={() => onEdit(param, title)}
            >
              Edit Parameter
            </button>
            <button
              className={styles.runButton}
              onClick={() => onRun(title, param.label)}
            >
              Run
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParameterCard;
