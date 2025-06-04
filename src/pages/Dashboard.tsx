
import React from "react";
import { Navigate } from "react-router-dom";
import { ScrumBoard } from "../components/ScrumBoard";
import { Layout } from "../components/Layout";
import { ScrumProvider } from "../context/ScrumContext";
import { loadData } from "@/utils/localStorage";

const Dashboard = () => {
  const user = loadData("scrum_user");

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <ScrumProvider>
      <Layout>
        <ScrumBoard />
      </Layout>
    </ScrumProvider>
  );
};

export default Dashboard;
