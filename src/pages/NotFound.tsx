
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex min-h-[80vh] flex-col items-center justify-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-8 text-xl">Page not found</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    </Layout>
  );
};

export default NotFound;
