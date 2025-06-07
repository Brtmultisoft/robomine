// project-imports
import applications from './applications';
import widget from './widget';
import formsTables from './forms-tables';
import samplePage from './sample-page';
import chartsMap from './charts-map';
import support from './support';
import pages from './pages';
import components from './components';

import transactions from './transaction-reports'
import incomes from './incomes'
import user from './user'
import task from './task'
import investments from './investment'
import customerSupport from './customerSupport'
import wallet from './wallet';
import rankRewards from './rank-rewards';
import rbmWhitelist from './rbm-whitelist';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [user, investments, wallet, transactions, incomes, rankRewards, rbmWhitelist]
  // items: [user, investments, incomes, customerSupport]
};

export default menuItems;
