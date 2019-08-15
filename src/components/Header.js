import React, { Component } from 'react';

import { Navbar, Nav, NavItem } from "reactstrap";

import { NavLink, Link } from "react-router-dom";

import LogoutButton from "./LogoutButton";

export default class Header extends Component {
    render() {
        return (
            <Navbar color="dark" dark expand="xs" className="mb-4">
                <Link className="text-white text-decoration-none" style={{ letterSpacing: '2px' }} to='/'>
                    <span className="brand-name"><span className="web">Web</span>Dev</span>
                </Link>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <NavLink className="text-white nav-link" to='/tarefas'>Tarefas</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="text-white nav-link" to='/tarefas/form'>Nova tarefa</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="text-white nav-link" to='/usuarios'>Usuários</NavLink>
                    </NavItem>
                    <LogoutButton />
                </Nav>
            </Navbar>
        );
    }
}