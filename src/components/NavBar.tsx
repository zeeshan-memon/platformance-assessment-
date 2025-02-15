import React from 'react';

interface DrawerBackdropProps {
  onClick: () => void;
}

const NavBar: React.FC<DrawerBackdropProps> = ({ onClick }) => {
  return (
    <div
      className="fixed inset-0 z-30 bg-black opacity-50"
      onClick={onClick}
    ></div>
  );
};

export default NavBar;