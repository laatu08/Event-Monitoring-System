import { useEffect, useState } from "react";
import { fetchAlertRules } from "../api/alerts";
import { AlertRuleForm } from "../components/AlertRuleForm";
import { AlertRulesTable } from "../components/AlertRulesTable";

export default function AlertRules() {
  const [rules, setRules] = useState<any[]>([]);

  async function load() {
    const data = await fetchAlertRules();
    setRules(data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Alert Rules</h1>

      <AlertRuleForm onCreated={load} />
      <AlertRulesTable rules={rules} onChange={load} />
    </div>
  );
}
