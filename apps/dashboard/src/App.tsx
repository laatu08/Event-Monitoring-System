import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

import Overview from "./pages/Overview";
import Incidents from "./pages/Incidents";
import AlertRules from "./pages/AlertRules";
import Notifications from "./pages/Notifications";
import LogsPage from "./pages/LogsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/logs" element={<LogsPage></LogsPage>}/>
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/alerts" element={<AlertRules />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
