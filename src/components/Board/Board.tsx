import { useState, useEffect } from 'react';
import nextId from "react-id-generator";
import Popup from '../Popup/Popup';
import './Board.css';

import { useNavigate } from "react-router-dom";

const Board = () => {

  const navigate = useNavigate()

  const [data, setData] = useState(() => {
    const saved = window.localStorage.getItem("items");
    const values = saved !== null ? JSON.parse(saved): [];
    return values
  })
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [asc, setAsc] = useState(() => {
    const sort = window.localStorage.getItem("sort");
    const sortValue = sort !== null ? JSON.parse(sort): false;
    return sortValue
  });
  const [isOpen, setIsOpen] = useState(false);
  const [popuinfo, setPopupInfo] = useState<any>({})

  let eventSource = new EventSource("http://localhost:5000");

  interface IPlayer {
    name: string 
    avatarUrl: string 
    score: number 
    bio: string 
    [id: string]: any
  }

  useEffect(() => {
    eventSource.onopen = () => {
      setIsLoading(false)
    }
    
    eventSource.onmessage = e => updateEventData(e);
    return () => {
      eventSource.close();
    };
  }, [])

  useEffect(() => {
    window.localStorage.setItem('items', JSON.stringify(data));
    window.localStorage.setItem('sort', JSON.stringify(asc))
  }, [data, asc]);

  function matchElement(e: IPlayer) {
    return data.filter((el:any) => el['id'] === e.id);
  }
  function showDetails(element: IPlayer) {
    let matched: IPlayer = matchElement(element)
    togglePopup()
    setPopupInfo(matched) 

    if (!isOpen) {
      let name: string = matched[0]['name'];
      navigate(`/player/${name}`)
    }
    
  }

  function updateEventData(fetchedData: MessageEvent) {
    let items: IPlayer = JSON.parse(fetchedData.data);
    items['id'] = nextId();
    setData((prevState: Array<object>) => [...prevState, items])
  }

  function togglePopup(){
    setIsOpen(!isOpen);
    if (isOpen) {
      navigate(-1)
    }
  }

  function save() {
    setAsc(!asc)
  }

  return (
    <div className='container'>
      <h1>Score board</h1>
      <div className='board'>
        {isLoading ? (
          <div className='loader'>
            <h3>No players available</h3>
            <div className="lds-dual-ring"></div>
          </div>
          
        ): (
          <table>
            <thead>
              <tr>
                <th colSpan={2} className='name-title'>Player's name</th>
                <th className='score' onClick={() => save()}>Score</th>
              </tr>
            </thead>
            <tbody>
              {asc? (
                data.sort((a: any, b: any) => a['score'] - b['score']).map((el: any, i: number) => {
                  return (
                    <tr key={i} onClick={() => showDetails(el)} className='row'>
                      <td className='image'>
                        <img src={`${el.avatar}`} alt='avatar'/>
                      </td>
                      <td className='name-value'>{el.name}</td>
                      <td className='score-value'>{el.score}</td>
                    </tr>
                  )
                })
              ): (
                data.sort((a: any, b: any) => b['score'] - a['score']).map((el: any, i: number) => {
                  return (
                    <tr key={i} onClick={() => showDetails(el)} className='row'>
                      <td className='image row'>
                        <img src={`${el.avatar}`} alt='avatar'/>
                      </td>
                      <td className='name-value'>{el.name}</td>
                      <td className='score-value'>{el.score}</td>
                    </tr>
                  )
                })
              )
            }
            
            </tbody>
          </table>
        )}
      </div>
      { isOpen? <Popup handleClose={togglePopup} content={popuinfo}/>: null}
    </div>
  )
}

export default Board