import { processVoiceCommand, detectLanguage } from "../services/voiceNavigationService.js";

console.log("==================================================================");
console.log("🧪 ISE MULTILINGUAL VOICE AGENT & NAVIGATION TEST SUITE");
console.log("==================================================================");

const mockAppContext = {
  employees: [
    { id: "EMP-1001", name: "Muthu Selvam", dept: "Outdoor Sun-Drying", status: "Present" },
    { id: "EMP-1002", name: "Deepa Lakshmi", dept: "Outdoor Sun-Drying", status: "Present" },
    { id: "EMP-1028", name: "Ramasamy K", dept: "Outdoor Sun-Drying", status: "Absent" }
  ],
  orders: [
    { id: "ORD-2031", customer: "Sri Balaji Traders", qty: 3000, status: "Shipped" }
  ],
  inventory: [
    { name: "Bamboo Sticks", status: "Low Stock" }
  ]
};

// 1. Test Language Detection
console.log("\n--- TEST 1: LANGUAGE DETECTION ---");
const langTests = [
  { text: "Show me the employee page", expected: "en" },
  { text: "Employee page-ku po", expected: "ta" },
  { text: "பணியாளர் பக்கத்திற்கு போ", expected: "ta" },
  { text: "Employee page kholo", expected: "hi" },
  { text: "कर्मचारी पेज पर जाओ", expected: "hi" },
  { text: "Analytics open pannu", expected: "ta" },
  { text: "Orders dikhao", expected: "hi" }
];

let passCount = 0;
langTests.forEach((t) => {
  const result = detectLanguage(t.text);
  const pass = result === t.expected;
  if (pass) passCount++;
  console.log(`[${pass ? "PASS" : "FAIL"}] "${t.text}" => detected: ${result} (expected: ${t.expected})`);
});

// 2. Test Voice Commands across English, Tamil, and Hindi
console.log("\n--- TEST 2: VOICE NAVIGATION COMMANDS ---");
const navTests = [
  // English Commands
  { cmd: "Show me the employee page", expRoute: "/admin/employees", expLang: "en" },
  { cmd: "Go to Employee page", expRoute: "/admin/employees", expLang: "en" },
  { cmd: "Open Analytics", expRoute: "/admin/analytics", expLang: "en" },
  { cmd: "Show Reports", expRoute: "/admin/analytics", expLang: "en" },
  { cmd: "Go to Dashboard", expRoute: "/admin", expLang: "en" },
  { cmd: "Open Inventory", expRoute: "/admin/inventory", expLang: "en" },
  { cmd: "Go to Production", expRoute: "/admin/production", expLang: "en" },
  { cmd: "Open Orders", expRoute: "/admin/orders", expLang: "en" },
  { cmd: "Go to Settings", expRoute: "/admin/settings", expLang: "en" },
  { cmd: "Go back", expRoute: -1, expLang: "en" },

  // Tamil Commands
  { cmd: "Employee page-ku po", expRoute: "/admin/employees", expLang: "ta" },
  { cmd: "பணியாளர் பக்கத்திற்கு போ", expRoute: "/admin/employees", expLang: "ta" },
  { cmd: "Analytics open pannu", expRoute: "/admin/analytics", expLang: "ta" },
  { cmd: "Dashboard-ku po", expRoute: "/admin", expLang: "ta" },
  { cmd: "Orders kaattu", expRoute: "/admin/orders", expLang: "ta" },
  { cmd: "Production-ku po", expRoute: "/admin/production", expLang: "ta" },
  { cmd: "Pinnal po", expRoute: -1, expLang: "ta" },

  // Hindi Commands
  { cmd: "Employee page kholo", expRoute: "/admin/employees", expLang: "hi" },
  { cmd: "कर्मचारी पेज पर जाओ", expRoute: "/admin/employees", expLang: "hi" },
  { cmd: "Analytics dikhao", expRoute: "/admin/analytics", expLang: "hi" },
  { cmd: "Dashboard par jao", expRoute: "/admin", expLang: "hi" },
  { cmd: "Orders dikhao", expRoute: "/admin/orders", expLang: "hi" },
  { cmd: "Inventory kholo", expRoute: "/admin/inventory", expLang: "hi" },
  { cmd: "Wapas jao", expRoute: -1, expLang: "hi" }
];

navTests.forEach((t) => {
  const result = processVoiceCommand(t.cmd, mockAppContext);
  const routeMatch = result.route === t.expRoute;
  const langMatch = result.detectedLang === t.expLang;
  const pass = routeMatch && langMatch;
  if (pass) passCount++;
  console.log(`[${pass ? "PASS" : "FAIL"}] "${t.cmd}"`);
  console.log(`       Route: ${result.route} (expected: ${t.expRoute})`);
  console.log(`       Lang:  ${result.detectedLang} (expected: ${t.expLang})`);
  console.log(`       Voice Spoken: "${result.spokenText}"`);
});

// 3. Test Real-time Data Queries
console.log("\n--- TEST 3: REAL-TIME DATA QUERIES ---");
const queryTests = [
  { cmd: "How many employees are present?", type: "query", expLang: "en" },
  { cmd: "எத்தனை பணியாளர்கள் இருக்கிறார்கள்?", type: "query", expLang: "ta" },
  { cmd: "कितने कर्मचारी उपस्थित हैं?", type: "query", expLang: "hi" },
  { cmd: "Weather alert", type: "query", expLang: "en" },
  { cmd: "மழை வருகிறதா?", type: "query", expLang: "ta" }
];

queryTests.forEach((t) => {
  const result = processVoiceCommand(t.cmd, mockAppContext);
  const pass = result.type === t.type && result.detectedLang === t.expLang;
  if (pass) passCount++;
  console.log(`[${pass ? "PASS" : "FAIL"}] "${t.cmd}"`);
  console.log(`       Spoken: "${result.spokenText}"`);
});

console.log("\n==================================================================");
const total = langTests.length + navTests.length + queryTests.length;
console.log(`🏁 Total Tests: ${total} | Passed: ${passCount} | Failed: ${total - passCount}`);
console.log("==================================================================");
