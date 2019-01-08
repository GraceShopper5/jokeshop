import React, {Component} from 'react'
import axios from 'axios'

class AllProducts extends Component {
  constructor(props) {
    super(props)
    this.state = {jokes: []}
  }

  async componentDidMount() {
    const {data: jokes} = await axios.get('/api/jokes')
    console.log(jokes)
    this.setState({jokes})
  }

  render() {
    console.dir(this.state.jokes[0])
    return (
      <div>
        <ul>
          {this.state.jokes.map(joke => (
            <li key={joke.id}>
              <div>
                {joke.name}
                <img src={joke.imageUrl} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default AllProducts
