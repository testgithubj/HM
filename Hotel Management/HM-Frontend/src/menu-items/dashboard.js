import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import BedroomParentTwoToneIcon from '@mui/icons-material/BedroomParentTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import FoodBankTwoToneIcon from '@mui/icons-material/FoodBankTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import SummarizeTwoToneIcon from '@mui/icons-material/SummarizeTwoTone';
import LocalAtmTwoToneIcon from '@mui/icons-material/LocalAtmTwoTone';
import DryCleaningTwoToneIcon from '@mui/icons-material/DryCleaningTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import SupportAgentTwoToneIcon from '@mui/icons-material/SupportAgentTwoTone';
import HailTwoToneIcon from '@mui/icons-material/HailTwoTone';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SpaIcon from '@mui/icons-material/Spa';

// assets
import {
  // DashboardTwoToneIcon,
  // CalendarMonthTwoToneIcon,
  IconMail,
  IconFileUpload,
  // LocalAtmTwoToneIcon,
  IconPhoneCall,
  IconAntennaBars5,
  // SummarizeTwoToneIcon,
  IconNotebook,
  IconPhoneCheck,
  IconUsers,
  IconSoup,
  // DryCleaningTwoToneIcon,
  // BedroomParentTwoToneIcon,
  IconUserCircle,
  IconPackage
  // MonetizationOnTwoToneIcon
} from '@tabler/icons';

// constant
const icons = {
  DashboardTwoToneIcon,
  CalendarMonthTwoToneIcon,
  IconMail,
  IconFileUpload,
  LocalAtmTwoToneIcon,
  IconPhoneCall,
  IconAntennaBars5,
  SummarizeTwoToneIcon,
  IconNotebook,
  IconPhoneCheck,
  PeopleAltTwoToneIcon,
  BedroomParentTwoToneIcon,
  FoodBankTwoToneIcon,
  DryCleaningTwoToneIcon,
  MonetizationOnTwoToneIcon,
  Inventory2OutlinedIcon,
  AccountBoxTwoToneIcon,
  IconUserCircle,
  IconPackage,
  SupportAgentTwoToneIcon,
  HailTwoToneIcon,
  SpaIcon
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  // title: 'Dashboard-Menu',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Analytics',
      type: 'item',
      url: '/',
      icon: icons.DashboardTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '01',
      title: 'Room Management',
      type: 'item',
      url: '/dashboard/roommanagement',
      icon: icons.BedroomParentTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '02',
      title: 'Reservation',
      type: 'item',
      url: '/dashboard/reservation',
      icon: icons.CalendarMonthTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '03',
      title: 'Staff Management',
      type: 'item',
      url: '/dashboard/staffmanagement',
      icon: icons.PeopleAltTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '15',
      title: 'Spa Management',
      type: 'item',
      url: '/dashboard/spamanagement',
      icon: icons.SpaIcon,
      breadcrumbs: false
    },
    {
      id: '04',
      title: 'Restaurant',
      type: 'item',
      url: '/dashboard/restaurant',
      icon: icons.FoodBankTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '05',
      title: 'Customers',
      type: 'item',
      url: '/dashboard/customers',
      icon: icons.HailTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '07',
      title: 'Complaint',
      type: 'item',
      url: '/dashboard/complaint',
      icon: icons.SupportAgentTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '08',
      title: 'Kitchen Order Ticket',
      type: 'item',
      url: '/dashboard/kot',
      icon: icons.SummarizeTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '14',
      title: 'Inventory',
      type: 'item',
      url: '/dashboard/inventory',
      icon: icons.Inventory2OutlinedIcon,
      breadcrumbs: false
    },
    {
      id: '09',
      title: 'Invoice',
      type: 'item',
      url: '/dashboard/invoice',
      icon: icons.LocalAtmTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '10',
      title: 'Laundry',
      type: 'item',
      url: '/dashboard/laundary',
      icon: icons.DryCleaningTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '11',
      title: 'Expenses',
      type: 'item',
      url: '/dashboard/expenses',
      icon: icons.MonetizationOnTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '12',
      title: 'Subscriptions',
      type: 'item',
      url: '/dashboard/hotelsubscriptions',
      icon: icons.IconPackage,
      breadcrumbs: false
    },
    {
      id: '13',
      title: 'Payments',
      type: 'item',
      url: '/dashboard/hotelpayments',
      icon: icons.MonetizationOnTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '06',
      title: 'Reports',
      type: 'collapse',
      icon: icons.SummarizeTwoToneIcon,
      children: [
        {
          id: '101',
          title: 'Daily Sales Report',
          type: 'item',
          url: '/dashboard/reports',
          icon: icons.SummarizeTwoToneIcon,
          breadcrumbs: false
        },
        {
          id: '102',
          title: 'Police Report',
          type: 'item',
          url: '/dashboard/policyreports',
          icon: icons.SummarizeTwoToneIcon,
          breadcrumbs: false
        },
        {
          id: '103',
          title: 'General Report',
          type: 'item',
          url: '/dashboard/generalreport',
          icon: icons.SummarizeTwoToneIcon,
          breadcrumbs: false
        },
        {
          id: '104',
          title: 'Kot Report',
          type: 'item',
          url: '/dashboard/kotreports',
          icon: icons.SummarizeTwoToneIcon,
          breadcrumbs: false
        }
      ]
    },
    // {
    //   id: '14',
    //   title: 'Hotel Profile',
    //   type: 'item',
    //   url: '/dashboard/profile',
    //   icon: icons.AccountBoxTwoToneIcon,
    //   breadcrumbs: false
    // }
  ]
};

// ==============================||Hotel Admin DASHBOARD MENU ITEMS ||============================== //

const hoteladmindashboard = {
  // title: 'Dashboard-Menu',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Analytics',
      type: 'item',
      url: '/',
      icon: icons.DashboardTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '01',
      title: 'Room Management',
      type: 'item',
      url: '/dashboard/roommanagement',
      icon: icons.BedroomParentTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '02',
      title: 'Reservation',
      type: 'item',
      url: '/dashboard/reservation',
      icon: icons.CalendarMonthTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '03',
      title: 'Staff Management',
      type: 'item',
      url: '/dashboard/staffmanagement',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: '04',
      title: 'Restaurant',
      type: 'item',
      url: '/dashboard/restaurant',
      icon: icons.IconSoup,
      breadcrumbs: false
    },

    {
      id: '05',
      title: 'Reports',
      type: 'item',
      url: '/dashboard/reports',
      icon: icons.SummarizeTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '06',
      title: 'Complaint',
      type: 'item',
      url: '/dashboard/complaint',
      icon: icons.SupportAgentTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '07',
      title: 'Laundary',
      type: 'item',
      url: '/dashboard/laundary',
      icon: icons.DryCleaningTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '08',
      title: 'Expenses',
      type: 'item',
      url: '/dashboard/expenses',
      icon: icons.MonetizationOnTwoToneIcon,
      breadcrumbs: false
    },

    {
      id: '09',
      title: 'Customers',
      type: 'item',
      url: '/dashboard/customers',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: '10',
      title: 'Subscriptions',
      type: 'item',
      url: '/dashboard/hotelsubscriptions',
      icon: icons.IconPackage,
      breadcrumbs: false
    },
    {
      id: '11',
      title: 'Payments',
      type: 'item',
      url: '/dashboard/hotelpayments',
      icon: icons.MonetizationOnTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '12',
      title: 'Hotel Profile',
      type: 'item',
      url: '/dashboard/profile',
      icon: icons.IconUserCircle,
      breadcrumbs: false
    }
  ]
};

// ==============================|| ADMIN DASHBOARD MENU ITEMS ||============================== //
const admindashboard = {
  // title: 'Dashboard-Menu',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Analytics',
      type: 'item',
      url: '/',
      icon: icons.DashboardTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '01',
      title: 'Hotel Management',
      type: 'item',
      url: '/dashboard/hotel',
      icon: icons.BedroomParentTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '03',
      title: 'Support',
      type: 'item',
      url: '/dashboard/admincomplaint',
      icon: icons.SupportAgentTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '04',
      title: 'Reports',
      type: 'item',
      url: '/dashboard/adminreports',
      icon: icons.SummarizeTwoToneIcon,
      breadcrumbs: false
    },
    {
      id: '05',
      title: 'Packages',
      type: 'item',
      url: '/dashboard/subscriptions',
      icon: icons.IconPackage,
      breadcrumbs: false
    },
    {
      id: '06',
      title: 'Payments',
      type: 'item',
      url: '/dashboard/payments',
      icon: icons.MonetizationOnTwoToneIcon,
      breadcrumbs: false
    }
  ]
};

export { dashboard, hoteladmindashboard, admindashboard };
