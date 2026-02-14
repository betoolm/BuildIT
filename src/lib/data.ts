// ── Types ──

export interface HardwareProject {
  id: string;
  name: string;
  description: string;
  phase: ProjectPhase;
  createdAt: string;
  parts: Part[];
  assemblySteps: AssemblyStep[];
  schematic: SchematicData;
  firmware: FirmwareModule[];
  tests: TestProcedure[];
}

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
  assembly: "3D Assembly",
  wiring: "Wiring & Schematics",
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

export interface Part {
  id: string;
  name: string;
  category: PartCategory;
  description: string;
  quantity: number;
  specs: Record<string, string>;
  footprint?: string;
  identified?: boolean;
  imageHint?: string;
  purchaseLinks?: { vendor: string; sku: string }[];
}

export type PartCategory =
  | "microcontroller"
  | "sensor"
  | "actuator"
  | "passive"
  | "connector"
  | "power"
  | "mechanical"
  | "display"
  | "communication"
  | "other";

export const partCategoryLabels: Record<PartCategory, string> = {
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

export interface AssemblyStep {
  id: string;
  order: number;
  title: string;
  description: string;
  partsUsed: string[];
  warnings?: string;
  tips?: string;
  completed: boolean;
}

export interface SchematicData {
  connections: WireConnection[];
  powerRails: PowerRail[];
  notes: string[];
}

export interface WireConnection {
  id: string;
  from: { part: string; pin: string };
  to: { part: string; pin: string };
  wireColor?: string;
  signal: string;
  notes?: string;
}

export interface PowerRail {
  id: string;
  voltage: string;
  source: string;
  consumers: string[];
}

export interface FirmwareModule {
  id: string;
  name: string;
  filename: string;
  language: string;
  description: string;
  code: string;
  dependencies: string[];
  status: "draft" | "review" | "tested" | "complete";
}

export interface TestProcedure {
  id: string;
  name: string;
  category: "power" | "connectivity" | "sensor" | "actuator" | "integration" | "stress";
  steps: TestStep[];
  status: "pending" | "pass" | "fail" | "skipped";
}

export interface TestStep {
  id: string;
  instruction: string;
  expected: string;
  actual?: string;
  passed?: boolean;
}

export interface AIMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  type?: "question" | "suggestion" | "resource" | "warning" | "code";
}

// ── Sample data ──

export const sampleProject: HardwareProject = {
  id: "proj-001",
  name: "Smart Plant Monitor",
  description:
    "An IoT device that monitors soil moisture, light levels, temperature, and humidity for houseplants. Sends alerts via WiFi when plants need watering and tracks growth conditions over time.",
  phase: "wiring",
  createdAt: "2026-02-10T08:00:00Z",
  parts: [
    {
      id: "p1",
      name: "ESP32-S3 DevKit",
      category: "microcontroller",
      description: "Dual-core 240MHz MCU with WiFi/BLE, 512KB SRAM, 8MB flash. USB-C for programming.",
      quantity: 1,
      specs: { "Core": "Xtensa LX7 dual-core", "Clock": "240 MHz", "Flash": "8 MB", "RAM": "512 KB", "WiFi": "802.11 b/g/n", "BLE": "5.0", "GPIO": "45 pins", "ADC": "2x 13-bit SAR ADC" },
      footprint: "38.5 x 25.5 mm",
      identified: true,
      imageHint: "Blue PCB with USB-C port, ESP32-S3-WROOM module, and two rows of pin headers.",
    },
    {
      id: "p2",
      name: "Capacitive Soil Moisture Sensor v2.0",
      category: "sensor",
      description: "Corrosion-resistant capacitive sensor. Analog output 0-3V proportional to moisture level.",
      quantity: 2,
      specs: { "Output": "Analog 0-3V", "Voltage": "3.3-5V", "Current": "~5mA" },
      footprint: "98 x 23 mm",
      identified: true,
      imageHint: "Long narrow PCB with gold-plated sensing area and 3-pin header (VCC, GND, AOUT).",
    },
    {
      id: "p3",
      name: "BME280 Breakout",
      category: "sensor",
      description: "Temperature, humidity, and barometric pressure sensor. I2C/SPI interface.",
      quantity: 1,
      specs: { "Temp range": "-40 to 85°C", "Humidity": "0-100% RH", "Pressure": "300-1100 hPa", "Interface": "I2C (0x76)", "Voltage": "3.3V" },
      footprint: "13 x 10 mm",
      identified: true,
      imageHint: "Tiny purple breakout board with 4 or 6 pin header. Bosch BME280 chip in center.",
    },
    {
      id: "p4",
      name: "BH1750 Light Sensor",
      category: "sensor",
      description: "Digital ambient light sensor with I2C interface. 1-65535 lux range.",
      quantity: 1,
      specs: { "Range": "1-65535 lux", "Interface": "I2C (0x23)", "Voltage": "3.3-5V", "Resolution": "1 lux" },
      footprint: "14 x 18 mm",
      identified: true,
      imageHint: "Small blue breakout board with clear dome sensor and 5-pin header.",
    },
    {
      id: "p5",
      name: "0.96\" OLED Display (SSD1306)",
      category: "display",
      description: "128x64 pixel monochrome OLED. I2C interface. Displays sensor readings and status.",
      quantity: 1,
      specs: { "Resolution": "128x64", "Driver": "SSD1306", "Interface": "I2C (0x3C)", "Voltage": "3.3-5V", "Size": "0.96 inch" },
      footprint: "27 x 27 mm",
      identified: true,
      imageHint: "Small display module with 4-pin header (VCC, GND, SCL, SDA) and blue/white OLED screen.",
    },
    {
      id: "p6",
      name: "TP4056 LiPo Charger Module",
      category: "power",
      description: "USB-C lithium battery charger with protection circuit. 1A charge current.",
      quantity: 1,
      specs: { "Input": "5V USB-C", "Charge current": "1A", "Protection": "Over-charge, over-discharge, short circuit" },
      footprint: "26 x 17 mm",
      identified: true,
      imageHint: "Red PCB with USB-C port, TP4056 IC, charge/done LEDs, B+/B- and OUT+/OUT- pads.",
    },
    {
      id: "p7",
      name: "3.7V 2000mAh LiPo Battery",
      category: "power",
      description: "Rechargeable lithium polymer battery with JST-PH connector.",
      quantity: 1,
      specs: { "Voltage": "3.7V nominal", "Capacity": "2000 mAh", "Connector": "JST-PH 2.0" },
      footprint: "55 x 35 x 8 mm",
      identified: false,
      imageHint: "Flat rectangular silver pouch with red and black wires terminated in white JST connector.",
    },
    {
      id: "p8",
      name: "10KΩ Resistors",
      category: "passive",
      description: "1/4W through-hole resistors for I2C pull-ups.",
      quantity: 4,
      specs: { "Resistance": "10KΩ", "Tolerance": "1%", "Power": "0.25W" },
      identified: true,
      imageHint: "Small axial resistors with brown-black-orange-gold bands.",
    },
    {
      id: "p9",
      name: "100μF Electrolytic Capacitor",
      category: "passive",
      description: "Bulk decoupling capacitor for power supply smoothing.",
      quantity: 2,
      specs: { "Capacitance": "100μF", "Voltage rating": "16V", "Type": "Electrolytic" },
      identified: true,
      imageHint: "Small cylindrical can with polarity marking stripe. Two leads.",
    },
    {
      id: "p10",
      name: "Breadboard (830 tie-points)",
      category: "mechanical",
      description: "Full-size solderless breadboard for prototyping.",
      quantity: 1,
      specs: { "Tie points": "830", "Size": "165 x 55 mm" },
      identified: true,
      imageHint: "White rectangular breadboard with center channel and power rails on sides.",
    },
    {
      id: "p11",
      name: "Jumper Wire Kit",
      category: "connector",
      description: "Male-to-male and male-to-female Dupont jumper wires.",
      quantity: 1,
      specs: { "Types": "M-M, M-F", "Length": "20cm", "Count": "40 each" },
      identified: true,
      imageHint: "Bundle of colored jumper wires with Dupont connectors.",
    },
    {
      id: "p12",
      name: "3D Printed Enclosure",
      category: "mechanical",
      description: "Custom enclosure with ventilation slots, sensor openings, and probe pass-throughs. PLA material.",
      quantity: 1,
      specs: { "Material": "PLA", "Dimensions": "80 x 60 x 40 mm", "Wall thickness": "2 mm" },
      identified: false,
      imageHint: "White or green 3D printed box with slots and openings for sensors.",
    },
  ],
  assemblySteps: [
    {
      id: "a1",
      order: 1,
      title: "Place ESP32-S3 on breadboard",
      description: "Position the ESP32-S3 DevKit straddling the center channel of the breadboard. Pin 1 (3V3) should be at row 1. Press firmly until all pins seat into the breadboard.",
      partsUsed: ["p1", "p10"],
      tips: "Leave at least 5 rows free on each end for wiring access.",
      completed: true,
    },
    {
      id: "a2",
      order: 2,
      title: "Set up the power rails",
      description: "Connect ESP32 3V3 pin to the (+) power rail. Connect ESP32 GND to the (-) rail. Bridge both sides of the breadboard by connecting the power rails across.",
      partsUsed: ["p1", "p10", "p11"],
      tips: "Use red wire for 3.3V and black for GND to avoid mistakes.",
      completed: true,
    },
    {
      id: "a3",
      order: 3,
      title: "Add bulk decoupling capacitors",
      description: "Place a 100μF electrolytic capacitor across the power rails near the ESP32. Negative leg (stripe side) goes to GND rail. Add a second one near where the sensors will be placed.",
      partsUsed: ["p9"],
      warnings: "Electrolytic capacitors are polarized. Reversed polarity can cause failure or leakage.",
      completed: true,
    },
    {
      id: "a4",
      order: 4,
      title: "Wire the I2C bus",
      description: "Connect GPIO21 (SDA) and GPIO22 (SCL) to two free rows on the breadboard. These will be the I2C bus shared by the BME280, BH1750, and OLED display. Add 10KΩ pull-up resistors from each line to 3V3.",
      partsUsed: ["p1", "p8", "p11"],
      tips: "I2C pull-ups are required. The 10KΩ resistors pull the bus high when idle.",
      completed: false,
    },
    {
      id: "a5",
      order: 5,
      title: "Connect BME280 sensor",
      description: "Place BME280 breakout on the breadboard. Wire VCC→3V3, GND→GND, SDA→I2C SDA bus row, SCL→I2C SCL bus row.",
      partsUsed: ["p3", "p11"],
      tips: "Default I2C address is 0x76. If you have two BME280s, the second can use 0x77 by connecting SDO to 3V3.",
      completed: false,
    },
    {
      id: "a6",
      order: 6,
      title: "Connect BH1750 light sensor",
      description: "Place BH1750 on breadboard. Wire VCC→3V3, GND→GND, SDA→I2C SDA bus, SCL→I2C SCL bus. Leave ADDR pin floating for address 0x23.",
      partsUsed: ["p4", "p11"],
      completed: false,
    },
    {
      id: "a7",
      order: 7,
      title: "Connect OLED display",
      description: "Wire the 4-pin SSD1306 OLED: VCC→3V3, GND→GND, SDA→I2C SDA bus, SCL→I2C SCL bus.",
      partsUsed: ["p5", "p11"],
      tips: "The OLED at address 0x3C won't conflict with the other I2C devices.",
      completed: false,
    },
    {
      id: "a8",
      order: 8,
      title: "Connect soil moisture sensors",
      description: "Wire each capacitive moisture sensor: VCC→3V3, GND→GND, AOUT→GPIO34 (sensor 1) and GPIO35 (sensor 2). These are ADC-capable pins.",
      partsUsed: ["p2", "p11"],
      warnings: "GPIO34 and GPIO35 are input-only pins on the ESP32-S3. Don't accidentally use them for output.",
      tips: "Calibrate sensors later by recording values in dry air and fully submerged in water.",
      completed: false,
    },
    {
      id: "a9",
      order: 9,
      title: "Set up battery power",
      description: "Connect the LiPo battery to the TP4056 B+/B- pads. Connect TP4056 OUT+/OUT- to breadboard power rails (OUT+ to 3V3 rail, OUT- to GND).",
      partsUsed: ["p6", "p7"],
      warnings: "Double-check polarity before connecting the battery. Reversed polarity will damage the charger and possibly the battery.",
      tips: "The TP4056 output is battery voltage (3.0-4.2V). The ESP32-S3 can accept this directly on its 3V3 pin when not using USB power.",
      completed: false,
    },
    {
      id: "a10",
      order: 10,
      title: "Install into enclosure",
      description: "Place the assembled breadboard into the 3D printed enclosure. Route the soil moisture sensor probes through the pass-through holes. Ensure the OLED display is visible through the display window.",
      partsUsed: ["p12"],
      tips: "Leave the USB-C port accessible for firmware updates and charging.",
      completed: false,
    },
  ],
  schematic: {
    connections: [
      { id: "w1", from: { part: "ESP32-S3", pin: "3V3" }, to: { part: "Breadboard", pin: "Power Rail (+)" }, wireColor: "red", signal: "3.3V Power" },
      { id: "w2", from: { part: "ESP32-S3", pin: "GND" }, to: { part: "Breadboard", pin: "Power Rail (-)" }, wireColor: "black", signal: "Ground" },
      { id: "w3", from: { part: "ESP32-S3", pin: "GPIO21" }, to: { part: "I2C Bus", pin: "SDA" }, wireColor: "blue", signal: "I2C Data", notes: "10KΩ pull-up to 3V3" },
      { id: "w4", from: { part: "ESP32-S3", pin: "GPIO22" }, to: { part: "I2C Bus", pin: "SCL" }, wireColor: "yellow", signal: "I2C Clock", notes: "10KΩ pull-up to 3V3" },
      { id: "w5", from: { part: "BME280", pin: "SDA" }, to: { part: "I2C Bus", pin: "SDA" }, wireColor: "blue", signal: "I2C Data" },
      { id: "w6", from: { part: "BME280", pin: "SCL" }, to: { part: "I2C Bus", pin: "SCL" }, wireColor: "yellow", signal: "I2C Clock" },
      { id: "w7", from: { part: "BME280", pin: "VCC" }, to: { part: "Breadboard", pin: "Power Rail (+)" }, wireColor: "red", signal: "3.3V Power" },
      { id: "w8", from: { part: "BME280", pin: "GND" }, to: { part: "Breadboard", pin: "Power Rail (-)" }, wireColor: "black", signal: "Ground" },
      { id: "w9", from: { part: "BH1750", pin: "SDA" }, to: { part: "I2C Bus", pin: "SDA" }, wireColor: "blue", signal: "I2C Data" },
      { id: "w10", from: { part: "BH1750", pin: "SCL" }, to: { part: "I2C Bus", pin: "SCL" }, wireColor: "yellow", signal: "I2C Clock" },
      { id: "w11", from: { part: "BH1750", pin: "VCC" }, to: { part: "Breadboard", pin: "Power Rail (+)" }, wireColor: "red", signal: "3.3V Power" },
      { id: "w12", from: { part: "BH1750", pin: "GND" }, to: { part: "Breadboard", pin: "Power Rail (-)" }, wireColor: "black", signal: "Ground" },
      { id: "w13", from: { part: "SSD1306 OLED", pin: "SDA" }, to: { part: "I2C Bus", pin: "SDA" }, wireColor: "blue", signal: "I2C Data" },
      { id: "w14", from: { part: "SSD1306 OLED", pin: "SCL" }, to: { part: "I2C Bus", pin: "SCL" }, wireColor: "yellow", signal: "I2C Clock" },
      { id: "w15", from: { part: "SSD1306 OLED", pin: "VCC" }, to: { part: "Breadboard", pin: "Power Rail (+)" }, wireColor: "red", signal: "3.3V Power" },
      { id: "w16", from: { part: "SSD1306 OLED", pin: "GND" }, to: { part: "Breadboard", pin: "Power Rail (-)" }, wireColor: "black", signal: "Ground" },
      { id: "w17", from: { part: "Soil Sensor 1", pin: "AOUT" }, to: { part: "ESP32-S3", pin: "GPIO34" }, wireColor: "green", signal: "Analog Moisture 1" },
      { id: "w18", from: { part: "Soil Sensor 2", pin: "AOUT" }, to: { part: "ESP32-S3", pin: "GPIO35" }, wireColor: "green", signal: "Analog Moisture 2" },
      { id: "w19", from: { part: "Soil Sensor 1", pin: "VCC" }, to: { part: "Breadboard", pin: "Power Rail (+)" }, wireColor: "red", signal: "3.3V Power" },
      { id: "w20", from: { part: "Soil Sensor 2", pin: "VCC" }, to: { part: "Breadboard", pin: "Power Rail (+)" }, wireColor: "red", signal: "3.3V Power" },
      { id: "w21", from: { part: "Soil Sensor 1", pin: "GND" }, to: { part: "Breadboard", pin: "Power Rail (-)" }, wireColor: "black", signal: "Ground" },
      { id: "w22", from: { part: "Soil Sensor 2", pin: "GND" }, to: { part: "Breadboard", pin: "Power Rail (-)" }, wireColor: "black", signal: "Ground" },
      { id: "w23", from: { part: "TP4056", pin: "OUT+" }, to: { part: "Breadboard", pin: "Power Rail (+)" }, wireColor: "red", signal: "Battery Regulated", notes: "3.0-4.2V from LiPo" },
      { id: "w24", from: { part: "TP4056", pin: "OUT-" }, to: { part: "Breadboard", pin: "Power Rail (-)" }, wireColor: "black", signal: "Ground" },
      { id: "w25", from: { part: "LiPo Battery", pin: "+" }, to: { part: "TP4056", pin: "B+" }, wireColor: "red", signal: "Battery +", notes: "JST-PH connector" },
      { id: "w26", from: { part: "LiPo Battery", pin: "-" }, to: { part: "TP4056", pin: "B-" }, wireColor: "black", signal: "Battery -" },
    ],
    powerRails: [
      { id: "pr1", voltage: "3.3V", source: "ESP32-S3 3V3 / TP4056 OUT+", consumers: ["BME280", "BH1750", "SSD1306 OLED", "Soil Sensor 1", "Soil Sensor 2"] },
      { id: "pr2", voltage: "3.7V (nominal)", source: "LiPo Battery", consumers: ["TP4056 charger input"] },
      { id: "pr3", voltage: "5V", source: "USB-C (TP4056 input)", consumers: ["Battery charging"] },
    ],
    notes: [
      "All I2C devices share the same SDA/SCL bus with 10KΩ pull-up resistors",
      "Soil moisture sensors use ADC input-only pins (GPIO34, GPIO35)",
      "TP4056 provides charge protection and regulated output from LiPo",
      "Do not connect USB power and battery output simultaneously to the ESP32 3V3 pin — use a Schottky diode or power switching circuit in production",
    ],
  },
  firmware: [
    {
      id: "fw1",
      name: "Main Application",
      filename: "main.cpp",
      language: "cpp",
      description: "Entry point — initializes all sensors, display, WiFi, and runs the main read/display/transmit loop.",
      dependencies: ["WiFi.h", "Wire.h", "Adafruit_BME280.h", "BH1750.h", "Adafruit_SSD1306.h"],
      status: "draft",
      code: `#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include <BH1750.h>
#include <Adafruit_SSD1306.h>

// Pin definitions
#define SOIL_SENSOR_1 34
#define SOIL_SENSOR_2 35
#define SDA_PIN 21
#define SCL_PIN 22

// WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// Sensor objects
Adafruit_BME280 bme;
BH1750 lightMeter;
Adafruit_SSD1306 display(128, 64, &Wire, -1);

// Calibration values for soil sensors
const int SOIL_DRY = 3200;   // ADC value in dry air
const int SOIL_WET = 1400;   // ADC value in water

// Read interval (ms)
const unsigned long READ_INTERVAL = 30000;
unsigned long lastReadTime = 0;

void setup() {
  Serial.begin(115200);
  Wire.begin(SDA_PIN, SCL_PIN);

  // Initialize BME280
  if (!bme.begin(0x76)) {
    Serial.println("ERROR: BME280 not found!");
  }

  // Initialize BH1750
  if (!lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE)) {
    Serial.println("ERROR: BH1750 not found!");
  }

  // Initialize OLED
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("ERROR: SSD1306 not found!");
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.display();

  // Configure ADC for soil sensors
  analogReadResolution(12);

  // Connect WiFi
  WiFi.begin(ssid, password);
  display.println("Connecting WiFi...");
  display.display();
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  display.clearDisplay();
  display.println("Connected!");
  display.println(WiFi.localIP().toString());
  display.display();
  delay(2000);
}

int readSoilMoisture(int pin) {
  int raw = analogRead(pin);
  int percent = map(raw, SOIL_DRY, SOIL_WET, 0, 100);
  return constrain(percent, 0, 100);
}

void loop() {
  unsigned long now = millis();
  if (now - lastReadTime < READ_INTERVAL) return;
  lastReadTime = now;

  // Read sensors
  float temp = bme.readTemperature();
  float humidity = bme.readHumidity();
  float pressure = bme.readPressure() / 100.0;
  float lux = lightMeter.readLightLevel();
  int soil1 = readSoilMoisture(SOIL_SENSOR_1);
  int soil2 = readSoilMoisture(SOIL_SENSOR_2);

  // Update display
  display.clearDisplay();
  display.setCursor(0, 0);
  display.printf("Temp: %.1f C\\n", temp);
  display.printf("Hum:  %.0f%%\\n", humidity);
  display.printf("Lux:  %.0f\\n", lux);
  display.printf("Soil1: %d%%\\n", soil1);
  display.printf("Soil2: %d%%\\n", soil2);

  // Watering alert
  if (soil1 < 30 || soil2 < 30) {
    display.println("!! WATER NEEDED !!");
  }
  display.display();

  // Log to serial
  Serial.printf("T:%.1f H:%.0f L:%.0f S1:%d S2:%d\\n",
    temp, humidity, lux, soil1, soil2);
}`,
    },
    {
      id: "fw2",
      name: "WiFi Manager",
      filename: "wifi_manager.h",
      language: "cpp",
      description: "Handles WiFi connection, reconnection, and HTTP POST of sensor data to a remote endpoint.",
      dependencies: ["WiFi.h", "HTTPClient.h"],
      status: "draft",
      code: `#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <WiFi.h>
#include <HTTPClient.h>

class WiFiManager {
public:
  void connect(const char* ssid, const char* password) {
    WiFi.begin(ssid, password);
    int retries = 0;
    while (WiFi.status() != WL_CONNECTED && retries < 20) {
      delay(500);
      retries++;
    }
  }

  bool isConnected() {
    return WiFi.status() == WL_CONNECTED;
  }

  void reconnectIfNeeded(const char* ssid, const char* password) {
    if (!isConnected()) {
      connect(ssid, password);
    }
  }

  bool postData(const char* url, const String& jsonPayload) {
    if (!isConnected()) return false;
    HTTPClient http;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    int code = http.POST(jsonPayload);
    http.end();
    return code == 200;
  }
};

#endif`,
    },
  ],
  tests: [
    {
      id: "t1",
      name: "Power Supply Validation",
      category: "power",
      status: "pass",
      steps: [
        { id: "ts1", instruction: "Measure voltage at 3V3 power rail with multimeter", expected: "3.2V - 3.4V", actual: "3.31V", passed: true },
        { id: "ts2", instruction: "Measure current draw with all sensors active", expected: "< 200mA", actual: "87mA", passed: true },
        { id: "ts3", instruction: "Connect LiPo via TP4056 and verify output voltage", expected: "3.0V - 4.2V", actual: "3.92V", passed: true },
        { id: "ts4", instruction: "Verify USB-C charging LED illuminates when plugged in", expected: "Red LED on during charge", actual: "Red LED on", passed: true },
      ],
    },
    {
      id: "t2",
      name: "I2C Bus Scan",
      category: "connectivity",
      status: "pass",
      steps: [
        { id: "ts5", instruction: "Run I2C scanner sketch and verify BME280 at 0x76", expected: "Device found at 0x76", actual: "0x76 found", passed: true },
        { id: "ts6", instruction: "Verify BH1750 at 0x23", expected: "Device found at 0x23", actual: "0x23 found", passed: true },
        { id: "ts7", instruction: "Verify SSD1306 OLED at 0x3C", expected: "Device found at 0x3C", actual: "0x3C found", passed: true },
        { id: "ts8", instruction: "Confirm no address conflicts on the bus", expected: "3 unique devices", actual: "3 devices, no conflicts", passed: true },
      ],
    },
    {
      id: "t3",
      name: "Sensor Reading Validation",
      category: "sensor",
      status: "pending",
      steps: [
        { id: "ts9", instruction: "Read BME280 temperature and compare to known reference thermometer", expected: "Within ±1°C of reference" },
        { id: "ts10", instruction: "Place soil sensor in dry air and record ADC value", expected: "ADC > 3000" },
        { id: "ts11", instruction: "Place soil sensor in cup of water and record ADC value", expected: "ADC < 1600" },
        { id: "ts12", instruction: "Cover BH1750 sensor and verify lux drops to near zero", expected: "< 5 lux" },
        { id: "ts13", instruction: "Expose BH1750 to room light and verify reasonable reading", expected: "100-500 lux for typical room" },
      ],
    },
    {
      id: "t4",
      name: "Display & UI Test",
      category: "integration",
      status: "pending",
      steps: [
        { id: "ts14", instruction: "Verify OLED displays all sensor values after boot", expected: "5 lines of sensor data visible" },
        { id: "ts15", instruction: "Trigger low moisture alert by removing sensor from soil", expected: "'WATER NEEDED' message appears" },
        { id: "ts16", instruction: "Verify display updates every 30 seconds", expected: "Values refresh at ~30s intervals" },
      ],
    },
    {
      id: "t5",
      name: "WiFi & Data Transmission",
      category: "connectivity",
      status: "pending",
      steps: [
        { id: "ts17", instruction: "Power on device and verify WiFi connects within 10 seconds", expected: "IP address shown on display" },
        { id: "ts18", instruction: "Move device to edge of WiFi range and verify reconnection", expected: "Auto-reconnects within 30s" },
        { id: "ts19", instruction: "Check serial output for sensor data log entries", expected: "Formatted data line every 30s" },
      ],
    },
    {
      id: "t6",
      name: "Battery Endurance",
      category: "stress",
      status: "pending",
      steps: [
        { id: "ts20", instruction: "Fully charge battery, disconnect USB, log start time", expected: "Battery at 4.2V" },
        { id: "ts21", instruction: "Let device run on battery until it shuts down, log end time", expected: "> 20 hours runtime" },
        { id: "ts22", instruction: "Verify device recovers correctly when USB power restored", expected: "Boots and reconnects WiFi" },
      ],
    },
  ],
};

export const ideationConversation: AIMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content: "Welcome to BuildIT! I'll help you go from idea to a working hardware product. Let's start — what are you trying to build? Describe your idea in a few sentences, even if it's rough.",
    timestamp: "08:00:00",
    type: "question",
  },
  {
    id: "m2",
    role: "user",
    content: "I want to build a smart plant monitor. It should track soil moisture, light, temperature, and humidity. It needs to be battery powered and connect to WiFi so I can check on my plants remotely.",
    timestamp: "08:01:30",
  },
  {
    id: "m3",
    role: "assistant",
    content: "Great concept! A few questions to nail down the scope:\n\n1. **How many plants** do you want to monitor — just one, or multiple plants with one device?\n2. **Indoor or outdoor?** This affects weatherproofing and power requirements.\n3. **Do you want a display on the device**, or is phone/web-only fine?\n4. **Alerts** — should it notify you when plants need water, or just log data?",
    timestamp: "08:01:45",
    type: "question",
  },
  {
    id: "m4",
    role: "user",
    content: "Two plants with one device, indoor only, I'd like a small OLED display on it, and yes it should alert me when moisture drops too low.",
    timestamp: "08:03:00",
  },
  {
    id: "m5",
    role: "assistant",
    content: "Perfect, here's what I'm going to design for you:\n\n**Smart Plant Monitor v1**\n- ESP32-S3 as the brain (WiFi + BLE built in)\n- 2x capacitive soil moisture sensors (corrosion-resistant)\n- BME280 for temp/humidity/pressure\n- BH1750 for light level measurement\n- 0.96\" OLED for local display\n- LiPo battery + USB-C charging\n- 3D printed enclosure\n\nI've generated a full Bill of Materials with 12 components. Ready to move to the parts phase?",
    timestamp: "08:03:15",
    type: "suggestion",
  },
  {
    id: "m6",
    role: "assistant",
    content: "**Resources for this build:**\n- ESP32-S3 datasheet & pinout reference\n- BME280 library: Adafruit_BME280\n- BH1750 library: BH1750 by Christopher Laws\n- SSD1306 OLED library: Adafruit_SSD1306\n- Capacitive soil sensor calibration guide\n- PlatformIO or Arduino IDE for firmware development",
    timestamp: "08:03:20",
    type: "resource",
  },
];
