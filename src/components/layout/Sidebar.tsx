
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Database, Settings, Bell } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Database },
    { name: 'Instâncias', path: '/instances', icon: Database },
    { name: 'Alertas', path: '/alerts', icon: Bell },
    { name: 'Configurações', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="bg-gray-900 w-64 min-h-screen border-r border-gray-800">
      <nav className="mt-8">
        <div className="px-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
