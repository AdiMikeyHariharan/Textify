import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
const Navbar = (props) => {
    let iconStyle = {
        color : 'black'
    }
    if(props.mode === 'dark')
    {
        iconStyle = {
            color: 'white'
        }
        document.getElementById("myNav").style.transition = 'all 0.5s'
    }
    return (
        <>
        <div>
            <nav id = "myNav" className={`navbar navbar-expand-lg navbar-${props.mode} bg-${props.mode}`}>
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">{props.title}</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/about">About</Link>
        </li>
        <li className="nav-item dropdown">
        </li>
      </ul>
      <form className="d-flex" role="search">
        <i className={`${props.toggleBtn}`} style = {iconStyle} onClick = {props.toggleMode} />
      </form>
    </div>
  </div>
</nav>
        </div>
        <div className="container">
        </div>
    </>
    );
}



Navbar.propTypes = {
    title : PropTypes.string
}

Navbar.defaultProps = {
    title : "Set Title Here"
}

export default Navbar;