import React from 'react';
import '../style/index.css';

export default function MyApp({ Component, pageProps }: any) {
  return (
    <Component {...pageProps} />
  );
}
