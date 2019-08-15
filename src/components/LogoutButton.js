import React, { Component } from 'react';

import { NavItem, NavLink } from "reactstrap";

import { withRouter } from "react-router-dom";

import * as auth from '../services/auth';

class LogoutButton extends Component {
    onClickSair = () => {
        auth.logout();
        this.props.history.push('/login');
    }

    render() {
        if (!auth.isAuthenticated()) {
            return '';
        }

        return (
            <NavItem>
                <NavLink href="#" className="text-warning nav-link" onClick={this.onClickSair}>Sair</NavLink>
            </NavItem>    
        );
    }
}

export default withRouter(LogoutButton);