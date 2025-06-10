// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Wallet3, MoneyRecive, People, Setting2, Chart } from 'iconsax-react';

// icons
const icons = {
  rbmDashboard: Wallet3,
  dashboard: Chart,
  transfers: MoneyRecive,
  users: People,
  settings: Setting2
};

// ==============================|| MENU ITEMS - RBM DASHBOARD ||============================== //

const rbmDashboard = {
  id: 'group-rbm-dashboard',
  title: <FormattedMessage id="RBM Dashboard" />,
  icon: icons.rbmDashboard,
  type: 'group',
  children: [
    {
      id: 'rbm-dashboard-main',
      title: <FormattedMessage id="RBM Dashboard" />,
      type: 'item',
      url: '/rbm-dashboard',
      icon: icons.dashboard,
      breadcrumbs: false
    }
  ]
};

export default rbmDashboard;
