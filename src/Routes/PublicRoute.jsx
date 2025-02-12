import PublicFooter from "../Components/navBar/PublicFooter";
import PublicNav from "../Components/navBar/PublicNav";

const PublicRoute = ({ children }) => {
  return (
    <>
      <PublicNav />
      {children}
      <PublicFooter />
    </>
  );
};

export default PublicRoute;
