
import React from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  // This page now redirects to the new dashboard
  return <Navigate to="/dashboard" />;
};

export default Index;
