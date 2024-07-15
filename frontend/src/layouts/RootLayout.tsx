import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div>
      <header>TBD</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
