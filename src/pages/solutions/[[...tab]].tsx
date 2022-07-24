import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const SolutionsPageContent = dynamic(
  () => import("../../components/solutions"),
  {
    ssr: false,
  }
);

const Solutions: NextPage = () => {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <SolutionsPageContent />
    </Suspense>
  );
};

export default Solutions;
