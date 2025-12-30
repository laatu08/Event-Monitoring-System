import { evaluateAlerts } from "../services/alertEvaluator.service";

console.log("🚨 Alert worker started");

setInterval(async () => {
  try {
    await evaluateAlerts();
  } catch (err) {
    console.error("❌ Alert evaluation failed", err);
  }
}, 60 * 1000); // every minute
