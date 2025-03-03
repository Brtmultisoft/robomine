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

const incomeWording = "Bonus"

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const incomes = {
  id: 'group-incomes',
  title: <FormattedMessage id="Income Reports" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'token-reports',
      title: <FormattedMessage id={`Global Pool Matrix Bonus`} />,
      type: 'item',
      url: '/incomes/token-reports',
      icon: icons.statistics
    },


    {
      id: 'invest',
      title: <FormattedMessage id={`Provision ${incomeWording}`} />,
      type: 'item',
      url: '/incomes/roi',
      icon: icons.statistics
    },
    {
      id: 'data',
      title: <FormattedMessage id={`Direct ${incomeWording}`} />,
      type: 'item',
      url: '/incomes/direct',
      icon: icons.data
    },
    {
      id: 'level-reports',
      title: <FormattedMessage id={`Level Income`} />,
      type: 'item',
      url: '/incomes/level-reports',
      icon: icons.data
    },
    {
      id: 'data',
      title: <FormattedMessage id={`Prime Member Income`} />,
      type: 'item',
      url: '/incomes/prime-income',
      icon: icons.data
    },
    {
      id: 'data',
      title: <FormattedMessage id={`Founder Member Income`} />,
      type: 'item',
      url: '/incomes/founder-income',
      icon: icons.data
    },
    {
      id: 'general-settings',
      title: <FormattedMessage id={`General Settings`} />,
      type: 'item',
      url: '/incomes/general-settings',
      icon: icons.data
    },
  ]
};

export default incomes;
