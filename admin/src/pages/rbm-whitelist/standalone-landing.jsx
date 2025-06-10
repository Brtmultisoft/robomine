import React, { useState } from 'react';

const StandaloneLanding = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [address, setAddress] = useState('');
  const [queryAddress, setQueryAddress] = useState('');
  const [queryResult, setQueryResult] = useState(null);

  const connectWallet = () => {
    const mockAddress = '0x' + Math.random().toString(16).substring(2, 42);
    setAddress(mockAddress);
  };

  const handleQuery = (type) => {
    if (!queryAddress) return;
    setQueryResult({
      type,
      address: queryAddress,
      value: (Math.random() * 1000).toFixed(4),
      status: Math.random() > 0.5
    });
  };

  return (
    <div style={{ 
      margin: 0, 
      padding: 0, 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 20px 0', fontWeight: 'bold' }}>
          🚀 RBM Whitelist Portal
        </h1>
        <h2 style={{ fontSize: '1.5rem', margin: '0 0 20px 0', opacity: 0.9 }}>
          Complete RBM Whitelist Management Platform
        </h2>
        <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Access all RBM whitelist features in one comprehensive platform. 
          Dashboard, Queries, Transfers, Users, and Settings - all in one place.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Wallet Connection */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Connect Your Wallet</h3>
          <p style={{ margin: '0 0 20px 0', color: '#666' }}>
            Connect your wallet to access all RBM whitelist features
          </p>
          <button 
            onClick={connectWallet}
            style={{
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              marginBottom: '15px'
            }}
          >
            {address ? 'Wallet Connected' : 'Connect Wallet (Demo)'}
          </button>
          {address && (
            <div style={{ marginTop: '15px' }}>
              <span style={{ 
                backgroundColor: '#e8f5e8', 
                color: '#2e7d32', 
                padding: '8px 16px', 
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '8px 8px 0 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          overflow: 'auto',
          marginBottom: '0'
        }}>
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'queries', label: '🔍 Queries' },
            { id: 'transfers', label: '💸 Transfers' },
            { id: 'users', label: '👥 Users' },
            { id: 'settings', label: '⚙️ Settings' }
          ].map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '15px 25px',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '3px solid #667eea' : '3px solid transparent',
                backgroundColor: activeTab === tab.id ? '#f8f9ff' : 'white',
                whiteSpace: 'nowrap',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          minHeight: '500px'
        }}>
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 style={{ margin: '0 0 30px 0' }}>RBM Whitelist Dashboard</h2>
              
              {/* Stats Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px',
                marginBottom: '40px'
              }}>
                <div style={{ backgroundColor: '#f8f9ff', padding: '25px', borderRadius: '8px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Total Registered</h4>
                  <h2 style={{ color: '#667eea', margin: '10px 0' }}>1,234</h2>
                  <p style={{ margin: 0, color: '#666' }}>Active members</p>
                </div>
                <div style={{ backgroundColor: '#f8f9ff', padding: '25px', borderRadius: '8px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Total Allowance</h4>
                  <h2 style={{ color: '#764ba2', margin: '10px 0' }}>567,890 RBM</h2>
                  <p style={{ margin: 0, color: '#666' }}>Token allowances</p>
                </div>
                <div style={{ backgroundColor: '#f8f9ff', padding: '25px', borderRadius: '8px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Total Balance</h4>
                  <h2 style={{ color: '#2e7d32', margin: '10px 0' }}>234,567 RBM</h2>
                  <p style={{ margin: 0, color: '#666' }}>Token balances</p>
                </div>
                <div style={{ backgroundColor: '#f8f9ff', padding: '25px', borderRadius: '8px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Active Transfers</h4>
                  <h2 style={{ color: '#f57c00', margin: '10px 0' }}>45</h2>
                  <p style={{ margin: 0, color: '#666' }}>Ongoing transactions</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '20px'
              }}>
                <div style={{ backgroundColor: '#f8f9ff', padding: '25px', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 15px 0' }}>Check Address Status</h4>
                  <input
                    placeholder="Enter wallet address (0x...)"
                    value={queryAddress}
                    onChange={(e) => setQueryAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                      fontSize: '16px',
                      marginBottom: '15px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button 
                    onClick={() => handleQuery('status')}
                    style={{
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      width: '100%'
                    }}
                  >
                    Check Status
                  </button>
                </div>
                
                <div style={{ backgroundColor: '#f8f9ff', padding: '25px', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 15px 0' }}>Whitelist Registration</h4>
                  <p style={{ margin: '0 0 15px 0', color: '#666' }}>
                    Register your connected wallet to the whitelist
                  </p>
                  <button 
                    disabled={!address}
                    style={{
                      backgroundColor: address ? '#667eea' : '#ccc',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '6px',
                      cursor: address ? 'pointer' : 'not-allowed',
                      fontSize: '16px',
                      width: '100%'
                    }}
                  >
                    {address ? 'Whitelist My Address' : 'Connect Wallet First'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Queries Tab */}
          {activeTab === 'queries' && (
            <div>
              <h2 style={{ margin: '0 0 20px 0' }}>Query Tools</h2>
              <p style={{ margin: '0 0 30px 0', color: '#666' }}>
                Check allowances, balances, registration status and extractable tokens
              </p>
              
              <div style={{ backgroundColor: '#f8f9ff', padding: '25px', borderRadius: '8px', marginBottom: '30px' }}>
                <h4 style={{ margin: '0 0 15px 0' }}>Enter Address to Query</h4>
                <input
                  placeholder="Wallet Address (0x...)"
                  value={queryAddress}
                  onChange={(e) => setQueryAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '16px',
                    marginBottom: '15px',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={() => handleQuery('allowance')} style={{ backgroundColor: '#764ba2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                    Check Allowance
                  </button>
                  <button onClick={() => handleQuery('registration')} style={{ backgroundColor: '#764ba2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                    Check Registration
                  </button>
                  <button onClick={() => handleQuery('balance')} style={{ backgroundColor: '#764ba2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                    Check Balance
                  </button>
                  <button onClick={() => handleQuery('extractable')} style={{ backgroundColor: '#764ba2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                    Total Extractable
                  </button>
                </div>
              </div>

              {queryResult && (
                <div style={{ backgroundColor: '#e8f5e8', padding: '25px', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 15px 0' }}>Query Result: {queryResult.type}</h4>
                  <p style={{ margin: '0 0 10px 0' }}><strong>Address:</strong> {queryResult.address}</p>
                  {queryResult.type === 'registration' ? (
                    <p style={{ margin: 0 }}><strong>Status:</strong> {queryResult.status ? 'Registered' : 'Not Registered'}</p>
                  ) : (
                    <p style={{ margin: 0 }}><strong>Value:</strong> {queryResult.value} RBM</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Other tabs content would go here */}
          {activeTab === 'transfers' && (
            <div>
              <h2>Transfer Management</h2>
              <p>Transfer RBM tokens to single or multiple recipients</p>
              <div style={{ backgroundColor: '#f8f9ff', padding: '25px', borderRadius: '8px' }}>
                <h4>Single Transfer</h4>
                <p>Feature coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2>Registered Users</h2>
              <p>Browse all registered users and their whitelist information</p>
              <div style={{ backgroundColor: '#f8f9ff', padding: '25px', borderRadius: '8px' }}>
                <h4>Users Table</h4>
                <p>Feature coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2>Contract Settings & Information</h2>
              <p>View contract information and network details</p>
              <div style={{ backgroundColor: '#f8f9ff', padding: '25px', borderRadius: '8px' }}>
                <h4>Contract Information</h4>
                <p><strong>Contract Address:</strong> 0xFd58b061Ab492A1EE874D581E1Ac88a075af56d3</p>
                <p><strong>Network:</strong> Binance Smart Chain (BSC)</p>
                <p><strong>Chain ID:</strong> 56</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StandaloneLanding;
