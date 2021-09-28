import React from 'react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const divStyle = { paddingTop: '15px' };
  return (
    <footer>
      <div style={divStyle} className="ui center aligned container">
        <hr />
        <b>Homeless Outreach & Medical Education Project</b><br />
        <b>Designed by UH Cryptics</b><br />
        <b><a style={{ color: 'blue' }} href="https://github.com/uh-cryptics/zeus-matrp">ZEUS Project Page</a></b>
      </div>
    </footer>
  );
};

export default Footer;
