import React, { useEffect, useState } from 'react';
import { Box } from './react'; // Assuming the Box component is exported from 'react.js'

const DreamList = () => {
  const [dreams, setDreams] = useState([]);

  useEffect(() => {
    // Replace this with your actual data fetching logic
    fetch('/dreampost')
      .then(response => response.json())
      .then(data => setDreams(data));
  }, []);

  return (
    <div>
      {dreams.map(dream => (
        <Box
          key={dream.id}
          dreamId={dream.id}
          dreamName={dream.name}
          date={dream.date}
          dreamType={dream.type}
          clarity={dream.clarity}
        />
      ))}
    </div>
  );
};

export default DreamList;
