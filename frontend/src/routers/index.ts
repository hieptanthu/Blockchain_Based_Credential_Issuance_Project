import ListMySchool from "../Pages/SchoolManager/ListSchool";
import SchoolManager from "../Pages/SchoolManager";
import DegreeManagement from "../Pages/DegreeManagement";
import Degree from "../Pages/DegreeManagement/Degree";
import Home from "../Pages/Home";
export const path = {
  index: "/",
  ListMySchool: "/ListMySchool/:_id",
  SchoolManager: "/SchoolManager",
  DegreeManagement: "/DegreeManagement/:_school_address",
  Degree: "/Degree/:_addressDegree",
};

const routers = [
  {
    path: path.index,
    element: Home,
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
