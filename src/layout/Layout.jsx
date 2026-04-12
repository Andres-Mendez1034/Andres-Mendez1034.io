import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
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