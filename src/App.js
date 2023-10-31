
import React, {Component} from 'react'
import ParticlesBg from 'particles-bg'; 
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import './App.css';



 const returnClarifaiRequest = (imageUrl) => {
  const PAT = 'a29fbd2206aa4dfaa935f39e789d2137';
  const USER_ID = 'wc7ivbfekgi2';       
  const APP_ID = 'my-first-application-59jrxq';
  const MODEL_ID = 'face-detection';   
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
});



const requestOptions = {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
  },
  body: raw
};
  return requestOptions;
};
 


    const initialState = {
        input: '',
        imageUrl: '',
        box: {},
        route: 'signIn',
        isSignedIn: false,
        user:{
          id: '',
          name: '',
          email:'',
          entries: 0,
          joined: new Date()
        
    }}

class App extends Component {
  constructor(){
    super();
    this.state = initialState
    }
  

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email:data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  };

  displayFaceBox = (box) => {
    this.setState({box:box})
  }

  
  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }
  

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", returnClarifaiRequest(this.state.input))
      .then(response => response.json())
      .then(response => {
          if(response) {
            fetch('http://localhost:3001/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
              id: this.state.user.id
            })
          })
             .then(response => response.json())
            .then (count => {
               this.setState({user:{
              ...this.state.user,
              entries: count}})
      })
      .catch(console.log)
      this.displayFaceBox(this.calculateFaceLocation(response))}
        })
      .catch(err => console.log(err));
  };

onRouteChange = (route) => {
  if (route === 'signout'){
  this.setState(initialState)}
  else if (route === 'home'){
  this.setState({isSignedIn:true})
  }
  this.setState({route: route})
}
  render () {
    return (
    <div className="App">
      <>
      <ParticlesBg type="square" num={100} color ='white' bg={true} />
      </>
     <Navigation isSignedIn={this.state.isSignedIn}onRouteChange = {this.onRouteChange}/>
     {this.state.route === 'home' ?
          <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm 
            onInputChange = {this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
          </div>
          :(
            this.state.route === 'signIn' ?
            <SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/> :
            <Register loadUser ={this.loadUser} onRouteChange = {this.onRouteChange}/>
          )
          };
    </div>
  );
}

}
export default App;
