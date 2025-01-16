"use client";

import React from "react";
import styles from "./index.module.css";
import { SubParameter, Parameter } from "./types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
    <div className="flex max-h-60 w-full flex-col gap-2 overflow-y-auto rounded-lg border p-2 mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {parameters.map((param: Parameter, index: number) => (
        <div key={index} className="mb-2 flex items-center justify-between gap-4">
           <Label className="ml-2">
              {param.label}
           </Label>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => onEdit(param, title)}
            >
              Edit Parameter
            </Button>
            <Button
              className="w-fit"
               variant="destructive"
              onClick={() => onRun(title, param.label)}
              
            >
              Run
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParameterCard;
