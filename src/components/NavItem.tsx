import React from 'react';

interface NavItemProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ children, active, onClick }) => {
  return (
    <li>
      <div
        className={`flex items-center cursor-pointer px-3 py-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100  group ${active ? 'bg-gray-200' : ''}`}
        onClick={onClick}
      >
        {children}
      </div>
    </li>
  );
};

export default NavItem;