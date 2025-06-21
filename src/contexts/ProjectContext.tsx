import React, { createContext, useContext } from 'react';

const ProjectContext = createContext(null);

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const projectState = {}; // Replace with real logic as needed

  return (
    <ProjectContext.Provider value={projectState}>
      {children}
    </ProjectContext.Provider>
  );
};
