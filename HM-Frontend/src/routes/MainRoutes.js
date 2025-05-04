// import { lazy } from 'react';

// // project imports
// import MainLayout from 'layout/MainLayout';
// import Loadable from 'ui-component/Loadable';
// import AdminComplaint from 'views/AdminComplaint';
// import AdminComplaintDashboard from 'views/AdminComplaint/ComplaintDashboard';
// import AdminDashboard from 'views/AdminDashboard';
// import AdminPayments from 'views/AdminPayments';
// import AdminProfile from 'views/AdminProfile/AdminProfile';
// import AdminReports from 'views/Adminreports';
// import AdminPackages from 'views/AdminSubscriptions';
// import PackagesDashboard from 'views/AdminSubscriptions/Components/PackagesDashboard';
// import Complaint from 'views/Complaint';
// import ComplaintDashboard from 'views/Complaint/ComplaintDashboard';
// import Customer from 'views/Customer';
// import CustomerDashboard from 'views/Customer/Components';
// import HotelManagement from 'views/HotelManagement';
// import HotelManagementDashboard from 'views/HotelManagement/Components';
// import HotelPaymentsDetails from 'views/HotelPayments';
// import HotelProfile from 'views/HotelProfile/hotelProfile';
// import HotelSubscriptionsDetails from 'views/HotelSubscriptions';
// import Laundary from 'views/Laundary';
// import MainDashboard from 'views/mainDashboard/Default';
// import ReservationDashboard from 'views/Reservation/Components/ReservationDashboard';
// import Food from 'views/ReservationFood/index';
// import Restaurant from 'views/restaurant';
// import Room from 'views/Room';
// import SeparateFoodView from 'views/SeparateFoodOrder/FoodView';
// import StaffManagment from 'views/Staff';
// import EmployeeDashboard from 'views/Staff/Components';
// import VisitorDashboard from 'views/VisitorInformation/Components';

// import CustomerBookingHistory from 'views/Customer/Components/CustomerBookingHistory';
// import GeneralReports from 'views/dashboard/GeneralReports';
// import KotReports from 'views/dashboard/KotReports';
// import PoliceReports from 'views/dashboard/PoliceReports';

// import ErrorPage from 'views/error/ErrorPage';
// import PrivateRoute from 'views/error/PrivateRoute';
// import ViewExpense from 'views/Expenses/ViewExpense';
// import Inventory from 'views/inventory';
// import ViewInvoices from 'views/Invoices';
// import KitchenDashboard from 'views/KitchenOrderTicket/Components';
// import MenuView from 'views/restaurant/MenuView';
// import SpaStaffView from 'views/SpaManagement/components/spaStaff/ShowStaff';
// import SpaManagement from 'views/SpaManagement/index.';

// // dashboard routing
// const DashboardDefault = Loadable( lazy( () => import( 'views/dashboard/Default' ) ) );
// const RoomManagement = Loadable( lazy( () => import( 'views/Room' ) ) );
// const Reservation = Loadable( lazy( () => import( 'views/Reservation' ) ) );
// const Expenses = Loadable( lazy( () => import( 'views/Expenses' ) ) );
// const KitchenOrderTicket = Loadable( lazy( () => import( 'views/KitchenOrderTicket' ) ) );

// // ==============================|| MAIN ROUTING ||============================== //
// const getUserData = () => {
//   const userData = localStorage.getItem( 'hotelData' );
//   return userData ? JSON.parse( userData ) : null;
// };
// // const { role, permissions } = getUserData();
// const { role, permissions } = getUserData() ?? { role: null, permissions: [] };

// const MainRoutes = {
//   path: '/',
//   element: (
//     <PrivateRoute>
//       <MainLayout />
//     </PrivateRoute>
//   ),
//   children: [
//     {
//       path: '/',
//       element: userData?.role === 'admin' ? <AdminDashboard /> : userData?.permissions?.length === 0 ? <ErrorPage /> : <MainDashboard />
//     },


//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'roommanagement',
//           element: (
//             <PrivateRoute>
//               <RoomManagement />
//             </PrivateRoute>
//           )
//           // element: <RoomManagement />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'reservation',
//           element: <Reservation />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'staffmanagement',
//           element: <StaffManagment />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'spamanagement',
//           element: <SpaManagement />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'customers',
//           element: <Customer />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'rooms',
//           element: <Room />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'expenses',
//           element: <Expenses />
//         }
//       ]
//     },

//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'kot',
//           element: <KitchenOrderTicket />
//         }
//       ]
//     },

//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'restaurant',
//           element: <Restaurant />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'restaurant/viewmenu',
//           element: <MenuView />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'complaint',
//           element: <Complaint />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'laundary',
//           element: <Laundary />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'inventory',
//           element: <Inventory />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'reports',
//           element: <DashboardDefault />
//         }
//       ]
//     },

//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'policyreports',
//           element: <PoliceReports />
//         }
//       ]
//     },

//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'generalreport',
//           element: <GeneralReports />
//         }
//       ]
//     },

//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'kotreports',
//           element: <KotReports />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/reservation/addfood/:id',
//           element: <Food />
//         }
//       ]
//     },

//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/separatefood/addfood',
//           element: <SeparateFoodView />
//         }
//       ]
//     },

//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/lead/view/:id',
//           element: <RoomManagement />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/customer/view/:phone',
//           element: <CustomerDashboard />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/customer/view/specificbooking/:id',
//           element: <CustomerBookingHistory />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/employee/view/:id',
//           element: <EmployeeDashboard />
//         },
//         {
//           path: '/dashboard/spaStaff/view/:id',
//           element: <SpaStaffView />
//         },
//         {
//           path: '/dashboard/kot/view/:id',
//           element: <KitchenDashboard />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/expense/view/:hotelId/:id',
//           element: <ViewExpense />
//         }
//       ]
//     },

//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/complaint/view/:id',
//           element: <ComplaintDashboard />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/reservation/view/:id',
//           element: <ReservationDashboard />
//         }
//       ]
//     },

//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/hotel',
//           element: <HotelManagement />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/hotel/view/:id',
//           element: <HotelManagementDashboard />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'profile',
//           element: <HotelProfile />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'invoice',
//           element: <ViewInvoices />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'adminprofile',
//           element: <AdminProfile />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: 'admincomplaint',
//           element: <AdminComplaint />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/admincomplaint/view/:id',
//           element: <AdminComplaintDashboard />
//         }
//       ]
//     },
//     // {
//     //   path: 'dashboard',
//     //   children: [
//     //     {
//     //       path: '/dashboard/admindashboard',
//     //       element: <AdminDashboard />
//     //     }
//     //   ]
//     // },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/adminreports',
//           element: <AdminReports />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/subscriptions',
//           element: <AdminPackages />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/hotelsubscriptions',
//           element: <HotelSubscriptionsDetails />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/payments',
//           element: <AdminPayments />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/hotelsubscriptions',
//           element: <HotelSubscriptionsDetails />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/hotelpayments',
//           element: <HotelPaymentsDetails />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/packages/view/:id',
//           element: <PackagesDashboard />
//         }
//       ]
//     },
//     {
//       path: 'dashboard',
//       children: [
//         {
//           path: '/dashboard/visitor/view/:phone',
//           element: <VisitorDashboard />
//         }
//       ]
//     }
//   ]
// };

// export default MainRoutes;
import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AdminComplaint from 'views/AdminComplaint';
import AdminComplaintDashboard from 'views/AdminComplaint/ComplaintDashboard';
import AdminDashboard from 'views/AdminDashboard';
import AdminPayments from 'views/AdminPayments';
import AdminProfile from 'views/AdminProfile/AdminProfile';
import AdminReports from 'views/Adminreports';
import AdminPackages from 'views/AdminSubscriptions';
import PackagesDashboard from 'views/AdminSubscriptions/Components/PackagesDashboard';
import Complaint from 'views/Complaint';
import ComplaintDashboard from 'views/Complaint/ComplaintDashboard';
import Customer from 'views/Customer';
import CustomerDashboard from 'views/Customer/Components';
import HotelManagement from 'views/HotelManagement';
import HotelManagementDashboard from 'views/HotelManagement/Components';
import HotelPaymentsDetails from 'views/HotelPayments';
import HotelProfile from 'views/HotelProfile/hotelProfile';
import HotelSubscriptionsDetails from 'views/HotelSubscriptions';
import Laundary from 'views/Laundary';
import MainDashboard from 'views/mainDashboard/Default';
import ReservationDashboard from 'views/Reservation/Components/ReservationDashboard';
import Food from 'views/ReservationFood/index';
import Restaurant from 'views/restaurant';
import Room from 'views/Room';
import SeparateFoodView from 'views/SeparateFoodOrder/FoodView';
import StaffManagment from 'views/Staff';
import EmployeeDashboard from 'views/Staff/Components';
import VisitorDashboard from 'views/VisitorInformation/Components';

import CustomerBookingHistory from 'views/Customer/Components/CustomerBookingHistory';
import GeneralReports from 'views/dashboard/GeneralReports';
import KotReports from 'views/dashboard/KotReports';
import PoliceReports from 'views/dashboard/PoliceReports';

import ErrorPage from 'views/error/ErrorPage';
import PrivateRoute from 'views/error/PrivateRoute';
import ViewExpense from 'views/Expenses/ViewExpense';
import Inventory from 'views/inventory';
import ViewInvoices from 'views/Invoices';
import KitchenDashboard from 'views/KitchenOrderTicket/Components';
import MenuView from 'views/restaurant/MenuView';
import SpaStaffView from 'views/SpaManagement/components/spaStaff/ShowStaff';
import SpaManagement from 'views/SpaManagement/index.';

// dashboard routing
const DashboardDefault = Loadable( lazy( () => import( 'views/dashboard/Default' ) ) );
const RoomManagement = Loadable( lazy( () => import( 'views/Room' ) ) );
const Reservation = Loadable( lazy( () => import( 'views/Reservation' ) ) );
const Expenses = Loadable( lazy( () => import( 'views/Expenses' ) ) );
const KitchenOrderTicket = Loadable( lazy( () => import( 'views/KitchenOrderTicket' ) ) );

// ==============================|| MAIN ROUTING ||============================== /

const userData = JSON.parse( localStorage.getItem( 'hotelData' ) );

const MainRoutes = {
  path: '/',
  element: (
    <PrivateRoute>
      <MainLayout />
    </PrivateRoute>
  ),
  children: [
    {
      path: '/',
      element: userData?.role === 'admin' ? <AdminDashboard /> : userData?.permissions?.length === 0 ? <ErrorPage /> : <MainDashboard />
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'roommanagement',
          element: (
            <PrivateRoute>
              <RoomManagement />
            </PrivateRoute>
          )
          // element: <RoomManagement />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'reservation',
          element: <Reservation />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'staffmanagement',
          element: <StaffManagment />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'spamanagement',
          element: <SpaManagement />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'customers',
          element: <Customer />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'rooms',
          element: <Room />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'expenses',
          element: <Expenses />
        }
      ]
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'kot',
          element: <KitchenOrderTicket />
        }
      ]
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'restaurant',
          element: <Restaurant />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'restaurant/viewmenu',
          element: <MenuView />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'complaint',
          element: <Complaint />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'laundary',
          element: <Laundary />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'inventory',
          element: <Inventory />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'reports',
          element: <DashboardDefault />
        }
      ]
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'policyreports',
          element: <PoliceReports />
        }
      ]
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'generalreport',
          element: <GeneralReports />
        }
      ]
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'kotreports',
          element: <KotReports />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/reservation/addfood/:id',
          element: <Food />
        }
      ]
    },

    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/separatefood/addfood',
          element: <SeparateFoodView />
        }
      ]
    },

    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/lead/view/:id',
          element: <RoomManagement />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/customer/view/:phone',
          element: <CustomerDashboard />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/customer/view/specificbooking/:id',
          element: <CustomerBookingHistory />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/employee/view/:id',
          element: <EmployeeDashboard />
        },
        {
          path: '/dashboard/spaStaff/view/:id',
          element: <SpaStaffView />
        },
        {
          path: '/dashboard/kot/view/:id',
          element: <KitchenDashboard />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/expense/view/:hotelId/:id',
          element: <ViewExpense />
        }
      ]
    },

    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/complaint/view/:id',
          element: <ComplaintDashboard />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/reservation/view/:id',
          element: <ReservationDashboard />
        }
      ]
    },

    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/hotel',
          element: <HotelManagement />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/hotel/view/:id',
          element: <HotelManagementDashboard />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'profile',
          element: <HotelProfile />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'invoice',
          element: <ViewInvoices />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'adminprofile',
          element: <AdminProfile />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'admincomplaint',
          element: <AdminComplaint />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/admincomplaint/view/:id',
          element: <AdminComplaintDashboard />
        }
      ]
    },
    // {
    //   path: 'dashboard',
    //   children: [
    //     {
    //       path: '/dashboard/admindashboard',
    //       element: <AdminDashboard />
    //     }
    //   ]
    // },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/adminreports',
          element: <AdminReports />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/subscriptions',
          element: <AdminPackages />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/hotelsubscriptions',
          element: <HotelSubscriptionsDetails />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/payments',
          element: <AdminPayments />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/hotelsubscriptions',
          element: <HotelSubscriptionsDetails />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/hotelpayments',
          element: <HotelPaymentsDetails />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/packages/view/:id',
          element: <PackagesDashboard />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard/visitor/view/:phone',
          element: <VisitorDashboard />
        }
      ]
    }
  ]
};

export default MainRoutes;