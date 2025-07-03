import React from "react";

const LoadingComponent = ({loaderName}: {loaderName: string}) => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      <span className="ml-4 text-gray-600 text-lg">Loading {loaderName}...</span>
    </div>
  );
};

export default LoadingComponent;
