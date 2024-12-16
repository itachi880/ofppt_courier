import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import { dataStore } from '../data/store';

function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [donne, setDonne] = dataStore.useStore(); // Récupère les données depuis votre store
  const [selectedDate, setSelectedDate] = useState(null);
  const [notification, setNotification] = useState('');

  // useEffect(() => {
  //   if ('Notification' in window && Notification.permission === 'default') {
  //     Notification.requestPermission().then((permission) => {
  //       if (permission === 'granted') {
  //         console.log('Notifications autorisées.');
  //       } else {
  //         console.log('Notifications non autorisées.');
  //       }
  //     });
  //   }
  // }, []);

  // Lorsque l'utilisateur sélectionne une date
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

  // Génération des lignes du tableau en fonction des événements
  const RenderTableRows = () => {
    if (!selectedDate) return null; // Pas de date sélectionnée
    const event = donne.data.find(e => e.date === selectedDate.toISOString().split('T')[0]);
    if (event) {
      return (
        <tr>
          <td style={{ border: "1px solid black", padding: "10px",fontWeight:"bold",height:" fit-content"}}>
            {event.date}
          </td>
          <td style={{ border: "1px solid black", padding: "10px",fontWeight:"bold", height:" fit-content"}}>
            {event.note}
          </td>
        </tr>
      );
    } else {
      return (
        <tr>
             <td style={{ border: "1px solid black", padding: "10px" ,fontWeight:"bold"}}>
           {selectedDate.toISOString().split('T')[0]}
          </td>
          <td style={{ border: "1px solid black", padding: "10px" ,fontWeight:"bold"}} >
            Aucun événement pour cette date
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <h1>Mon Calendrier</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: '90px' }}>
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileContent={tileContent} // Ajoute la personnalisation des cases
        />
        <table style={{ 
          borderCollapse: "collapse", 
          width: "30%", 
          margin: "20px 0", 
          fontSize: "16px", 
          textAlign: "left" 
        }}>
          <thead style={{ backgroundColor: "#f4f4f4" }}>
            <tr>
              <th style={{ border: "1px solid black", padding: "10px" }}>
                Date
              </th>
              <th style={{ border: "1px solid black", padding: "10px" }}>
                Événement
              </th>
            </tr>
          </thead>
          <tbody>
            <RenderTableRows/>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MyCalendar;