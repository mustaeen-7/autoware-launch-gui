"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./index.module.css";
import ParameterCard from "./ParameterCard";
import EditParameterModal from "./EditParameterModal";
import { Parameter, SubParameter } from "./types";

// Define type for parameter cards
interface ParameterCardType {
  title: string;
  parameters: Parameter[];
}

const parameterCards: ParameterCardType[] = [
  {
    title: "EGO Vehicle Spawn",
    parameters: [
      {
        label: "Initial Pose",
        pythonPath:
          "/root/autoware_launch_scripts/pose_estimate.py", // Dynamic path
        subParameters: {
          initial_pose_x: {
            label: "Initial Pose x",
            value: "",
            required: true,
          },
          initial_pose_y: {
            label: "Initial Pose y",
            value: "",
            required: true,
          },
          orientation_z: {
            label: "Orientation Z",
            value: "",
            required: true,
          },
          orientation_w: {
            label: "Orientation W",
            value: "",
            required: true,
          },
        },
      },
    ],
  },
  {
    title: "2D Goal Pose",
    parameters: [
      {
        label: "Destination",
        pythonPath:
          "/root/autoware_launch_scripts/goal_3.py", // Dynamic path
        subParameters: {
          goal_pose_x: {
            label: "2d goal Pose x",
            value: "",
            required: true,
          },
          goal_pose_y: {
            label: "2d goal Pose y",
            value: "",
            required: true,
          },
          orientation_z: {
            label: "Orientation Z",
            value: "",
            required: true,
          },
          orientation_w: {
            label: "Orientation W",
            value: "",
            required: true,
          },
          halt: { label: "Halt", value: "", required: true },
        },
      },
      {
        label: "Intermediate Stop 1",
        pythonPath:
          "/root/autoware_launch_scripts/goal_1.py", // Dynamic path
        subParameters: {
          goal_pose_x: {
            label: "2d goal Pose x",
            value: "",
            required: true,
          },
          goal_pose_y: {
            label: "2d goal Pose y",
            value: "",
            required: true,
          },
          orientation_z: {
            label: "Orientation Z",
            value: "",
            required: true,
          },
          orientation_w: {
            label: "Orientation W",
            value: "",
            required: true,
          },
          halt: { label: "Halt", value: "", required: true },
        },
      },
      {
        label: "Intermediate Stop 2",
        pythonPath:
          "/root/autoware_launch_scripts/goal_2.py", // Dynamic path
        subParameters: {
          goal_pose_x: {
            label: "2d goal Pose x",
            value: "",
            required: true,
          },
          goal_pose_y: {
            label: "2d goal Pose y",
            value: "",
            required: true,
          },
          orientation_z: {
            label: "Orientation Z",
            value: "",
            required: true,
          },
          orientation_w: {
            label: "Orientation W",
            value: "",
            required: true,
          },
          halt: { label: "Halt", value: "", required: true },
        },
      },
    ],
  },
];

export default function VehicalAndGoalPoseCards() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedParameterCard, setSelectedParameterCard] =
    useState<string>("");

  const [subParameterData, setSubParameterData] = useState<
    Record<string, Record<string, Record<string, SubParameter>>>
  >(
    parameterCards.reduce((acc: any, parameterCard) => {
      const cardData = parameterCard.parameters.reduce(
        (parameterAcc: any, parameter: Parameter) => {
          // Add the parameter and its sub-parameters to the accumulator
          parameterAcc[parameter.label] = parameter.subParameters;
          return parameterAcc;
        },
        {}
      );

      // Add the parameter card title and the nested parameters
      acc[parameterCard.title] = cardData;

      return acc;
    }, {})
  );

  const [currentEditingParaMeter, setCurrentEditingParameter] =
    useState<string>("");

  const handleEdit = (param: Parameter, selectedParameterCardTitle: string) => {
    setCurrentEditingParameter(param.label);
    setModalVisible(true);
    setSelectedParameterCard(selectedParameterCardTitle);
  };

  const validateHandleRun = (subParamData: Record<string, SubParameter>) => {
    return Object.entries(subParamData).find(([key, field]) => {
      console.log("key", key, "field", field);
      return field.required && field.value.trim();
    });
  };

  const handleRun = async (
    selectedParameterCardTitle: string,
    selectedParameterLabel: string
  ) => {
    if (selectedParameterCardTitle && selectedParameterLabel) {
      if (
        subParameterData[selectedParameterCardTitle] &&
        subParameterData[selectedParameterCardTitle][selectedParameterLabel]
      ) {
        const subParamData =
          subParameterData[selectedParameterCardTitle][selectedParameterLabel];
        if (validateHandleRun(subParamData)) {
          const args = Object.entries(subParamData)
            .map(([key, field]) => `${key}=${field.value}`)
            .join("&");

          const scriptPath = parameterCards
            .find((card) => card.title === selectedParameterCardTitle)
            ?.parameters.find(
              (param) => param.label === selectedParameterLabel
            )?.pythonPath;

          if (!scriptPath) {
            console.log("Error: No script path found for sub-parameter.");
            return;
          }

          try {
            const res = await fetch(
              `/api/run-python?script=${encodeURIComponent(
                scriptPath
              )}&args=${encodeURIComponent(args)}`
            );

            if (res.ok) {
              const data = await res.text();
              console.log("Run successful:", data);
            
            } else {
              console.log("Failed to run Python script.");
            }
          } catch (error) {
            console.error("Error running Python script:", error);
          }
        } else {
          console.log("Sub parameter data not available");
          toast("Sub parameter data not available", {
            position: "bottom-center", // Toast will appear at the bottom center
            autoClose: 3000, // Toast will auto-close after 3 seconds
            hideProgressBar: true, // Hide the timer bar
            style: {
              backgroundColor: "#e74c3c", // Red background
              color: "white", // White text
            },
          });
        }
      } else {
        console.log("Sub parameter data not available");
      }
    } else {
      console.log("Parameter data not available");
    }
  };

  const handleChange = (
    selectedParameterCardTitle: string,
    selectedParameterLabel: string,
    key: string,
    value: string
  ) => {
    setSubParameterData((prevData) => {
      const updatedData = {
        ...prevData,
        [selectedParameterCardTitle]: {
          ...prevData[selectedParameterCardTitle],
          [selectedParameterLabel]: {
            ...prevData[selectedParameterCardTitle][selectedParameterLabel],
            [key]: {
              ...prevData[selectedParameterCardTitle][selectedParameterLabel][
                key
              ],
              value,
            },
          },
        },
      };
      return updatedData;
    });
  };

  const resetCurrentFormData = (
    selectedParameterCardTitle: string,
    selectedParameterLabel: string
  ) => {
    if (selectedParameterCardTitle && selectedParameterLabel) {
      const resetData = Object.entries(
        subParameterData[selectedParameterCardTitle][selectedParameterLabel]
      ).map(([key, field]) => [
        key,
        //@ts-ignore
        { ...field, value: "" },
      ]);
      setSubParameterData((prevData) => ({
        ...prevData,
        [selectedParameterCardTitle]: {
          ...prevData[selectedParameterCardTitle],
          [selectedParameterLabel]: Object.fromEntries(resetData),
        },
      }));
    }
  };

  const handleSubmit = () => {
    handleClose();
  };

  const handleClose = () => {
    setModalVisible(false);
    setSelectedParameterCard("");
    setCurrentEditingParameter("");
  };

  const getFormData = () => {
    if (selectedParameterCard && currentEditingParaMeter)
      return subParameterData[selectedParameterCard][currentEditingParaMeter];
    return {};
  };

  const shouldShowParameter = () => {
    return Object.entries(getFormData())?.length > 0;
  };

  return (
    <div className={styles.container}>
      {parameterCards.map((card, index) => (
        <ParameterCard
          key={index}
          title={card.title}
          parameters={card.parameters}
          onEdit={handleEdit}
          onRun={handleRun}
        />
      ))}
      {shouldShowParameter() && (
        <EditParameterModal
          isVisible={isModalVisible}
          onSubmit={handleSubmit}
          formData={getFormData()}
          onChange={handleChange}
          selectedParameterCardTitle={selectedParameterCard}
          onClose={handleClose}
          resetCurrentFormData={resetCurrentFormData}
          selectedParameterLabel={currentEditingParaMeter}
        />
      )}
      <ToastContainer />
    </div>
  );
}