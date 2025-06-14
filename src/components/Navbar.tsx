
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Package, Settings } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Overview', path: '/overview', icon: LayoutDashboard },
    { name: 'Packages', path: '/packages', icon: Package },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">RoboSort</span>
            </div>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
