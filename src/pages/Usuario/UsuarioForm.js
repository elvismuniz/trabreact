import React, { Component } from 'react';

import { Container, Row, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import InputMask from "react-input-mask";
import api from '../../services/api';
import Header from '../../components/Header';


export default class UsuarioForm extends Component {
    state = {
        nome: '',
        email: '',
        nascimento: '',
        cpf: '',
        senha: '',
        status: 0,
        error: ''
    }

    constructor(props) {
        super(props);
        this.idusuario = props.match.params.userId;
    }

    componentDidMount() {
        const idusuario = this.idusuario;
        if (!idusuario) {
            return;
        }

        document.body.classList.add('loading');
        api.get(`usuarios/${idusuario}`)
            .then(response => {
                document.body.classList.remove('loading');
                console.log('response data', response.data);

                const { nome, email, nascimento, cpf, status } = response.data || {};

                this.setState({ nome, email, nascimento, cpf, status })
            })
            .catch(err => {
                if (err.response && err.response.status !== 404) {
                    window.alert('erro');
                    console.warn(err);
                }
                document.body.classList.remove('loading');
            })
    }

    handleGravarUsuario = async e => {
        e.preventDefault();

        const { nome, email, nascimento, cpf, senha } = this.state;
        const status = this.state.status || 0;

        let camposValidar = [nome, email, nascimento, cpf];

        if (!this.idusuario) {
            camposValidar.push(senha);
        }

        for (let i in camposValidar) {
            if (!camposValidar[i]) {
                this.setState({ error: 'Preencha o formulário corretamente!' });
                return;
            }
        }

        document.body.classList.add('loading');
        try {
            if (this.idusuario) {
                await api.put(`usuarios/${this.idusuario}`, { nome, email, nascimento, cpf, status });
            } else {
                await api.post('usuarios', { nome, email, nascimento, cpf, senha, status });
            }

            this.props.history.push('/usuarios');
            document.body.classList.remove('loading');
        } catch (err) {
            let errorMsg = 'Houve um problema ao gravar o usuário';
            
            if (err.response.status && err.response.status === 409) {
                errorMsg = 'Já existe um usuário cadastrado com este e-mail ou CPF';
            }
            
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
                {this.idusuario ? <Header /> : ''}

                <Container>
                    <h1 className="mt-5 mb-3">{this.idusuario ? 'Editar' : 'Cadastrar'} um usuário</h1>

                    {this.state.error && <Alert color="danger">{this.state.error}</Alert>}

                    <Form onSubmit={this.handleGravarUsuario}>
                        <Row>
                            <FormGroup className="col-12 col-sm-4">
                                <Label for="nome">Nome</Label>
                                <Input
                                    type="text"
                                    name="nome"
                                    id="nome"
                                    placeholder="João da Silva" 
                                    value={this.state.nome}
                                    onChange={e => this.setState({ nome: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup className="col-12 col-sm-4">
                                <Label for="email">Endereço de e-mail</Label>
                                <Input
                                    type="text"
                                    name="email"
                                    id="email"
                                    value={this.state.email}
                                    placeholder="joao@silva.com"
                                    onChange={e => this.setState({ email: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup className={this.idusuario ? 'col-12 col-sm-2' : 'col-12 col-sm-4'}>
                                <Label for="nascimento">Data de nascimento</Label>
                                <Input 
                                    type="text" 
                                    name="nascimento" 
                                    id="nascimento" 
                                    mask="99/99/9999"
                                    maskChar={null}
                                    tag={InputMask} 
                                    value={this.state.nascimento}
                                    placeholder="01/01/1991" 
                                    onChange={e => this.setState({ nascimento: e.target.value })}
                                />
                            </FormGroup>
                            {!this.idusuario ? '' : /* Campo status apenas na edição*/
                                <FormGroup className="col-12 col-sm-2">
                                    <Label check>
                                        <p><br/></p> {/* @TODO Alinhar melhor o checkbox de concluída */}
                                        <Input type="hidden" name="status" value="0" />
                                        <Input 
                                            type="checkbox" 
                                            name="status" 
                                            value="1"
                                            checked={this.state.status ? 1 : 0}
                                            onChange={e => this.setState({ status: e.target.checked ? 1 : 0 })}
                                        />{' '}
                                        Ativo
                                    </Label>
                                </FormGroup>
                            }
                            
                            <FormGroup className="col-12 col-sm-4">
                                <Label for="cpf">CPF</Label>
                                <Input
                                    type="text"
                                    name="cpf"
                                    id="cpf"
                                    mask="999.999.999-99"
                                    maskChar={null}
                                    tag={InputMask}
                                    value={this.state.cpf}
                                    placeholder="123.456.789-00"
                                    onChange={e => this.setState({ cpf: e.target.value })}
                                />
                            </FormGroup>
                            {this.idusuario ? '' : /* Campo senha apenas no cadastro */
                                <FormGroup className="col-12 col-sm-4">
                                    <Label for="senha">Senha</Label>
                                    <Input
                                        type="password"
                                        name="senha"
                                        id="senha"
                                        placeholder="**********"
                                        onChange={e => this.setState({ senha: e.target.value })}
                                    />
                                </FormGroup>
                            }
                        </Row>
                        <Button>Enviar</Button>
                    </Form>
                </Container>
            </>
        );
    }
}
