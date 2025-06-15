
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Package, Settings, Eye } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Overview', path: '/overview', icon: Eye },
    { name: 'Live Page', path: '/live', icon: LayoutDashboard },
    { name: 'System Health', path: '/system-health', icon: LayoutDashboard },
    { name: 'Manual Control', path: '/manual-control', icon: LayoutDashboard },
    { name: 'Logs & Reports', path: '/logs-reports', icon: LayoutDashboard },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          {/* App brand */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold">RoboSort</span>
          </div>
          
          {/* Navigation */}
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className="w-3.5 h-3.5" />
                <span className="text-sm">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
