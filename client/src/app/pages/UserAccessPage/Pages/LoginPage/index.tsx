import { PageWrapper } from 'app/components/PageWrapper';
import { Helmet } from 'react-helmet-async';

export function LoginPage() {
  return (
    <>
      <Helmet>
        <title>Login Page</title>
        <meta name="LoginPage" content="User must login to view the content" />
      </Helmet>
      <PageWrapper>
        <div>Login page</div>
      </PageWrapper>
    </>
  );
}
