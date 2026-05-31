import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { Outlet } from "react-router-dom";

// Rutas donde NO se muestra el Navbar ni el Footer
const NO_LAYOUT_ROUTES = ["/admin"];

export default function Layout() {
  const { pathname } = useLocation();

  const hideLayout = NO_LAYOUT_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (hideLayout) {
    return <Outlet />;
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}