import React, { Component } from 'react';

import { Container, Row, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import api from '../../services/api';
import Header from '../../components/Header';


export default class TarefasForm extends Component {
    state = {
        titulo: '',
        descricao: '',
        concluida: false
    }

    constructor(props) {
        super(props);
        this.idtarefa = props.match.params.taskId;
    }

    componentDidMount() {
        const idtarefa = this.idtarefa;
        if (!idtarefa) {
            return;
        }

        document.body.classList.add('loading');
        api.get(`tarefas/${idtarefa}`)
            .then(response => {
                document.body.classList.remove('loading');
                console.log('response data', response.data);

                const { titulo, descricao, concluida } = response.data[0] || {};

                console.log(titulo, descricao, concluida);;

                this.setState({ titulo, descricao, concluida })
            })
            .catch(err => {
                if (err.response && err.response.status !== 404) {
                    window.alert('erro');
                    console.warn(err);
                }
                document.body.classList.remove('loading');
            })
    }

    handleGravarTarefa = async e => {
        e.preventDefault();

        const { titulo, descricao, concluida } = this.state;

        let camposValidar = [titulo, descricao]
        for (let i in camposValidar) {
            if (!camposValidar[i]) {
                this.setState({ error: 'Preencha o formulário corretamente!' });
                return;
            }
        }

        document.body.classList.add('loading');
        try {
            if (this.idtarefa) {
                await api.put(`tarefas/${this.idtarefa}`, { titulo, descricao, concluida });
            } else {
                await api.post('tarefas', { titulo, descricao, concluida });
            }
            this.props.history.push('/tarefas');
            document.body.classList.remove('loading');
        } catch (err) {
            let errorMsg = 'Houve um problema ao gravar o usuário';
            
            this.setState({
                error: errorMsg
            });

            console.error(err);
            document.body.classList.remove('loading');
        }
    }

    render() {
        return (
            <>
                <Header />
                <Container>
                    <h1 className="mt-5 mb-3">{this.idtarefa ? 'Editar' : 'Cadastrar'} uma tarefa</h1>

                    {this.state.error && <Alert color="danger">{this.state.error}</Alert>}

                    <Form onSubmit={this.handleGravarTarefa}>
                        <Row>
                            {this.idtarefa ? <Input type="hidden" value={this.idtarefa} /> : ''}
                            <FormGroup className="col-12 col-sm-10">
                                <Label for="titulo">Título</Label>
                                <Input
                                    type="text"
                                    name="titulo"
                                    id="titulo"
                                    placeholder="Minha tarefa"
                                    value={this.state.titulo}
                                    onChange={e => this.setState({ titulo: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup check className="col-12 col-sm-2">
                                <Label check>
                                    <p><br/></p> {/* @TODO Alinhar de uma forma melhor o checkbox de concluída */}
                                    <Input type="hidden" name="concluida" value="false" />
                                    <Input 
                                        type="checkbox" 
                                        name="concluida" 
                                        value="true"
                                        checked={this.state.concluida}
                                        onChange={e => this.setState({ concluida: e.target.checked })}
                                    />{' '}
                                    Concluída
                                </Label>
                            </FormGroup>
                            <FormGroup className="col-12">
                                <Label for="descricao">Descrição</Label>
                                <Input
                                    type="textarea"
                                    name="descricao"
                                    id="descricao"
                                    value={this.state.descricao}
                                    onChange={e => this.setState({ descricao: e.target.value })}
                                />
                            </FormGroup>
                        </Row>
                        <Button>Enviar</Button>
                    </Form>
                </Container>
            </>
        );
    }
}
