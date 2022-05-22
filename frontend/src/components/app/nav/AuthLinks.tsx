import { Component } from 'solid-js';
import SidebarLink from '../../nav/SidebarLink';

const AuthLinks: Component = () => {
  return (
    <>
      <SidebarLink
        href='/login'
        name='Login'
        iconClass='i-bx-log-in-circle'
      />
      <SidebarLink
        href='/register'
        name='Register'
        iconClass='i-bx-log-out-circle'
      />
    </>
  );
};

export default AuthLinks;
