import { useEffect, useState } from "react";
import { fetchIncidents } from "../api/incidents";
import { IncidentTable } from "../components/IncidentTable";

export default function Incidents() {
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    fetchIncidents().then(setIncidents);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Incidents</h1>

      <IncidentTable incidents={incidents} />
    </div>
  );
}
