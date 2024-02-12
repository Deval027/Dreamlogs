import React, { useEffect, useState } from 'react';

const YourComponent = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch('/api/user')
      .then(response => response.json())
      .then(data => setUserId(data.userId));
  }, []);

  // ...
};