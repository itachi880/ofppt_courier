import { events } from "../../../data";
import { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const Archive = () => {
  const [eventsData, setEventData] = events.useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;

  // Sort events by created_at (newest first)
  const sortedEvents = [...eventsData.data].sort((a, b) => {
    const dateA = moment(a.created_at); // Use created_at property
    const dateB = moment(b.created_at);
    return dateB.diff(dateA); // Newest first
  });

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent); // Use sorted events

  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage); // Use sorted events length

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-[#F0F2F5] py-8">
      {" "}
      {/* Light background */}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center text-[#0078D7]">
          {" "}
          {/* OFPPT Blue */}
          Archive
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentEvents.map((e) => (
            <div
              key={e.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out hover:scale-105 border border-[#FFC107]" // White card with gold border
            >
              {e.imageUrl && (
                <img
                  src={e.imageUrl}
                  alt={e.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2 text-[#004A94]">
                  {" "}
                  {/* Darker OFPPT Blue */}
                  {e.title}
                </h2>
                {e.date && (
                  <p className="text-gray-500 mb-2">
                    {moment(e.date).format("MMMM DD, YYYY")}
                  </p>
                )}
                <p className="text-gray-600 line-clamp-3">{e.description}</p>
                <Link to={`/courrier/detail/${e.id}`}>
                  <button className="mt-2 bg-[#0078D7] text-white hover:bg-[#0056b3] font-bold py-2 px-4 rounded transition duration-300">
                    {" "}
                    {/* OFPPT Blue Button */}
                    Afficher plus <i className="fas fa-arrow-right ml-2"></i>{" "}
                    {/* Added margin for icon */}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-[#FFC107] hover:bg-[#F9A602] text-[#0078D7] font-bold py-2 px-4 rounded mr-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition duration-300" // Gold buttons
          >
            Precedent
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`bg-[#FFC107] hover:bg-[#F9A602] text-[#0078D7] font-bold py-2 px-4 rounded mx-1 transition duration-300 ${
                currentPage === i + 1 ? "bg-[#0078D7] text-white" : "" // Active page styling
              }`} // Gold buttons
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-[#FFC107] hover:bg-[#F9A602] text-[#0078D7] font-bold py-2 px-4 rounded ml-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition duration-300" // Gold buttons
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Archive;
