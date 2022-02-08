import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const Dynamic = () => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <React.Fragment>
      <Head>
        <title>{slug}</title>
      </Head>
      <h1>Dynamic page with at &quot;/{slug}&quot;</h1>
    </React.Fragment>
  );
};

export default Dynamic;
