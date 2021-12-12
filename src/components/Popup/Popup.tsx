import './Popup.css';

const Popup = (props: any) => {
  return (
    <div className="popup-box">
      <div className="box">
        <img src={`${props.content[0].avatar}`} alt=""/>
        <h1 className='name'>{props.content[0].name}</h1>
        <h4 className="score-count">Score: {props.content[0].score}</h4>
        <p className='bio'>{props.content[0].bio}</p>
        <div className='btn-wrapper'>
          <button className="close-icon" onClick={props.handleClose}>x close</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;