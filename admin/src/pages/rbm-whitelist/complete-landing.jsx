import React, { useState } from 'react';

const CompleteLanding = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [address, setAddress] = useState('');
  const [queryAddress, setQueryAddress] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

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

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    },
    hero: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '60px 20px',
      textAlign: 'center',
      marginBottom: '0'
    },
    heroTitle: {
      fontSize: '3rem',
      marginBottom: '20px',
      fontWeight: 'bold'
    },
    heroSubtitle: {
      fontSize: '1.5rem',
      marginBottom: '20px',
      opacity: 0.9
    },
    heroDescription: {
      fontSize: '1.1rem',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px'
    },
    walletSection: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      textAlign: 'center',
      marginBottom: '40px'
    },
    button: {
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      margin: '5px'
    },
    buttonSecondary: {
      backgroundColor: '#764ba2',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      margin: '5px'
    },
    tabs: {
      display: 'flex',
      backgroundColor: 'white',
      borderRadius: '8px 8px 0 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      overflow: 'auto'
    },
    tab: {
      padding: '15px 25px',
      cursor: 'pointer',
      borderBottom: '3px solid transparent',
      whiteSpace: 'nowrap',
      fontSize: '16px',
      fontWeight: '500'
    },
    activeTab: {
      borderBottom: '3px solid #667eea',
      backgroundColor: '#f8f9ff'
    },
    tabContent: {
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '0 0 8px 8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      minHeight: '500px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      marginTop: '30px'
    },
    card: {
      backgroundColor: '#f8f9ff',
      padding: '25px',
      borderRadius: '8px',
      border: '1px solid #e0e0e0'
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      fontSize: '16px',
      marginBottom: '15px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px'
    },
    th: {
      backgroundColor: '#667eea',
      color: 'white',
      padding: '12px',
      textAlign: 'left'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd'
    }
  };

  const mockUsers = [
    { address: '0x1234...5678', registered: true, allowance: '1000.0000', balance: '500.0000' },
    { address: '0x2345...6789', registered: false, allowance: '0.0000', balance: '0.0000' },
    { address: '0x3456...7890', registered: true, allowance: '750.0000', balance: '250.0000' },
    { address: '0x4567...8901', registered: true, allowance: '2000.0000', balance: '1000.0000' },
    { address: '0x5678...9012', registered: false, allowance: '0.0000', balance: '0.0000' }
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🚀 RBM Whitelist Portal</h1>
        <h2 style={styles.heroSubtitle}>Complete RBM Whitelist Management Platform</h2>
        <p style={styles.heroDescription}>
          Access all RBM whitelist features in one comprehensive platform. 
          Dashboard, Queries, Transfers, Users, and Settings - all in one place.
        </p>
      </div>

      <div style={styles.content}>
        {/* Wallet Connection */}
        <div style={styles.walletSection}>
          <h3>Connect Your Wallet</h3>
          <p>Connect your wallet to access all RBM whitelist features</p>
          <button style={styles.button} onClick={connectWallet}>
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
        <div style={styles.tabs}>
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'queries', label: '🔍 Queries' },
            { id: 'transfers', label: '💸 Transfers' },
            { id: 'users', label: '👥 Users' },
            { id: 'settings', label: '⚙️ Settings' }
          ].map(tab => (
            <div
              key={tab.id}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div style={styles.tabContent}>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h2>RBM Whitelist Dashboard</h2>
              <div style={styles.grid}>
                <div style={styles.card}>
                  <h4>Total Registered Users</h4>
                  <h2 style={{ color: '#667eea', margin: '10px 0' }}>1,234</h2>
                  <p>Active whitelist members</p>
                </div>
                <div style={styles.card}>
                  <h4>Total Allowance</h4>
                  <h2 style={{ color: '#764ba2', margin: '10px 0' }}>567,890 RBM</h2>
                  <p>Total token allowances</p>
                </div>
                <div style={styles.card}>
                  <h4>Total Balance</h4>
                  <h2 style={{ color: '#2e7d32', margin: '10px 0' }}>234,567 RBM</h2>
                  <p>Total token balances</p>
                </div>
                <div style={styles.card}>
                  <h4>Active Transfers</h4>
                  <h2 style={{ color: '#f57c00', margin: '10px 0' }}>45</h2>
                  <p>Ongoing transactions</p>
                </div>
              </div>
              
              <div style={{ marginTop: '40px' }}>
                <h3>Quick Status Check</h3>
                <div style={styles.grid}>
                  <div style={styles.card}>
                    <h4>Check Address Status</h4>
                    <input
                      style={styles.input}
                      placeholder="Enter wallet address (0x...)"
                      value={queryAddress}
                      onChange={(e) => setQueryAddress(e.target.value)}
                    />
                    <button style={styles.button} onClick={() => handleQuery('status')}>
                      Check Status
                    </button>
                  </div>
                  <div style={styles.card}>
                    <h4>Whitelist Registration</h4>
                    <p>Register your connected wallet to the whitelist</p>
                    <button 
                      style={address ? styles.button : { ...styles.button, opacity: 0.5 }}
                      disabled={!address}
                    >
                      {address ? 'Whitelist My Address' : 'Connect Wallet First'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Queries Tab */}
          {activeTab === 'queries' && (
            <div>
              <h2>Query Tools</h2>
              <p>Check allowances, balances, registration status and extractable tokens</p>

              <div style={styles.card}>
                <h4>Enter Address to Query</h4>
                <input
                  style={styles.input}
                  placeholder="Wallet Address (0x...)"
                  value={queryAddress}
                  onChange={(e) => setQueryAddress(e.target.value)}
                />
                <div>
                  <button style={styles.buttonSecondary} onClick={() => handleQuery('allowance')}>
                    Check Allowance
                  </button>
                  <button style={styles.buttonSecondary} onClick={() => handleQuery('registration')}>
                    Check Registration
                  </button>
                  <button style={styles.buttonSecondary} onClick={() => handleQuery('balance')}>
                    Check Balance
                  </button>
                  <button style={styles.buttonSecondary} onClick={() => handleQuery('extractable')}>
                    Total Extractable
                  </button>
                </div>
              </div>

              {queryResult && (
                <div style={{ ...styles.card, marginTop: '30px', backgroundColor: '#e8f5e8' }}>
                  <h4>Query Result: {queryResult.type}</h4>
                  <p><strong>Address:</strong> {queryResult.address}</p>
                  {queryResult.type === 'registration' ? (
                    <p><strong>Status:</strong> {queryResult.status ? 'Registered' : 'Not Registered'}</p>
                  ) : (
                    <p><strong>Value:</strong> {queryResult.value} RBM</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Transfers Tab */}
          {activeTab === 'transfers' && (
            <div>
              <h2>Transfer Management</h2>
              <p>Transfer RBM tokens to single or multiple recipients</p>

              <div style={styles.grid}>
                <div style={styles.card}>
                  <h4>Single Transfer</h4>
                  <p>Transfer RBM tokens to a single recipient address</p>
                  <input
                    style={styles.input}
                    placeholder="Recipient Address (0x...)"
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                  />
                  <input
                    style={styles.input}
                    placeholder="Amount (RBM)"
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                  <button
                    style={address ? styles.button : { ...styles.button, opacity: 0.5 }}
                    disabled={!address}
                  >
                    Execute Single Transfer
                  </button>
                </div>

                <div style={styles.card}>
                  <h4>Multi Transfer</h4>
                  <p>Transfer RBM tokens to multiple recipients in one transaction</p>
                  <textarea
                    style={{ ...styles.input, height: '100px' }}
                    placeholder="Enter multiple addresses and amounts:&#10;0x123...456,100&#10;0x789...012,200"
                  />
                  <button
                    style={address ? styles.button : { ...styles.button, opacity: 0.5 }}
                    disabled={!address}
                  >
                    Execute Multi Transfer
                  </button>
                </div>
              </div>

              <div style={{ ...styles.card, marginTop: '30px' }}>
                <h4>Transfer Requirements</h4>
                <div style={styles.grid}>
                  <div style={{ textAlign: 'center' }}>
                    <h5>Wallet Connected</h5>
                    <span style={{
                      backgroundColor: address ? '#e8f5e8' : '#ffebee',
                      color: address ? '#2e7d32' : '#c62828',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}>
                      {address ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h5>Whitelist Status</h5>
                    <span style={{
                      backgroundColor: '#fff3e0',
                      color: '#f57c00',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}>
                      Check Required
                    </span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h5>Transfer Allowance</h5>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      1,000.0000 RBM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2>Registered Users</h2>
              <p>Browse all registered users and their whitelist information</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span>Total Users: {mockUsers.length}</span>
                <button style={styles.buttonSecondary}>Refresh</button>
              </div>

              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Address</th>
                    <th style={styles.th}>Registered</th>
                    <th style={styles.th}>Allowance</th>
                    <th style={styles.th}>Balance</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user, index) => (
                    <tr key={index}>
                      <td style={styles.td}>{user.address}</td>
                      <td style={styles.td}>
                        <span style={{
                          backgroundColor: user.registered ? '#e8f5e8' : '#ffebee',
                          color: user.registered ? '#2e7d32' : '#c62828',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {user.registered ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td style={styles.td}>{user.allowance} RBM</td>
                      <td style={styles.td}>{user.balance} RBM</td>
                      <td style={styles.td}>
                        <button style={{ ...styles.buttonSecondary, fontSize: '12px', padding: '4px 8px' }}>
                          Copy
                        </button>
                        <button style={{ ...styles.buttonSecondary, fontSize: '12px', padding: '4px 8px' }}>
                          BSCScan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2>Contract Settings & Information</h2>
              <p>View contract information and network details</p>

              <div style={styles.grid}>
                <div style={styles.card}>
                  <h4>Contract Information</h4>
                  <div style={{ marginTop: '20px' }}>
                    <p><strong>Contract Address:</strong></p>
                    <p style={{ fontFamily: 'monospace', fontSize: '14px', wordBreak: 'break-all' }}>
                      0xFd58b061Ab492A1EE874D581E1Ac88a075af56d3
                    </p>

                    <p style={{ marginTop: '15px' }}><strong>Network:</strong> Binance Smart Chain (BSC)</p>
                    <p><strong>Chain ID:</strong> 56</p>

                    <button style={{ ...styles.button, marginTop: '15px' }}>
                      View Contract on BSCScan
                    </button>
                  </div>
                </div>

                <div style={styles.card}>
                  <h4>Supported Features</h4>
                  <div style={{ marginTop: '20px' }}>
                    {[
                      'Check Registration Status',
                      'Check Token Allowance',
                      'Check Token Balance',
                      'Whitelist Address Registration',
                      'Single Token Transfer',
                      'Multi Token Transfer',
                      'View Total Extractable',
                      'Browse Registered Users'
                    ].map((feature, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{
                          backgroundColor: '#e8f5e8',
                          color: '#2e7d32',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '10px',
                          fontSize: '12px'
                        }}>
                          ✓
                        </span>
                        <span style={{ fontSize: '14px' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteLanding;
