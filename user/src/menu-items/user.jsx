// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Story, Fatrows, PresentionChart } from 'iconsax-react';

// type

// icons
const icons = {
  widgets: Story,
  statistics: Story,
  data: Fatrows,
  chart: PresentionChart
};

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const profile = {
  id: 'group-profile',
  title: <FormattedMessage id="User" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'profile',
      title: <FormattedMessage id="Profile" />,
      type: 'item',
      url: '/user/profile/',
      icon: icons.statistics
    },
    {
      id: 'directs',
      title: <FormattedMessage id="Directs" />,
      type: 'item',
      url: '/user/directs/',
      icon: icons.chart
    },
    {
      id: 'team',
      title: <FormattedMessage id="Team" />,
      type: 'item',
      url: '/user/team/',
      icon: icons.widgets
    },

    {
      id: 'Direct Income',
      title: <FormattedMessage id="Direct Income" />,
      type: 'item',
      url: '/user/direct-income/',
      icon: icons.data
    },
    {
      id: 'Level Income',
      title: <FormattedMessage id="Level Income" />,
      type: 'item',
      url: '/user/level-income',
      icon: icons.data
    },
    {
      id: 'Provision Bonus',
      title: <FormattedMessage id="Provision Bonus" />,
      type: 'item',
      url: '/user/provision-bonus',
      icon: icons.data
    },
    {
      id: 'Prime Member Income  ',
      title: <FormattedMessage id="Prime Member Income" />,
      type: 'item',
      url: '/user/prime-income',
      icon: icons.data
    },
    {
      id: 'Founder Member Income',
      title: <FormattedMessage id="Founder Member Income" />,
      type: 'item',
      url: '/user/founder-income',
      icon: icons.data
    },
    {
      id: 'Active Package',
      title: <FormattedMessage id="Active Package" />,
      type: 'item',
      url: '/user/active-package',
      icon: icons.data
    },
    // {
    //   id: 'data',
    //   title: <FormattedMessage id="Level Income" />,
    //   type: 'item',
    //   url: '/investments/invest-reports/',
    //   icon: icons.data
    // },
    // {
    //   id: 'Stakeico',
    //   title: <FormattedMessage id="Deposit Funds" />,
    //   type: 'item',
    //   url: '/user/add-funds',
    //   icon: icons.data
    // },
    // {
    //   id: 'Stakedicoreport',
    //   title: <FormattedMessage id="Active Package" />,
    //   type: 'item',
    //   url: '/investments/stacked-report/',
    //   icon: icons.data
    // },
    // {
    //    id: 'packages',
    //    title: <FormattedMessage id="Packages" />,
    //    type: 'item',
    //    url: '/packages/x3',
    //    icon: icons.data
    // },
    // {
    //   id: 'stackedtoken',
    //   title: <FormattedMessage id="Stake Token" />,
    //   type: 'item',
    //   url: '/user/stake-token',
    //   icon: icons.data
    // },
    // {
    //   id: 'Stakedtokenreport',
    //   title: <FormattedMessage id="TXN History" />,
    //   type: 'item',
    //   url: '/investments/stacked-token-report/',
    //   icon: icons.data
    // },
    // {
    //   id: 'ICO Transfer',
    //   title: <FormattedMessage id="Withdraw Funds" />,
    //   type: 'item',
    //   url: '/user/ico-transfer/',
    //   icon: icons.data
    // },
    {
      id: 'withdrawFunds',   
      title: <FormattedMessage id="Withdraw Funds" />,
      type: 'item',
      url: '/user/withdraw-funds',
      icon: icons.data
    }

    // {
    //   id: 'social-media',
    //   title: <FormattedMessage id="Verify & Get Tokens" />,
    //   type: 'item',
    //   url: '/user/social-media/',
    //   icon: icons.statistics
    // }
    // {
    //   id: 'w2wTransfers',
    //   title: <FormattedMessage id="W2W Transfers" />,
    //   type: 'item',
    //   url: '/user/w3w-transfers',
    //   icon: icons.data
    // },
    // {
    //   id: 'p2pTransfers',
    //   title: <FormattedMessage id="P2P Transfers" />,
    //   type: 'item',
    //   url: '/user/p2p-transfers',
    //   icon: icons.data
    // }
  ]
};

export default profile;
