import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        Home
      </NavLink>
      <NavLink to="/Gallery" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        Services
      </NavLink>
      <NavLink to="/courses" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        Courses
      </NavLink>
      <NavLink to="/enroll-now" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        Enroll-now
      </NavLink>
      <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        Admin
      </NavLink>
    </nav>
  );
};

export default Navbar;
