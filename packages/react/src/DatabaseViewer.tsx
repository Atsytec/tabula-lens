import React from 'react'

interface DatabaseViewerProps {
  endpoint: string
  authToken?: string
}

export const DatabaseViewer: React.FC<DatabaseViewerProps> = ({ endpoint, authToken }) => {
  return (
    <div>
      <h1>Database Viewer</h1>
      <p>Endpoint: {endpoint}</p>
      {authToken && <p>Auth: {authToken}</p>}
    </div>
  )
}
