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
      <SidebarLink
        href='/university'
        name='Universities'
        iconClass='i-bx-building'
      />
      <SidebarLink
        href='/faculty'
        name='Faculties'
        iconClass='i-bx-bxs-school'
      />
      <SidebarLink
        href='/course'
        name='Courses'
        iconClass='i-bx-book'
      />
      <SidebarLink
        href='/task'
        name='Tasks'
        iconClass='i-bx-task'
      />
    </>
  );
};

export default NavLinks;
