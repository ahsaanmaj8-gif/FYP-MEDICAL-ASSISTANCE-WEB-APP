import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Homepage from './components/Homepage/Homepage';
import Login from './components/Auth/Login';
import RoleSelection from './components/Auth/RoleSelection';
import SignupPatient from './components/Auth/SignupPatient';
import SignupDoctor from './components/Auth/SignupDoctor';
import SignupPharmacy from './components/Auth/SignupPharmacy';
import SignupLaboratory from './components/Auth/SignupLaboratory';
import PatientLayout from './components/Dashboard/Patient/PatientLayout';
import PatientDashboard from './components/Dashboard/Patient/PatientDashboard';
import Appointments from './components/Dashboard/Patient/Appointments';
import Prescriptions from './components/Dashboard/Patient/Prescriptions';
import MedicalRecords from './components/Dashboard/Patient/MedicalRecords';
import PharmacyOrders from './components/Dashboard/Patient/PharmacyOrders';
import LabTests from './components/Dashboard/Patient/LabTests';
import Profile from './components/Dashboard/Patient/Profile';
import DoctorLayout from './components/Dashboard/Doctor/DoctorLayout';
import DoctorDashboard from './components/Dashboard/Doctor/DoctorDashboard';
import DoctorAppointments from './components/Dashboard/Doctor/AppointmentsDoc';
import Patients from './components/Dashboard/Doctor/Patients';
import prescriptions from './components/Dashboard/Doctor/PrescriptionsDoc';
import Schedule from './components/Dashboard/Doctor/ScheduleDoc';
import profile from './components/Dashboard/Doctor/ProfileDoc';
import Earnings from './components/Dashboard/Doctor/EarningsDoc';
import PharmacyLayout from './components/Dashboard/Pharmacy/PharmacyLayout';
import PharmacyDashboard from './components/Dashboard/Pharmacy/PharmacyDashboard';
import Delivery from './components/Dashboard/Pharmacy/Delivery';
import Orders from './components/Dashboard/Pharmacy/Orders';
import Inventory from './components/Dashboard/Pharmacy/Inventory';


import AdminLayout from './components/Dashboard/Admin/AdminLayout';
import AdminDashboard from './components/Dashboard/Admin/AdminDashboard';
import Pharmacies from './components/Dashboard/Admin/Pharmacies';
import Doctors from './components/Dashboard/Admin/Doctors';
import Laboratories from './components/Dashboard/Admin/laboratories';
import Earningss from './components/Dashboard/Admin/Earningss';
import Settings from './components/Dashboard/Admin/Settings';


import LaboratoryLayout from './components/Dashboard/Laboratory/LaboratoryLayout';
import LaboratoryDashboard from './components/Dashboard/Laboratory/LaboratoryDashboard';
import Tests from './components/Dashboard/Laboratory/Tests';
import LaboratoryAppointments from './components/Dashboard/Laboratory/Appointments';
import Reports from './components/Dashboard/Laboratory/Reports';
import LaboratoryEarnings from './components/Dashboard/Laboratory/Earnings';





import LabTestBookingPage from './components/pages/LabTestBookingPage';
import MedicineOrderPage from './components/pages/MedicineOrderPage';



// import DoctorsPage from './components/pages/DoctorsPage';
// import PublicPharmacyPage from './components/pages/PublicPharmacyPage';
import PublicLabTestsPage from './components/pages/PublicLabTestsPage';
import SpecialtiesPage from './components/pages/SpecialtiesPage';
import VideoConsultPage from './components/pages/VideoConsultPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';

import { AuthProvider } from './context/AuthContext';
import DoctorsPage from './components/pages/DoctorsPage';
import PublicPharmacyPage from './components/pages/PublicPharmacyPage';
import Earninges from './components/Dashboard/Pharmacy/Earnings';
import Profilee from './components/Dashboard/Pharmacy/Profile';


import BookAppointment from './components/pages/BookAppointment';
import AppointmentsDoc from './components/Dashboard/Doctor/AppointmentsDoc';
import PrescriptionsDoc from './components/Dashboard/Doctor/PrescriptionsDoc';
import ScheduleDoc from './components/Dashboard/Doctor/ScheduleDoc';
import ProfileDoc from './components/Dashboard/Doctor/ProfileDoc';
import EarningsDoc from './components/Dashboard/Doctor/EarningsDoc';
import DoctorProfilePage from './components/pages/DoctorProfilePage.jsx';





function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <div className="App">





            
            <Routes>




<Route path="/lab-tests/book/:testId" element={<LabTestBookingPage />} />
<Route path="/pharmacy/order/:productId" element={<MedicineOrderPage />} />



              <Route path="/doctors" element={<DoctorsPage />} />
              
<Route path="/pharmacy" element={<PublicPharmacyPage />} />
<Route path="/lab-tests" element={<PublicLabTestsPage />} />
<Route path="/specialties" element={<SpecialtiesPage />} />
<Route path="/video-consult" element={<VideoConsultPage />} />
<Route path="/about" element={<AboutPage />} />
<Route path="/contact" element={<ContactPage />} />



              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/signup/patient" element={<SignupPatient />} />
              <Route path="/signup/doctor" element={<SignupDoctor />} />
              <Route path="/signup/pharmacy" element={<SignupPharmacy />} />
              <Route path="/signup/laboratory" element={<SignupLaboratory />} />




              {/* patient panel */}
              <Route path="/patient" element={<PatientLayout />}>
                <Route path="dashboard" element={<PatientDashboard />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="prescriptions" element={<Prescriptions />} />
                <Route path="medical-records" element={<MedicalRecords />} />
                <Route path="pharmacy-orders" element={<PharmacyOrders />} />
                <Route path="lab-tests" element={<LabTests />} />
                <Route path="profile" element={<Profile />} />
              </Route>



              {/* doctor panel */}

              <Route path="/doctor" element={<DoctorLayout />}>
               {/* <Route path="patients/:id" element={<PatientDetails />} /> */}
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="appointments" element={<AppointmentsDoc />} />
                <Route path="patients" element={<Patients />} />
                <Route path="prescriptions" element={<PrescriptionsDoc />} />
                <Route path="schedule" element={<ScheduleDoc />} />
                <Route path="earnings" element={<EarningsDoc />} />
                <Route path="profile" element={<ProfileDoc />} />
              </Route>



              {/* pharmacy panel */}

              <Route path="/pharmacy" element={<PharmacyLayout />}>
                <Route path="dashboard" element={<PharmacyDashboard />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="orders" element={<Orders />} />
                {/* <Route path="prescriptions" element={<Prescriptions />} /> */}
                <Route path="delivery" element={<Delivery />} />
                <Route path="earnings" element={<Earninges />} />
                <Route path="profile" element={<Profilee />} />
              </Route>
           


<Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
<Route path="/doctor/:doctorId" element={<DoctorProfilePage />} />





              {/* admin panel */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="doctors" element={<Doctors />} />
                <Route path="pharmacies" element={<Pharmacies />} />
                <Route path="laboratories" element={<Laboratories />} />
                <Route path="earnings" element={<Earningss />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* laboratory panel */}
              <Route path="/laboratory" element={<LaboratoryLayout />}>
                <Route path="dashboard" element={<LaboratoryDashboard />} />
                <Route path="tests" element={<Tests />} />
                <Route path="appointments" element={<LaboratoryAppointments />} />
                <Route path="reports" element={<Reports />} />
                <Route path="earnings" element={<LaboratoryEarnings />} />
              </Route>



              {/* 404 Page */}
              <Route path="*" element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                    <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                    <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                      Go Back Home
                    </a>
                  </div>
                </div>
              } />

            </Routes>
          </div>
        </Router>

        <Toaster />
      </AuthProvider>
    </>

  )
}

export default App;