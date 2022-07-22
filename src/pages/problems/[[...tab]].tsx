import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const ProblemsPageContent = dynamic(() => import("../../components/problems"), {
  ssr: false,
});

const Problems: NextPage = () => {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <ProblemsPageContent />
    </Suspense>
  );
};

export default Problems;
