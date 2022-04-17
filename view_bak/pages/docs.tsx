import React, { useRef, useEffect } from 'react';

export default () => {
  const ref = useRef({
    id: 1,
  });

  useEffect(() => {
    console.info('----------init---');
    ref.current.id = ref.current.id + 1;
  }, []);
  console.info('---', ref.current.id);
  return (
    <div>
      <p>This is umi 222 docs.</p>
    </div>
  );
};
