import { events, documentType, fetchedDates, User } from "../../../data";
import { Calendar, useQuery } from "../../../utils";
import "./index.css";
import { GetEvents } from "../../../api";
export default () => {
  const [CalendarEvents, setCalendarEvents] = events.useStore();
  const afficheType = useQuery()(documentType.event)
    ? documentType.event
    : documentType.courier;
  const renderArray =
    afficheType == documentType.courier
      ? CalendarEvents.data.filter((event) => event.is_courier == 1)
      : CalendarEvents.data.filter((event) => event.is_courier == 0);
  const [userData, setUserData] = User.useStore();
  return (
    <div
      className="show-courier"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <form
        autoFocus
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="search-bar"
      >
        <input
          type="search"
          placeholder="Search"
          aria-label="Search input"
          required
        />
        <i className="fa fa-search"></i>
        <button type="submit">Search</button>
      </form>

      {
        <Calendar
          events={renderArray.map((e) => ({
            id: e.id,
            start: new Date(e.deadline.split("T")[0]),
            end: new Date(e.deadline.split("T")[0]),
            title: e.title,
            backgroundColor: "red",
            description: e.description,
          }))}
          onDateRangeChange={async ({ start, end }) => {
            start = start.getTime();
            end = end.getTime();
            if (
              fetchedDates.find(
                (dateTime) => dateTime.start <= start && end <= dateTime.end
              )
            )
              return;
            const result = await GetEvents(userData.token, {
              start: new Date(start).toISOString().split("T")[0],
              end: new Date(end).toISOString().split("T")[0],
            });
            if (result[0]) return console.log(result);
            fetchedDates.push({ start: start, end: end });
            setCalendarEvents({
              data: [...CalendarEvents.data, ...result[1].data],
            });
          }}
        />
      }
    </div>
  );
};
