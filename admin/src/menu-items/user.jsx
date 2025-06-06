// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Story, Fatrows, PresentionChart, UserRemove, MoneyForbidden } from 'iconsax-react';

// type

// icons
const icons = {
  widgets: Story,
  statistics: Story,
  data: Fatrows,
  chart: PresentionChart,
  ban: UserRemove,
  levelIncomeBan: MoneyForbidden
};

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const profile = {
  id: 'group-profile',
  title: <FormattedMessage id="User" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'invest',
      title: <FormattedMessage id="All Users" />,
      type: 'item',
      url: '/user/allUsers',
      icon: icons.statistics
    },
    {
      id: 'invest',
      title: <FormattedMessage id="Update Content" />,
      type: 'item',
      url: '/user/updateContent',
      icon: icons.statistics
    },
    {
      id: 'ban-downline',
      title: 'Ban Management',
      type: 'item',
      url: '/user/ban-downline',
      icon: icons.ban
    },
    {
      id: 'level-income-ban',
      title: 'Level Income Ban',
      type: 'item',
      url: '/user/level-income-ban',
      icon: icons.levelIncomeBan
    },
    {
      id: 'stop-minting',
      title: 'Stop Minting',
      type: 'item',
      url: '/user/stop-minting',
      icon: icons.StopCircle
    },
    {
      id: 'start-minting',
      title: 'Start Minting',
      type: 'item',
      url: '/user/start-minting',
      icon: icons.StopCircle
    },

    // {
    //   id: 'data',
    //   title: <FormattedMessage id="Transfer Funds" />,
    //   type: 'item',
    //   url: '/user/transferFunds',
    //   icon: icons.data
    // },
    // {
    //   id: 'data',
    //   title: <FormattedMessage id="Deduct Funds" />,
    //   type: 'item',
    //   url: '/user/deductFunds',
    //   icon: icons.data
    // }
  ]
};

export default profile;
