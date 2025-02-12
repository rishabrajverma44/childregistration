import Home from "../PwaPages/Home";
import NotFound from "../Components/prebuiltComponent/NotFound";
import Layout from "../Components/navBar/Layout";
import PublicRoute from "./PublicRoute";
import ChildRegistration from "../PwaPages/Pages/Add/ChildRegistration";
import ChildMonitoring from "../PwaPages/Pages/Add/ChildMonitoring";
import ChildMonitoringList from "../PwaPages/Pages/List/ChildMonitoring";
import ChildList from "../PwaPages/Pages/List/ChildList";

import MotherRegistration from "../PwaPages/Pages/Add/MotherRegistration";
import MotherMonitoring from "../PwaPages/Pages/Add/MotherMonitoring";
import MotherMonitoringList from "../PwaPages/Pages/List/MotherMonitoring";
import MotherdList from "../PwaPages/Pages/List/MotherList";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <PublicRoute>
            <Home />
          </PublicRoute>
        ),
      },
      {
        path: "/Childlist",
        element: (
          <PublicRoute>
            <ChildList />
          </PublicRoute>
        ),
      },
      {
        path: "/ChildRegistration",
        element: (
          <PublicRoute>
            <ChildRegistration />
          </PublicRoute>
        ),
      },
      {
        path: "/Childmonitorlist",
        element: (
          <PublicRoute>
            <ChildMonitoringList />
          </PublicRoute>
        ),
      },
      {
        path: "/childmonitoring",
        element: (
          <PublicRoute>
            <ChildMonitoring />
          </PublicRoute>
        ),
      },

      {
        path: "/Motherlist",
        element: (
          <PublicRoute>
            <MotherdList />
          </PublicRoute>
        ),
      },
      {
        path: "/MotherRegistration",
        element: (
          <PublicRoute>
            <MotherRegistration />
          </PublicRoute>
        ),
      },
      {
        path: "/Mothermonitorlist",
        element: (
          <PublicRoute>
            <MotherMonitoringList />
          </PublicRoute>
        ),
      },
      {
        path: "/Mothermonitoring",
        element: (
          <PublicRoute>
            <MotherMonitoring />
          </PublicRoute>
        ),
      },

      { path: "*", element: <NotFound /> },
    ],
  },
];

export default routes;
