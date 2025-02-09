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
    <div className="bg-gray-900 text-white min-h-screen py-8">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Archive</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentEvents.map((e) => (
            <div
              key={e.id}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out hover:scale-105"
            >
              {e.imageUrl && (
                <img
                  src={e.imageUrl}
                  alt={e.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                  {e.title}
                </h2>
                {e.date && (
                  <p className="text-gray-500 mb-2">
                    {moment(e.date).format("MMMM DD, YYYY")}
                  </p>
                )}
                <p className="text-gray-400 line-clamp-3">{e.description}</p>
                <Link to={`/courrier/detail/${e.id}`}>
                  <button className="mt-2 bg-white text-gray-800 hover:bg-gray-100 font-bold py-2 px-4 rounded transition duration-300">
                    {" "}
                    {/* White button with dark text */}
                    Afficher plus <i className="fas fa-arrow-right"></i>
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
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-300"
          >
            Precedent
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mx-1 transition duration-300 ${
                currentPage === i + 1 ? "bg-blue-600" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-2 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-300"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Archive;
