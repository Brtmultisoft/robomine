import React from 'react';

const TestRBMWhitelistLanding = () => {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center',
        marginBottom: '40px',
        borderRadius: '8px'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
          🚀 RBM Whitelist Portal
        </h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', opacity: 0.9 }}>
          Complete RBM Whitelist Management Platform
        </h2>
        <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Access all RBM whitelist features in one comprehensive platform.
          Dashboard, Queries, Transfers, Users, and Settings - all in one place.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>📊 Dashboard</h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              View your whitelist status and manage your RBM tokens
            </p>
            <button style={{
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Check Status
            </button>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>🔍 Queries</h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Check allowances, balances, and registration status
            </p>
            <button style={{
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Query Data
            </button>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>💸 Transfers</h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Transfer RBM tokens to single or multiple recipients
            </p>
            <button style={{
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Transfer Tokens
            </button>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>👥 Users</h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Browse all registered users and their information
            </p>
            <button style={{
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              View Users
            </button>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>⚙️ Settings</h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Contract information and network settings
            </p>
            <button style={{
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              View Settings
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>
            All RBM Whitelist Features in One Place
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>
            This is your complete RBM whitelist management platform. Access dashboard analytics,
            perform queries, execute transfers, manage users, and configure settings - all from
            this single, comprehensive interface.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestRBMWhitelistLanding;
