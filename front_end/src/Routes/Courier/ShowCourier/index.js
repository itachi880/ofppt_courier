import { events, User,documentType } from "../../../data";
import { Calendar ,useQuery} from "../../../utils";
import "./index.css";
export default () => {
  const [CalendarEvents, setCalendarEvents] = events.useStore();
  const afficheType=useQuery()(documentType.event)?documentType.event:documentType.courier
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
        afficheType==documentType.courier?<Calendar
        events={CalendarEvents.data.filter(event=> event.is_courier==1).map((e) => ({
          id: e.id,
          start: new Date(e.deadline.split("T")[0]),
          end: new Date(e.deadline.split("T")[0]),
          title: e.title,
          backgroundColor: "red",
          description: e.description,
        }))}
      />:<Calendar
      events={CalendarEvents.data.filter(event=> event.is_courier==0).map((e) => ({
        id: e.id,
        start: new Date(e.deadline.split("T")[0]),
        end: new Date(e.deadline.split("T")[0]),
        title: e.title,
        backgroundColor: "red",
        description: e.description,
      }))}
    />
      }
    </div>
  );
};
