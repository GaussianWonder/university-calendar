import { Component } from 'solid-js';
import SidebarLink from '../../nav/SidebarLink';

const NavLinks: Component = () => {
  return (
    <>
      <SidebarLink
        href='/home'
        name='Home'
        iconClass='i-bx-home'
      />
    </>
  );
};

export default NavLinks;
