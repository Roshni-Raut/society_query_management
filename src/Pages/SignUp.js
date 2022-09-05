import React, { useState} from 'react';
import { Container, Header, Content, Form, ButtonToolbar, Button, Navbar,Panel,FlexboxGrid} from 'rsuite'

import GoogleIcon from "@rsuite/icons/legacy/Google"
import {createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import {auth} from '../firebase'
import { Alert } from 'react-bootstrap';

export const SignUp = () => {
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const [cpass,setCpass]=useState("")

  const [error,setError]= useState()
  const [loading,setLoading]= useState(false)
  const color="#645CAA"

  const register=()=>{
    setLoading(true)
    setError("")
    if(pass!== cpass){
      setError("Password doesn't match");
    }
    else{
      createUserWithEmailAndPassword(auth, email, pass).then((userCredential) => {
        const user = userCredential.user;
        console.log(user)
      })
      .catch((error) => {
        setError(error.code)
      });
    }
  setLoading(false)
  }
  const onGoogleSignIn=()=>{
    signInWithPopup(auth,new GoogleAuthProvider()).then((userCredential)=>{
      const user = userCredential.user;
      console.log(user)
    })
    .catch((error)=>{
      setError(error.code)
    })
  }
  return (
    <div>
    <Container>
      <Header>
        <Navbar appearance="inverse"style={{backgroundColor: color }} >
          <Navbar.Brand>
            <span style={{color: '#ffff' }} >Society Query Managment</span>
          </Navbar.Brand>
        </Navbar>
      </Header>
      <Content style={{margin:"30px"}}>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={12}>
            <Panel header={<h3>Create New User</h3>} bordered>
            
            {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={register} fluid >
                <Form.Group>
                  <Form.ControlLabel>Username or email address</Form.ControlLabel>
                  <Form.Control name="name" type="email" onChange={(e)=>setEmail(e)} required/>
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Password</Form.ControlLabel>
                  <Form.Control name="password" type="password" onChange={(e)=>setPass(e)} autoComplete="off" required/>
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>ConfirmPassword</Form.ControlLabel>
                  <Form.Control name="password" type="password" onChange={(e)=>setCpass(e)} autoComplete="off" required/>
                </Form.Group>
                <Form.Group>
                  <ButtonToolbar>
                    <Button disabled={loading} type="submit" block appearance="primary" style={{backgroundColor:color}}  >Sign in</Button>
                    <Button appearance="link">Forgot password?</Button>
                  </ButtonToolbar>
                </Form.Group>
                <Form.Group>
                  <ButtonToolbar >
                    <Button block disabled={loading} style={{backgroundColor:color}} onClick={onGoogleSignIn} appearance="primary"><GoogleIcon/> Google</Button>
                  </ButtonToolbar>
                </Form.Group>
              </Form>
            </Panel>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content>
    </Container>
  </div>
  )
}
