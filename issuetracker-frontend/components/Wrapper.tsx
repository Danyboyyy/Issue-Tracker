import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

interface Props {
  
}

const Wrapper = ({ children }) => {
  return (
   <div className="App">
     <div className="outer"> 
       <div className="inner">
        {children}
       </div>
     </div>
   </div> 
  );
}

export default Wrapper
