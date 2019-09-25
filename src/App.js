import React, { Component } from 'react';
import { Button, Row, Col, Typography, List, Card } from 'antd';

const mqtt = require('mqtt');


class App extends Component {

  state = {
    messages: [],
    on: 0,
  }

  sendMessage = (e) =>  {
    e.preventDefault();
    const {on} = this.state;
    const doc = {status: on === 1 ? 0 : 1};

    this.client.publish('topico/teste', JSON.stringify(doc), {retain: true});
  }  

  componentDidMount() {
    this.client = mqtt.connect('mqtt://3.92.136.227:9001');

    this.client.on('connect', () => {
      console.log('Conectado');
    })
    this.client.on('message', (t, m, p) => {
      const message = new TextDecoder('utf-8').decode(m);

      let doc;
      try {
        doc = JSON.parse(message);
      } catch (err) {
        doc = {status: false}
      }
      const msg = {
        message: message,
        updated: new Date().toLocaleString('pt-BR')
      }
      this.setState({messages: [msg, ...this.state.messages], on: doc['status']});
    })
    this.client.subscribe('topico/teste');
  }

  render() {
    const color = this.state.on === 1 ? 'yellow' : 'white'
    const btcolor = this.state.on === 1 ? 'red' : 'green'

    return (
      <Row gutter={16} justify='center' type='flex' style={{ marginTop: '40px' }}>
        <Col span={20} style={{ textAlign: 'center' }}>
          <div>
            <img src='index.png' alt='' style={{backgroundColor: color}}/>
          </div>
          <p>
            <Button type='primary' size='large' 
            style={{ fontSize: '1.5em', marginTop: '40px', height: '64px', width: '100%', backgroundColor: btcolor }}
              onClick={this.sendMessage}
            >
              {
                this.state.on === 1 ? 'Desligar' : 'Ligar'
              }
            </Button>
          </p>
          <Card style={{width: '100%'}}>
            <List
              style={{scrollBehavior: 'auto', maxHeight: '620px', overflow: 'auto', width: '100%'}} 
              header={<strong>Recebido:</strong>}
              bordered
              dataSource={this.state.messages}
              renderItem={item => (
                <List.Item style={{width: '100%'}}>
                  <Row gutter={16} style={{width: '100%'}}>
                    <Col span={6}>
                      <Typography.Text strong>{item.updated}</Typography.Text>
                    </Col>

                    <Col span={12} style={{textAlign: 'left'}}>
                      {item.message}
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    )
  }
}

export default App;
