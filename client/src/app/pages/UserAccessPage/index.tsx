import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { LoginPage } from './Pages/LoginPage/index';

export function UserAccessPage() {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="LoginPage" content="User must login to view the content" />
      </Helmet>
      <PageWrapper>
        <div>Hello qo</div>
        <Router>
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
          </Switch>
        </Router>
      </PageWrapper>
    </>
  );
}
