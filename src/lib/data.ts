export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  modules: number;
  completedModules?: number;
  icon: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  skill: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  steps: TaskStep[];
  location?: string;
  estimatedMinutes: number;
  assignedAt?: string;
}

export interface TaskStep {
  id: string;
  instruction: string;
  detail?: string;
  completed: boolean;
  aiHint?: string;
  safetyWarning?: string;
}

export interface GuidanceMessage {
  id: string;
  type: "instruction" | "warning" | "info" | "success";
  text: string;
  timestamp: string;
}

export const skills: Skill[] = [
  {
    id: "hvac-basics",
    name: "HVAC Fundamentals",
    category: "HVAC",
    description: "Learn heating, ventilation, and air conditioning system basics including component identification, airflow principles, and common configurations.",
    level: "beginner",
    estimatedHours: 12,
    modules: 8,
    completedModules: 8,
    icon: "thermometer",
  },
  {
    id: "hvac-diagnostics",
    name: "HVAC Diagnostics & Repair",
    category: "HVAC",
    description: "Diagnose common HVAC failures using systematic troubleshooting. Covers refrigerant issues, electrical faults, and mechanical failures.",
    level: "intermediate",
    estimatedHours: 20,
    modules: 12,
    completedModules: 7,
    icon: "wrench",
  },
  {
    id: "electrical-residential",
    name: "Residential Electrical",
    category: "Electrical",
    description: "Residential wiring, panel installation, circuit troubleshooting, and code compliance for common dwelling types.",
    level: "intermediate",
    estimatedHours: 24,
    modules: 15,
    completedModules: 3,
    icon: "zap",
  },
  {
    id: "plumbing-basics",
    name: "Plumbing Essentials",
    category: "Plumbing",
    description: "Pipe fitting, fixture installation, drain clearing, and water heater maintenance for residential and light commercial.",
    level: "beginner",
    estimatedHours: 16,
    modules: 10,
    completedModules: 0,
    icon: "droplets",
  },
  {
    id: "solar-install",
    name: "Solar Panel Installation",
    category: "Renewable Energy",
    description: "Rooftop and ground-mount solar PV system installation, wiring, inverter setup, and commissioning procedures.",
    level: "advanced",
    estimatedHours: 30,
    modules: 18,
    completedModules: 0,
    icon: "sun",
  },
  {
    id: "welding-mig",
    name: "MIG Welding",
    category: "Manufacturing",
    description: "Metal Inert Gas welding techniques, machine setup, material preparation, and weld quality inspection.",
    level: "intermediate",
    estimatedHours: 20,
    modules: 10,
    completedModules: 0,
    icon: "flame",
  },
  {
    id: "nursing-vitals",
    name: "Patient Vital Signs",
    category: "Healthcare",
    description: "Accurate measurement and interpretation of blood pressure, heart rate, temperature, respiratory rate, and oxygen saturation.",
    level: "beginner",
    estimatedHours: 8,
    modules: 6,
    completedModules: 6,
    icon: "heart-pulse",
  },
  {
    id: "cnc-operation",
    name: "CNC Machine Operation",
    category: "Manufacturing",
    description: "Setup, operation, and basic programming of CNC milling and turning machines. Includes tooling selection and quality control.",
    level: "advanced",
    estimatedHours: 32,
    modules: 16,
    completedModules: 0,
    icon: "cog",
  },
];

export const sampleTasks: Task[] = [
  {
    id: "task-001",
    title: "Commercial AC Unit - No Cooling",
    description: "Rooftop unit at 456 Oak Ave not producing cold air. Tenant reports warm air from vents for 2 days.",
    skill: "HVAC",
    status: "in_progress",
    priority: "high",
    location: "456 Oak Ave, Suite 200",
    estimatedMinutes: 90,
    assignedAt: "2026-02-07T08:00:00Z",
    steps: [
      {
        id: "s1",
        instruction: "Verify thermostat settings and mode",
        detail: "Check that the thermostat is set to COOL mode and the set temperature is below the current room temperature.",
        completed: true,
        aiHint: "Look at the thermostat display. I can read the settings if you hold your camera steady on it.",
      },
      {
        id: "s2",
        instruction: "Check air filter condition",
        detail: "Remove and inspect the air filter. A heavily clogged filter can restrict airflow enough to cause freezing on the evaporator coil.",
        completed: true,
        aiHint: "Hold the filter up to light. If you can't see through it, it needs replacement.",
        safetyWarning: "Turn off the system before removing the filter.",
      },
      {
        id: "s3",
        instruction: "Inspect the condensing unit",
        detail: "Go to the rooftop unit. Check that the condenser fan is running and the coil is clean. Look for debris blocking airflow.",
        completed: false,
        aiHint: "I'll check for any visible damage or debris when you show me the unit.",
        safetyWarning: "Use proper fall protection when accessing the roof. Stay clear of rotating fan blades.",
      },
      {
        id: "s4",
        instruction: "Check refrigerant pressures",
        detail: "Connect gauges to the service ports. Compare suction and discharge pressures to the nameplate specifications.",
        completed: false,
        aiHint: "Show me the gauge readings and the unit's nameplate. I'll tell you if the pressures indicate a leak or charge issue.",
        safetyWarning: "Wear safety glasses when connecting refrigerant gauges. Refrigerant can cause frostbite on contact.",
      },
      {
        id: "s5",
        instruction: "Measure electrical readings",
        detail: "Check compressor amp draw and compare to RLA on nameplate. Verify contactor is pulling in fully.",
        completed: false,
        aiHint: "Clamp your meter around the compressor lead. I'll compare the reading to the rated load amps.",
        safetyWarning: "High voltage present. Use insulated tools and do not touch bare conductors.",
      },
      {
        id: "s6",
        instruction: "Document findings and complete repair",
        detail: "Record all measurements, replaced parts, and final system performance. Verify cooling output at the nearest vent.",
        completed: false,
        aiHint: "I'll help you compile the service report with all the readings we've collected.",
      },
    ],
  },
  {
    id: "task-002",
    title: "Install Smart Thermostat",
    description: "Replace existing programmable thermostat with Ecobee smart thermostat. Run new C-wire if needed.",
    skill: "HVAC",
    status: "pending",
    priority: "medium",
    location: "789 Pine St",
    estimatedMinutes: 60,
    assignedAt: "2026-02-07T10:30:00Z",
    steps: [
      {
        id: "s1",
        instruction: "Document existing wiring",
        detail: "Before removing the old thermostat, photograph all wire connections and note which terminal each wire connects to.",
        completed: false,
        aiHint: "Show me the current wiring. I'll map each wire color to the terminal labels.",
      },
      {
        id: "s2",
        instruction: "Check for C-wire",
        detail: "Verify if a common (C) wire is present. The Ecobee requires a C-wire for power. If not present, use the included Power Extender Kit.",
        completed: false,
        aiHint: "I can see the wire bundle. Let me count the conductors and check if there's an unused wire for the C terminal.",
      },
      {
        id: "s3",
        instruction: "Mount the new thermostat base plate",
        detail: "Level the base plate and mark screw holes. Use drywall anchors if not hitting a stud.",
        completed: false,
        aiHint: "I can check if the base plate looks level in your camera view.",
      },
      {
        id: "s4",
        instruction: "Connect wires to the new thermostat",
        detail: "Follow the Ecobee wiring diagram. Connect each wire to the corresponding terminal.",
        completed: false,
        aiHint: "Show me each wire as you connect it. I'll confirm you're putting it in the right terminal based on the wiring diagram.",
      },
      {
        id: "s5",
        instruction: "Power on and configure",
        detail: "Restore power and walk through the Ecobee setup wizard. Test heating and cooling modes.",
        completed: false,
        aiHint: "I'll guide you through each setup screen. Let me know what you see on the display.",
      },
    ],
  },
  {
    id: "task-003",
    title: "Patient Intake - Vitals Check",
    description: "Complete vital signs assessment for new patient intake in Room 204.",
    skill: "Healthcare",
    status: "pending",
    priority: "urgent",
    location: "Room 204, West Wing",
    estimatedMinutes: 15,
    assignedAt: "2026-02-07T09:15:00Z",
    steps: [
      {
        id: "s1",
        instruction: "Verify patient identity",
        detail: "Check patient wristband and confirm name and date of birth verbally.",
        completed: false,
        aiHint: "I can help verify the wristband information if you show it to me.",
      },
      {
        id: "s2",
        instruction: "Measure blood pressure",
        detail: "Use appropriately sized cuff on bare upper arm. Patient should be seated with arm at heart level for 5 minutes before measurement.",
        completed: false,
        aiHint: "I can see the cuff placement. Make sure it's about 1 inch above the elbow crease.",
      },
      {
        id: "s3",
        instruction: "Record heart rate and SpO2",
        detail: "Apply pulse oximeter to patient's finger. Wait for stable reading before recording.",
        completed: false,
        aiHint: "Show me the pulse ox display. I'll note the readings for the chart.",
      },
      {
        id: "s4",
        instruction: "Measure temperature",
        detail: "Use temporal artery thermometer. Sweep across forehead from center to temple.",
        completed: false,
        aiHint: "I'll watch your technique. The sweep should be smooth and steady.",
      },
      {
        id: "s5",
        instruction: "Count respiratory rate",
        detail: "Count breaths for 30 seconds and multiply by 2. Do this while appearing to check the pulse so the patient breathes naturally.",
        completed: false,
        aiHint: "I can help count. Tell me when you start and I'll time 30 seconds.",
      },
    ],
  },
];

export const sampleGuidanceMessages: GuidanceMessage[] = [
  {
    id: "g1",
    type: "info",
    text: "Connected to your camera feed. I can see the rooftop HVAC unit. Let's begin the inspection.",
    timestamp: "08:32:15",
  },
  {
    id: "g2",
    type: "instruction",
    text: "I can see the condensing unit. The fan appears to be running. Move closer so I can check the coil condition.",
    timestamp: "08:32:45",
  },
  {
    id: "g3",
    type: "warning",
    text: "I notice significant debris buildup on the condenser coil. This is likely restricting airflow and causing high head pressure. It needs to be cleaned.",
    timestamp: "08:33:12",
  },
  {
    id: "g4",
    type: "instruction",
    text: "First, shut off the unit at the disconnect switch. It should be a pull-out type on the side of the unit. Show me the disconnect when you find it.",
    timestamp: "08:33:30",
  },
  {
    id: "g5",
    type: "success",
    text: "Good, power is disconnected. Now use the coil cleaning solution from your truck. Spray from the inside out to push debris away from the coil.",
    timestamp: "08:34:10",
  },
  {
    id: "g6",
    type: "instruction",
    text: "While the cleaner soaks, let's check the electrical compartment. Open the access panel on the right side of the unit - you'll need your 5/16 inch nut driver.",
    timestamp: "08:35:00",
  },
];
