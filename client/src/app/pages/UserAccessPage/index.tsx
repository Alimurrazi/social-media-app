import { PageWrapper } from 'app/components/PageWrapper';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
//import { useRouteMatch } from 'react-router-dom';
import { Link, Route, Outlet, Routes } from 'react-router-dom';
import { LoginPage } from './Pages/LoginPage/index';

export function UserAccessPage() {
  //let { path, url } = useRouteMatch();

  // useEffect(() => {
  //   console.log(path);
  // }, [path, url]);

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="LoginPage" content="User must login to view the content" />
      </Helmet>
      <PageWrapper>
        <div>Hello world</div>
        <Link to={`login`}>Login page</Link>
        <Outlet />
        <Routes>
          <Route path="login" element={<LoginPage />}></Route>
        </Routes>
      </PageWrapper>
    </>
  );
}
