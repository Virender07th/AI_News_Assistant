import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Common Components
import Navbar from "./Components/Common/Navbar";
import Footer from "./Components/Common/Footer";
import AboutUs from "./Components/Common/AboutUs";
import ContactUs from "./Components/Common/ContactUs";
import FeaturesDocs from "./Components/Common/FeaturesDocs";

// Auth Pages
import OpenRoute from "./Components/Resusable/OpenRoute";
import Register from "./Pages/Auth/Register";
import ForgetPassword from "./Pages/Auth/ForgetPassword";
import OTPVerification from "./Pages/Auth/OTPVerification";
import UpdatePassword from "./Pages/Auth/UpdatePassword";
import ResetPassword from "./Pages/Auth/ResetPassword";

// Public Pages
import Home from "./Pages/Home";
import PageNotFound from "./Components/Resusable/PageNotFound";

// Dashboard Wrapper
import Dashboard from "./Pages/DashBoard";

// Dashboard Pages
import MainDashBoard from "./Pages/Dashboard/MainDashBoard";
import Profile from "./Components/Core/Settings/Profile"; // Optional: add profile page
import UpdateProfile from "./Components/Core/Settings/UpdateProfile";
import LatestNews from "./Pages/Dashboard/LatestNews";
import AllNews from "./Pages/Dashboard/AllNews";
// import AINewsAnchor from "./Pages/Dashboard/AINewsAnchor";
import AiJournalistDashboard from "./Pages/Dashboard/AIJournalistDashboard";
import NewsFetchLayout from "./Components/Core/AiJournalist/NewsFetchLayout";
import FactChecker from "./Components/Core/AiJournalist/FactChecker";
import BiasDetection from "./Components/Core/AiJournalist/BiasDetection";
import SummaryGenerator from "./Components/Core/AiJournalist/SummaryGenerator";
import Translator from "./Components/Core/AiJournalist/Translator";
import FullNews from "./Components/Resusable/FullNews";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <div className="min-h-screen bg-richblack-900 font-inter scroll-hide">
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="features" element={<FeaturesDocs />} />

        {/* 🔐 Auth Routes */}
        <Route
          path="register"
          element={
            <OpenRoute>
              <Register />
            </OpenRoute>
          }
        />
        <Route
          path="forget-password"
          element={
            <OpenRoute>
              <ForgetPassword />
            </OpenRoute>
          }
        />
        <Route
          path="verify-otp"
          element={
            <OpenRoute>
              <OTPVerification />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="reset-password/:id"
          element={
            <OpenRoute>
              <ResetPassword />
            </OpenRoute>
          }
        />

        {/* 🛡️ Protected Routes - With Sidebar */}
        <Route element={<Dashboard />}>
          <Route path="dashboard" element={<MainDashBoard />} />
          <Route path="latest" element={<LatestNews />} />
          <Route path="all-news" element={<AllNews />} />
          <Route path="news" element={<FullNews/>}/>
      
        <Route path="ai-journalist" element={<AiJournalistDashboard />} />
          {/* <Route path="news-anchor" element={<AINewsAnchor />} /> */}
          <Route path="news-fetch" element={<NewsFetchLayout/>} />
          <Route path="fact-check" element={<FactChecker/>} />
          <Route path="bias-detection" element={<BiasDetection/>} />
          <Route path="summary-generation" element={<SummaryGenerator/>} />
          <Route path="translator" element={<Translator/>} />

          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<UpdateProfile />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
