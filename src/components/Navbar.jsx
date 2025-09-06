import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeStyle = {
    fontWeight: 'bold',
    color: 'blue',
    textDecoration: 'underline'
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'center', gap: '2rem', backgroundColor: '#ddd', padding: '1rem' }}>
        <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : undefined)}>Home</NavLink>
      <NavLink to="/Gallery" style={({ isActive }) => (isActive ? activeStyle : undefined)}>Services</NavLink>
      <NavLink to="/courses" style={({ isActive }) => (isActive ? activeStyle : undefined)}>Courses</NavLink>
      <NavLink to="/enroll-now" style={({ isActive }) => (isActive ? activeStyle : undefined)}>Enroll-now</NavLink>
      <NavLink to="/admin" style={({ isActive }) => (isActive ? activeStyle : undefined)}>Admin</NavLink>
    </nav>
  );
};

export default Navbar;
