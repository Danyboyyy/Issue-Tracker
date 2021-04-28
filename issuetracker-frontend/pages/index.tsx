import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import React from 'react'
import NavBar from '../components/NavBar';
import { useIssuesQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Home = () => {
  const [{ data }] = useIssuesQuery();

  return (
    <>
      <NavBar />
      <Link href='/createpost'>
        Crea
      </Link>
      <div>hello world</div>
      <br />
      {!data ? <div>Loading...</div> : data.issues.map(i => <div key={i.id}>{i.title}</div>)}
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
