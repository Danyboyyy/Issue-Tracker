import React from 'react'

const Wrapper: React.FC = ({ children }) => {
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
