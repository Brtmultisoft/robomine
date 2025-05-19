// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Wallet3, MoneyRemove, MoneySend } from 'iconsax-react'; // You can choose other icons if preferred

// icons
const icons = {
  wallet: Wallet3,
  fundTransfer: MoneySend,
  fundDeduct: MoneyRemove
};

// ==============================|| MENU ITEMS - WALLET ||============================== //

const wallet = {
  id: 'group-wallet',
  title: <FormattedMessage id="Wallet" />,
  icon: icons.wallet,
  type: 'group',
  children: [
    {
      id: 'fund-transfer',
      title: <FormattedMessage id="Fund Transfer" />,
      type: 'item',
      url: '/fund-transfer',
      icon: icons.fundTransfer
    },
    {
      id: 'fund-deduct',
      title: <FormattedMessage id="Fund Deduct" />,
      type: 'item',
      url: '/fund-deduct',
      icon: icons.fundDeduct
    }
  ]
};

export default wallet;
