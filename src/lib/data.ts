// Phase configuration

export type ProjectPhase =
  | "ideation"
  | "parts"
  | "assembly"
  | "wiring"
  | "firmware"
  | "testing"
  | "complete";

export const phaseLabels: Record<ProjectPhase, string> = {
  ideation: "Ideation",
  parts: "Parts & BOM",
  assembly: "Assembly",
  wiring: "Wiring",
  firmware: "Firmware",
  testing: "Testing",
  complete: "Complete",
};

export const phaseOrder: ProjectPhase[] = [
  "ideation",
  "parts",
  "assembly",
  "wiring",
  "firmware",
  "testing",
  "complete",
];

export const partCategoryLabels: Record<string, string> = {
  microcontroller: "Microcontrollers",
  sensor: "Sensors",
  actuator: "Actuators & Motors",
  passive: "Passive Components",
  connector: "Connectors",
  power: "Power Supply",
  mechanical: "Mechanical Parts",
  display: "Displays",
  communication: "Communication Modules",
  other: "Other",
};
