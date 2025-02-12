import {
  events,
  documentType,
  fetchedDates,
  User,
  loading,
} from "../../../data";
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
  const [loadingFlag, setLoadingFlag] = loading.useStore();
  return (
    <>
      <header className="bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg py-4 px-6 md:px-12">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-wide">
            Show courier
          </h1>
          <nav className="flex space-x-2 md:space-x-6"></nav>
        </div>
      </header>
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
        {
          <Calendar
            events={renderArray.map((e) => ({
              id: e.id,
              start: new Date(e.deadline),
              end: new Date(e.deadline),
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
              setLoadingFlag({ loading: true });
              const result = await GetEvents(userData.token, {
                start: new Date(start).toISOString().split("T")[0],
                end: new Date(end).toISOString().split("T")[0],
              });
              if (result[0])
                return (
                  console.log(result) && setLoadingFlag({ loading: false })
                );

              fetchedDates.push({ start: start, end: end });
              const set = [];
              const ids = [];
              CalendarEvents.data.forEach((e) => {
                set.push(e);
                ids.push(e.id);
              });
              result[1].data.forEach((e) => {
                if (ids.includes(e.id)) return;
                set.push(e);
                ids.push(e.id);
              });
              setCalendarEvents({
                data: set,
              });
              setLoadingFlag({ loading: false });
            }}
          />
        }
      </div>
    </>
  );
};
