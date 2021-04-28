import React from 'react'
import NavBar from './NavBar';
import Wrapper from './Wrapper';

const Layout: React.FC = ({ children }) => {
  return(
    <>
      <NavBar />
      <Wrapper>
        {children}
      </Wrapper>
    </>
  );
};

export default Layout;