// assets
import { Award, Star1, TickCircle, Clock } from 'iconsax-react';

// icons
const icons = {
  Award,
  Star: Star1,
  CheckCircle: TickCircle,
  Clock
};

// ==============================|| MENU ITEMS - RANK REWARDS ||============================== //

const rankRewards = {
  id: 'group-rank-rewards',
  title: 'Rank Management',
  type: 'group',
  children: [
    {
      id: 'rank-rewards',
      title: 'Rank Rewards',
      type: 'collapse',
      icon: icons.Award,
      children: [
        {
          id: 'pending-rank-rewards',
          title: 'Pending Approvals',
          type: 'item',
          url: '/rank-rewards/pending',
          icon: icons.Clock,
          breadcrumbs: false
        },
        {
          id: 'rank-rewards-history',
          title: 'Rewards History',
          type: 'item',
          url: '/rank-rewards/history',
          icon: icons.CheckCircle,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default rankRewards;
