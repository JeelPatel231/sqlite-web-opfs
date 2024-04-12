import { useEffect, useState } from "react";
import "./App.css";
import "reflect-metadata";
import { User, db } from "./database";
import { JsonContains } from 'typeorm/browser'

const Entry = ({ id } : { id: string }) => (
  <tr>
    <td>{id}</td>
  </tr>
)

function App() {
  const [data, setData] = useState<User[]>([])

  const addUser = () => db.getDataSource()
    .then(ds => ds.getRepository(User))
    .then(repo => repo.insert( { id: 1 }))

  const refreshData = () => db.getDataSource()
    .then(ds => ds.getRepository(User))
    .then(repo => repo.find())
    .then(data => setData(data))

  useEffect(() => {
    refreshData()
  }, [])

  return <>
    <h1>SQLite on web</h1>
    <button onClick={async () => {
      await addUser()
      await refreshData()
    }}>Add User</button>
  
    <table>
      {data.map(x => <Entry id={x.id.toString()} />)}
    </table>

  </>;
}

export default App;
