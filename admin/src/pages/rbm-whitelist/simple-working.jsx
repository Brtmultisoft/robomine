import React, { useState } from 'react';

const SimpleWorking = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [address, setAddress] = useState('');
  const [queryAddress, setQueryAddress] = useState('');

  const connectWallet = () => {
    const mockAddress = '0x' + Math.random().toString(16).substring(2, 42);
    setAddress(mockAddress);
   
  };

  const handleQuery = (type) => {
    if (!queryAddress) {
      alert('Please enter an address first');
      return;
    }
    const result = (Math.random() * 1000).toFixed(4);
    alert(`${type} for ${queryAddress}: ${result} RBM`);
  };

  const styles = {
    container: {
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      margin: 0,
      padding: 0,
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    },
    hero: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '60px 20px',
      textAlign: 'center'
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
    heroText: {
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
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    tabs: {
      display: 'flex',
      backgroundColor: 'white',
      borderRadius: '8px 8px 0 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      overflowX: 'auto'
    },
    tab: {
      padding: '15px 25px',
      cursor: 'pointer',
      borderBottom: '3px solid transparent',
      whiteSpace: 'nowrap',
      fontSize: '16px',
      fontWeight: '500',
      backgroundColor: 'white'
    },
    tabActive: {
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '20px'
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
      marginBottom: '15px',
      boxSizing: 'border-box'
    },
    connected: {
      backgroundColor: '#e8f5e8',
      color: '#2e7d32',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      marginTop: '15px',
      display: 'inline-block'
    },
    statCard: {
      textAlign: 'center',
      backgroundColor: '#f8f9ff',
      padding: '25px',
      borderRadius: '8px'
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: 'bold',
      margin: '10px 0'
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🚀 RBM Whitelist Portal</h1>
        <h2 style={styles.heroSubtitle}>Complete RBM Whitelist Management Platform</h2>
        <p style={styles.heroText}>
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
            <div style={styles.connected}>
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === 'dashboard' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </div>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === 'queries' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('queries')}
          >
            🔍 Queries
          </div>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === 'transfers' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('transfers')}
          >
            💸 Transfers
          </div>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === 'users' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </div>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === 'settings' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </div>
        </div>

        {/* Tab Content */}
        <div style={styles.tabContent}>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h2>RBM Whitelist Dashboard</h2>

              <div style={styles.grid}>
                <div style={styles.statCard}>
                  <h4>Total Registered</h4>
                  <div style={{...styles.statNumber, color: '#667eea'}}>1,234</div>
                  <p>Active members</p>
                </div>
                <div style={styles.statCard}>
                  <h4>Total Allowance</h4>
                  <div style={{...styles.statNumber, color: '#764ba2'}}>567,890 RBM</div>
                  <p>Token allowances</p>
                </div>
                <div style={styles.statCard}>
                  <h4>Total Balance</h4>
                  <div style={{...styles.statNumber, color: '#2e7d32'}}>234,567 RBM</div>
                  <p>Token balances</p>
                </div>
                <div style={styles.statCard}>
                  <h4>Active Transfers</h4>
                  <div style={{...styles.statNumber, color: '#f57c00'}}>45</div>
                  <p>Ongoing transactions</p>
                </div>
              </div>

              <div style={{...styles.grid, marginTop: '40px'}}>
                <div style={styles.card}>
                  <h4>Check Address Status</h4>
                  <input
                    style={styles.input}
                    placeholder="Enter wallet address (0x...)"
                    value={queryAddress}
                    onChange={(e) => setQueryAddress(e.target.value)}
                  />
                  <button style={styles.button} onClick={() => handleQuery('Status')}>
                    Check Status
                  </button>
                </div>

                <div style={styles.card}>
                  <h4>Whitelist Registration</h4>
                  <p>Register your connected wallet to the whitelist</p>
                  <button
                    style={address ? styles.button : {...styles.button, ...styles.buttonDisabled}}
                    disabled={!address}
                    onClick={() => alert('Whitelist registration initiated!')}
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
                  <button style={styles.button} onClick={() => handleQuery('Allowance')}>
                    Check Allowance
                  </button>
                  <button style={styles.button} onClick={() => handleQuery('Registration')}>
                    Check Registration
                  </button>
                  <button style={styles.button} onClick={() => handleQuery('Balance')}>
                    Check Balance
                  </button>
                  <button style={styles.button} onClick={() => handleQuery('Total Extractable')}>
                    Total Extractable
                  </button>
                </div>
              </div>
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
                  <input style={styles.input} placeholder="Recipient Address (0x...)" />
                  <input style={styles.input} placeholder="Amount (RBM)" type="number" />
                  <button style={address ? styles.button : {...styles.button, ...styles.buttonDisabled}} disabled={!address}>
                    Execute Single Transfer
                  </button>
                </div>

                <div style={styles.card}>
                  <h4>Multi Transfer</h4>
                  <textarea
                    style={{...styles.input, height: '100px'}}
                    placeholder="Enter multiple addresses and amounts:&#10;0x123...456,100&#10;0x789...012,200"
                  />
                  <button style={address ? styles.button : {...styles.button, ...styles.buttonDisabled}} disabled={!address}>
                    Execute Multi Transfer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2>Registered Users</h2>
              <p>Browse all registered users and their whitelist information</p>

              <div style={styles.card}>
                <h4>Users List</h4>
                <p>Total Users: 1,234</p>
                <button style={styles.button}>Refresh Users</button>
                <div style={{marginTop: '20px'}}>
                  <p>📋 User management features coming soon...</p>
                </div>
              </div>
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
                  <p><strong>Contract Address:</strong></p>
                  <p style={{fontFamily: 'monospace', fontSize: '14px', wordBreak: 'break-all'}}>
                    0xFd58b061Ab492A1EE874D581E1Ac88a075af56d3
                  </p>
                  <p style={{marginTop: '15px'}}><strong>Network:</strong> Binance Smart Chain (BSC)</p>
                  <p><strong>Chain ID:</strong> 56</p>
                  <button style={{...styles.button, marginTop: '15px'}}>
                    View Contract on BSCScan
                  </button>
                </div>

                <div style={styles.card}>
                  <h4>Supported Features</h4>
                  <div style={{marginTop: '20px'}}>
                    <p>✅ Check Registration Status</p>
                    <p>✅ Check Token Allowance</p>
                    <p>✅ Check Token Balance</p>
                    <p>✅ Whitelist Address Registration</p>
                    <p>✅ Single Token Transfer</p>
                    <p>✅ Multi Token Transfer</p>
                    <p>✅ View Total Extractable</p>
                    <p>✅ Browse Registered Users</p>
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

export default SimpleWorking;
