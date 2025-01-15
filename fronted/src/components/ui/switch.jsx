import React from 'react';

const Switch = ({ checked, onChange }) => {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ display: 'none' }}
      />
      <span
        style={{
          width: '40px',
          height: '20px',
          background: checked ? '#4caf50' : '#ccc',
          borderRadius: '10px',
          position: 'relative',
          transition: 'background 0.3s',
        }}
      >
        <span
          style={{
            display: 'block',
            width: '18px',
            height: '18px',
            background: '#fff',
            borderRadius: '50%',
            position: 'absolute',
            top: '1px',
            left: checked ? '20px' : '2px',
            transition: 'left 0.3s',
          }}
        />
      </span>
    </label>
  );
};

export default Switch;
