import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

interface Props {
  
}

const Wrapper = ({ children }) => {
  return (
   <Container className='mt-5'>
     <Row> 
       <Col>
        {children}
       </Col>
     </Row>
   </Container> 
  );
}

export default Wrapper
