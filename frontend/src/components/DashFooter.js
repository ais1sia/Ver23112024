import React from "react";

const DashFooter = () => {
  const content = (
    <footer className="dash-footer">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; 2025 ReadyAimFluent. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );

  return content;
};

export default DashFooter;
