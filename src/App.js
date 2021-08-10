import './App.css';
import {PureComponent} from 'react'


class App extends PureComponent{
constructor(){
  super()
  this.state={
    gitUsers:[],
    selectedGitUsers:[],
    activePage:1,
    tableSize:9
  }
}
componentDidMount(){
  return fetch("https://api.github.com/users", 
  {method: "GET"})
    .then(resp => resp.json())
    .then(data => {
      
      if (data.message) {
        
        console.error(data.message)
      } else {
        
        let gitUsers=data.map(item=>{
          const {id,login,avatar_url,url,type}=item
          const user={id,login,avatar_url,url,type}
          return user
        })
        this.setState({gitUsers})
        this.changeSelectedGitUsers()
      }
    })
}

changeSelectedGitUsers(){
  const maxPage=parseInt(this.state.gitUsers.length/this.state.tableSize)+1

  if (this.state.activePage<1){this.setState({activePage:maxPage})}
  if (this.state.activePage>maxPage){this.setState({activePage:1})}
  const startUserIndex=(this.state.activePage-1)*this.state.tableSize
  const selectedGitUsers=[...this.state.gitUsers.slice(startUserIndex,startUserIndex+this.state.tableSize)]
  this.setState({selectedGitUsers})
  
}

inc = async  ()=> {
  await this.setState((prevState, prevProps) => {
  return { activePage: ++prevState.activePage };
  });
  this.changeSelectedGitUsers()
};
dec = async  ()=> {
  await this.setState((prevState, prevProps) => {
  return { activePage: --prevState.activePage };
  });
  this.changeSelectedGitUsers()
};

  render(){
    
  
 const usersJsx=this.state.selectedGitUsers.map(user=>{
  return <li key={user.id}><UserItem id={user.id} login={user.login} url={user.url} avatar_url={user.avatar_url} 
  type={user.type} /></li>
})
    return (<div  className="user_cards_table">
      <div className="buttons">
         <button onClick={this.dec}>Назад</button>
         {this.state.activePage}
         <button onClick={this.inc}>Вперед</button>
      </div>
      <ul>
        {usersJsx}
     </ul>
    
    </div>
    )
  }
}

function UserItem(props){
  return <>
  <div className="user_card">
  <div className="user_card_photo">
  <img src={props.avatar_url} alt={props.login}></img>
  </div>
  <div className="user_card_info">
  <h2>{props.login}</h2>
  
  <a href={props.url}>Info</a>
  Role: {props.type}
  </div>
  </div>
  </>
}

export default App;
