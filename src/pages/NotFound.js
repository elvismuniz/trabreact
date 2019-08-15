import React, { Component } from 'react';
import Header from '../components/Header';

import { Container } from "reactstrap";

export default class NotFound extends Component {
    render() {
        return (
            <>
                <Header />
                <Container>
                    <h1 className="text-danger">Página não encontrada</h1>
                </Container>
            </>
        );
    }
}