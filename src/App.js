import React from 'react';
import './App.css';
import { firebaseApp, database } from './firebaseApp'

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      user: null,
      database: null
    }
  }


  loginHandler = async (event) => {
    event.preventDefault()
    console.log(event.target)
    let password = event.target.password.value
    let email = event.target.email.value

    firebaseApp.auth().signInWithEmailAndPassword(email, password).catch(function (err) {
      let message = err.message
      alert(message)
    })

    firebaseApp.auth().onAuthStateChanged(async (user) => {
      console.log(user)
      if (user) {
        await this.state.database.ref('/')
          .once('value')
          .then((snapshot) => {
            let response = snapshot.val().response
            this.setState({
              greeting: response
            })
          })

        this.setState({
          user: firebaseApp.auth().currentUser,
        })
        alert('signed in!')
      }
    })
  }

  componentDidMount() {
    firebaseApp.auth().signOut()

    if (!this.state.database) {
      this.setState({
        database: database
      })
    }
  }

  render() {
    console.log(this.state.user)

    return (
      <div>
        <h1>{this.state.user ? this.state.greeting : 'Please log in'}</h1>
        <form onSubmit={this.loginHandler}>
          <input type='email' name='email' />
          <input type='password' name='password' />
          <input type='submit' />
        </form>
      </div>
    )
  }
}

export default App;
