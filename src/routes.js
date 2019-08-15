import React from 'react';

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { isAuthenticated } from './services/auth';

import Login from './pages/Usuario/Login';
import TarefasList from './pages/Tarefas/TarefasList';
import UsuarioForm from './pages/Usuario/UsuarioForm';
import NotFound from './pages/NotFound';
import UsuarioList from './pages/Usuario/UsuarioList';
import TarefasForm from './pages/Tarefas/TarefasForm';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            )
        }
    />
);

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' render={() => {
                const redirectUrl = isAuthenticated() ? '/tarefas' : '/login';

                return (
                    <Redirect to={redirectUrl} />
                )
            }}/>
            <Route path="/login" component={Login} />
            <Route path="/cadastro" component={UsuarioForm} />
            <PrivateRoute path="/tarefas/form/:taskId" component={TarefasForm} />
            <PrivateRoute path="/tarefas/form" component={TarefasForm} />
            <PrivateRoute path="/tarefas" component={TarefasList} />
            <PrivateRoute exact path="/usuarios" component={UsuarioList} />
            <PrivateRoute path="/usuarios/form/:userId" component={UsuarioForm} />
            <Route path="*" component={NotFound} />
        </Switch>
    </BrowserRouter>
);

export default Routes;