import { useState ,useEffect} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Styles de base du calendrier
import { dataStore } from '../data/store';


function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [donne, setDonne] = dataStore.useStore();
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notifications autorisées.');
        } else {
          console.log('Notifications non autorisées.');
        }
      });
    }
  }, []);
  const showNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    } else {
      console.log('Les notifications ne sont pas autorisées.');
    }
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const event = donne.data.find(e => e.date === date.toISOString().split('T')[0]);
    if (event) {
        showNotification( event.note);
    } else {
        showNotification('Aucun événement', 'Aucun événement pour cette date.');
    }
  };
  return (
    <div>
      <h1>Mon Calendrier</h1>
      <Calendar
        onChange={handleDateChange}
        value={date}
      />
      <p onClick={()=>{
        console.log(donne)
      }}>test </p>
    </div>


  );
}

export default MyCalendar;
