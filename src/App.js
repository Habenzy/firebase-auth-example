import React from 'react';
import './App.css';
import { firebaseApp, database, googleProvider } from './firebaseApp'

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      user: firebaseApp.auth().currentUser,
      database: null
    }
  }


  loginHandler = async (event) => {
    event.preventDefault()

    let password = event.target.password.value
    let email = event.target.email.value

    event.target.password.value = ''
    event.target.email.value = ''

    firebaseApp.auth().signInWithEmailAndPassword(email, password).catch(function (err) {
      let message = err.message
      alert(message)
    })

    firebaseApp.auth().onAuthStateChanged(async (user) => {

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

  signupHandler = async (event) => {
    event.preventDefault()

    let password = event.target.password.value
    let email = event.target.email.value

    firebaseApp.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        alert('signed up')
      })
      .catch((err) => {
        alert(err.message)
      })

    firebaseApp.auth().onAuthStateChanged(async (user) => {

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

  logOut = async () => {
    await firebaseApp.auth().signOut()

    this.setState({
      user: firebaseApp.auth().currentUser
    })
  }

  googleHandler = async () => {
    googleProvider.addScope('profile');
    googleProvider.addScope('email')

    await firebaseApp.auth().signInWithPopup(googleProvider)
      .then(() => {
        alert('signed in with google')
        this.setState({ user: firebaseApp.auth().currentUser })
      })

    await this.state.database.ref('/')
      .once('value')
      .then((snapshot) => {
        let response = snapshot.val().response
        this.setState({
          greeting: response
        })
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
        <h2>Log In</h2>
        <form onSubmit={this.loginHandler}>
          <input type='email' name='email' />
          <input type='password' name='password' />
          <input type='submit' />
        </form>
        <button onClick={this.logOut}>Sign Out</button>
        <button onClick={this.googleHandler}>Sign in with Google</button>
        <h2>Sign Up</h2>
        <form onSubmit={this.signupHandler}>
          <input type='email' name='email' />
          <input type='password' name='password' />
          <input type='submit' />
        </form>
      </div>
    )
  }
}

export default App;
