/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView, ListView, Button, TextInput } from 'react-native';
import { parse } from '@babel/parser';

type Props = {};
export default class App extends Component<Props> {
  constructor() {
    super();
    this.getAll = this.getAll.bind(this);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      text: '',
      dataSource: ds.cloneWithRows([
        ['', ''],
        ['', ''],
        ['', ''],
      ]),
      vaccine: null,
      alergic: null,
      chronic: null,
      isFlagV: false,
      isFlagA: false,
      isFlagC: false,
    };
  }

  flagVaccine() {
    this.setState({ isFlagA: false });
    this.setState({ isFlagC: false });
    this.setState({ isFlagV: true });
  }

  flagAlergic() {
    this.setState({ isFlagA: true });
    this.setState({ isFlagC: false });
    this.setState({ isFlagV: false });
  }

  flagChronic() {
    this.setState({ isFlagA: false });
    this.setState({ isFlagC: true });
    this.setState({ isFlagV: false });
  }

  async getAll(snils) {
    const url = 'https://f5520718.ngrok.io/api/Health/GetClient'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
      , body: JSON.stringify({ snils })
    });
    const json = await response.json();
    //console.warn(json);
    let fio = json.client.Surname + " " + json.client.Name + " " + json.client.PatronymicName;
    console.warn(this.fio);
    date = Date.now();
    let birthDay = Math.floor((date - new Date(json.client.BirthDate)) / 1000 / 60 / 60 / 24 / 365);
    console.warn(this.birthDay);
    let sex = json.client.Gender;
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.setState({
      dataSource: ds.cloneWithRows([
        ['ФИО:        ', fio],
        ['Возраст:  ', birthDay],
        ['Пол:          ', sex],
      ])
    });
    this.setState({ chronic: json.disease.map(disease => disease.Name) });
    this.setState({ alergic: json.map(chronic => chronic) });
    this.setState({ vaccine: json.vaccine.map(name => vaccine.VaccineName) });
  }

  render() {

    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headers}>
            <Image style={{ width: 30, height: 50, transform: [{ rotate: '-35deg' }] }}
              source={require('./src/img/logo.png')} />
            <Text style={styles.header}>Health</Text>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, }}>СНИЛС: </Text>
            <TextInput
              style={{ fontSize: 20, width: 120 }}
              placeholder="11111111111"
              onChangeText={(text) => this.setState({ text })} />
            <View style={styles.buttonInc}>
              <Button title='Поиск' color='#FFF'
                onPress={() => this.getAll(this.state.text)} />
            </View>
          </View>
          <View style={styles.body}>
            <Text style={styles.bodyHeader}>Информация о пациенте</Text>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData) => <Text style={styles.table}>{rowData}</Text>} />

            <View style={styles.buttonFirst}>
              <View style={styles.buttonInc}>
                <Button title='Прививки   ' color='#FFF' onPress={() => this.flagVaccine()} />
              </View>
              <View style={styles.buttonInc}>
                <Button title='Алергии   ' color='#FFF' onPress={() => this.flagAlergic()} />
              </View>
              <View style={styles.buttonInc}>
                <Button title='Хронические  ' color='#FFF' onPress={() => this.flagChronic()} />
              </View>
            </View>

            {this.state.isFlagC ? (<View style={{ alignItems: 'center' }}>
              {this.state.chronic.map(chr => {
                return (<Text style={styles.textInc}>{chr}</Text>)
              })}
            </View>) : <View />}

            {this.state.isFlagA ? (<View style={{ alignItems: 'center' }}>
              {this.state.alergic.map(alerg => {
                return (<Text style={styles.textInc}>{alerg}</Text>)
              })}
            </View>) : <View />}

            {this.state.isFlagV ? (<View style={{ alignItems: 'center' }}>
              {this.state.vaccine.map(vac => {
                return (<Text style={styles.textInc}>{vac}</Text>)
              })}
            </View>) : <View />}

          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  buttonInc: {
    borderRadius: 20,
    backgroundColor: '#0040d4',
    marginLeft: 5,
  },
  headers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
  },
  header: {
    marginLeft: 10,
    fontSize: 40,
  },
  body: {
    marginTop: 20,
    marginLeft: 10,

  },
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  bodyHeader: {
    color: '#0040d4',
    marginBottom: 10,
    fontSize: 25,
  },
  table: {
    fontSize: 18,
  },
  buttonFirst: {
    flex: 0,
    flexDirection: 'row',
    marginLeft: -15,
    marginTop: -300,
    marginBottom: 200,
  },
  textInc: {
    fontSize: 20,
    marginTop: 5,
  },
});

