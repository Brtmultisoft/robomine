import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Customization from 'components/Customization';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  bsc
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

// Custom BSC configuration with free public RPC endpoints
const customBsc = {
  ...bsc,
  rpcUrls: {
    default: {
      http: [
        'https://bsc-dataseed1.binance.org',
        'https://bsc-dataseed2.binance.org',
        'https://bsc-dataseed3.binance.org',
        'https://bsc-dataseed4.binance.org',
        'https://bsc-dataseed1.defibit.io',
        'https://bsc-dataseed2.defibit.io',
        'https://bsc-dataseed3.defibit.io',
        'https://bsc-dataseed4.defibit.io'
      ]
    },
    public: {
      http: [
        'https://bsc-dataseed1.binance.org',
        'https://bsc-dataseed2.binance.org'
      ]
    }
  }
};

const config = createConfig({
  chains: [customBsc],
  transports: {
    [customBsc.id]: http('https://bsc-dataseed1.binance.org')
  },
  connectors: getDefaultConfig({
    appName: process.env.VITE_APP_NAME || 'ROBOMINE',
    projectId: process.env.VITE_APP_PROJECT_ID || '06d308f796385247804646ce9c0e3034',
    chains: [customBsc],
    ssr: false
  }).connectors
});

const queryClient = new QueryClient();

export default function App() {

  // route the user to login page
  

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeCustomization>
            <RTLLayout>
              <Locales>
                <ScrollTop>
                  <AuthProvider>
                    <>
                      <Notistack>
                        <RouterProvider router={router} />
                        {/* <Customization /> */}
                        <Snackbar />
                      </Notistack>
                    </>
                  </AuthProvider>
                </ScrollTop>
              </Locales>
            </RTLLayout>
          </ThemeCustomization>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
