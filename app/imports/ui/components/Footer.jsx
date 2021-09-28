import React from 'react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const divStyle = { paddingTop: '15px' };
  return (
    <footer>
      <div style={divStyle} className="ui center aligned container">
        <hr />
        HOME Project<br />
        Designed by UH Cryptics <br />
        <a style={{ color: 'blue' }} href="http://uh-cryptics.github.io">UH Cryptics Github Page</a>
      </div>
    </footer>
  );
};

export default Footer;
