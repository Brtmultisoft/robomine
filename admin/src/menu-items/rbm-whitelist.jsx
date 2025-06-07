// assets
import {
  MoneyRecive,
  MoneySend,
  UserRemove,
  Wallet3,
  PresentionChart,
  Profile2User,
  DocumentText1,
  Setting2
} from 'iconsax-react';

// icons
const icons = {
  MoneyRecive,
  MoneySend,
  UserCheck: UserRemove,
  Wallet3,
  Chart: PresentionChart,
  People: Profile2User,
  DocumentText: DocumentText1,
  Setting2
};

// ==============================|| MENU ITEMS - RBM WHITELIST ||============================== //

const rbmWhitelist = {
  id: 'group-rbm-whitelist',
  title: 'RBM WhiteList',
  type: 'group',
  children: [
    {
      id: 'rbm-whitelist',
      title: 'RBM WhiteList',
      type: 'collapse',
      icon: icons.Wallet3,
      children: [
        {
          id: 'rbm-dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/rbm-whitelist/dashboard',
          icon: icons.Chart,
          breadcrumbs: false
        },
        {
          id: 'rbm-transfers',
          title: 'Transfers',
          type: 'collapse',
          icon: icons.MoneySend,
          children: [
            {
              id: 'single-transfer',
              title: 'Single Transfer',
              type: 'item',
              url: '/rbm-whitelist/transfers/single',
              icon: icons.MoneyRecive,
              breadcrumbs: false
            },
            {
              id: 'multi-transfer',
              title: 'Multi Transfer',
              type: 'item',
              url: '/rbm-whitelist/transfers/multi',
              icon: icons.MoneySend,
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'rbm-queries',
          title: 'Queries',
          type: 'collapse',
          icon: icons.DocumentText,
          children: [
            {
              id: 'check-allowance',
              title: 'Check Allowance',
              type: 'item',
              url: '/rbm-whitelist/queries/allowance',
              icon: icons.Wallet3,
              breadcrumbs: false
            },
            {
              id: 'check-registration',
              title: 'Check Registration',
              type: 'item',
              url: '/rbm-whitelist/queries/registration',
              icon: icons.UserCheck,
              breadcrumbs: false
            },
            {
              id: 'check-balance',
              title: 'Check Balance',
              type: 'item',
              url: '/rbm-whitelist/queries/balance',
              icon: icons.Wallet3,
              breadcrumbs: false
            },
            {
              id: 'total-extractable',
              title: 'Total Extractable',
              type: 'item',
              url: '/rbm-whitelist/queries/total-extractable',
              icon: icons.Chart,
              breadcrumbs: false
            },
            {
              id: 'registered-users',
              title: 'Registered Users',
              type: 'item',
              url: '/rbm-whitelist/queries/registered-users',
              icon: icons.People,
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'rbm-settings',
          title: 'Settings',
          type: 'item',
          url: '/rbm-whitelist/settings',
          icon: icons.Setting2,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default rbmWhitelist;
