import ListMySchool from "../Pages/SchoolManager/ListSchool";
import SchoolManager from "../Pages/SchoolManager";
import DegreeManagement from "../Pages/DegreeManagement";
import Degree from "../Pages/DegreeManagement/Degree";
import Home from "../Pages/Home";
import Clause from "../Pages/Clause";
import ContactPage from "../Pages/Contact";
export const path = {
  index: "/",
  ListMySchool: "/ListMySchool/:_id",
  SchoolManager: "/SchoolManager",
  DegreeManagement: "/DegreeManagement/:_school_address",
  Degree: "/Degree/:ojbID",
  Clause: "Clause",
  Contact: "Contact",
};

const routers = [
  {
    path: path.index,
    element: Home,
  },
  {
    path: path.Contact,
    element: ContactPage,
  },
  {
    path: path.Clause,
    element: Clause,
  },

  {
    path: path.ListMySchool,
    element: ListMySchool,
  },
  {
    path: path.SchoolManager,
    element: SchoolManager,
  },
  {
    path: path.DegreeManagement,
    element: DegreeManagement,
  },
  {
    path: path.Degree,
    element: Degree,
  },
];

export default routers;
