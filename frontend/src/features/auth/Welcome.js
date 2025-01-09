import React from 'react';
import { Link } from "react-router-dom";

const Welcome = () => {
  const materials = [
    { id: 1, title: "Basic Phrases", language: "Spanish" },
    { id: 2, title: "Numbers 1-100", language: "French" },
    { id: 3, title: "Common Verbs", language: "German" },
    { id: 4, title: "Food Vocabulary", language: "Italian" },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Welcome back!</h1>
      <h2 style={{ fontSize: '18px', marginBottom: '24px' }}>What are we learning today?</h2>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search materials..."
            style={{
              width: '100%',
              padding: '8px 8px 8px 36px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: '#9ca3af',
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65m4.35 4.35L21 21z" />
          </svg>
        </div>
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Materials Collection</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {materials.map((material) => (
          <div
            key={material.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>{material.title}</h4>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>{material.language}</p>
            <Link
              to={`/material/${material.id}`}
              style={{
                display: 'inline-block',
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                borderRadius: '4px',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >            
            </Link>
            
          </div>
        ))}
      </div>
      <p><Link to="/dash/materials">View Materials</Link></p>

      <p><Link to="/dash/users">View Users</Link></p>
    </div>
    
  );
};

export default Welcome;