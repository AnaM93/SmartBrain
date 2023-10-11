
import React, {Component} from 'react'
import ParticlesBg from 'particles-bg'; 
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation';
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
 
/*fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", returnClarifaiRequest(this.state.input))
    .then(response => response.json())*/

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl : ''
    }
  }
  
  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});


  /*app.models.predict('a403429f2ddf4b49b307e318f00e528b','https://samples.clarifai.com/face-det.jpg')*/
  fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", returnClarifaiRequest(this.state.input))
    .then(response => response.json())
    .then(
      function (response){
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box)
    },
    function (err){

    });
  }


  render () {
    return (
    <div className="App">
      <>
        <div>...</div>
        <ParticlesBg type="color" num={100} color ='white' bg={true} />
      </>
      <Navigation />
      <Logo />
      <Rank/>
      <ImageLinkForm 
        onInputChange = {this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}
      />
      <FaceRecognition imageUrl={this.state.imageUrl}/>
    </div>
  );
}
}
export default App;
