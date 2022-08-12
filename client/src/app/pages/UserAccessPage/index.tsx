import { PageWrapper } from 'app/components/PageWrapper';
import { Helmet } from 'react-helmet-async';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { LoginPage } from './Pages/LoginPage/index';

export function UserAccessPage() {
  let { path, url } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="LoginPage" content="User must login to view the content" />
      </Helmet>
      <PageWrapper>
        <Link to={`${url}/login`}>Login page</Link>
        <Switch>
          <Route path={`${path}/login`}>
            <LoginPage></LoginPage>
          </Route>
        </Switch>
      </PageWrapper>
    </>
  );
}
