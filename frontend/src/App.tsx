import Layout from "./components/layout/Layout";
import "./components/style/GlobalStyles.css";
import routers from "./routers";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {routers.map((item, index) => (
              <Route key={index} path={item.path} element={<item.element />} />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
