import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PatientsPage from './pages/PatientsPage';
import PatientDetailPage from './pages/PatientDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientsPage />} />
        <Route path="/patients/:id" element={<PatientDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
