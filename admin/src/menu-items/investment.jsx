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

const investments = {
  id: 'group-incomes',
  title: <FormattedMessage id="Investments" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'invest-plan',
      title: <FormattedMessage id={`Invest plan`} />,
      type: 'item',
      url: '/investments/invest',
      icon: icons.statistics
    },
    {
      id: 'invest-report',
      title: <FormattedMessage id={`Investors Report`} />,
      type: 'item',
      url: '/investments/invest-report',
      icon: icons.statistics
    },
   
  ]
};

export default investments;
