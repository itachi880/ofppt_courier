import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import { dataStore } from '../data/store';

function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [donne, setDonne] = dataStore.useStore();
  const [selectedDate, setSelectedDate] = useState(null);
  const [notification, setNotification] = useState('');

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
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const event = donne.data.find(e => e.date === date.toISOString().split('T')[0]);
    if (event) {
      setNotification(event.note);
    } else {
      setNotification('Aucun événement');
    }
  };

  // Vérifie si une date a un événement
  const hasEvent = (date) => {
    return donne.data.some(event => event.date === date.toISOString().split('T')[0]);
  };

  // Personnalisation des cases du calendrier
  const tileContent = ({ date, view }) => {
    if (view === 'month' && hasEvent(date)) {
      return (
        <div style={{ position: 'relative' }}>
          <span 
            style={{
              position: 'absolute',
              bottom: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '6px',
              backgroundColor: 'red',
              borderRadius: '50%',
            }}
          ></span>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div>
        <h1>Mon Calendrier</h1>
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileContent={tileContent} // Ajoute la personnalisation des cases
        />
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          {notification}
        </div>
      </div>
    </>
  );
}

export default MyCalendar;
