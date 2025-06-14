/**
 * @typedef {Object} Video
 * @property {string} id
 * @property {string} type
 * @property {string} url
 * @property {string} extractedId
 * @property {string} title
 * @property {number} smallImg
 * @property {string} bigImg
 * @property {boolean} active
 * @property {string} userId
 * @property {number} upVotes
 * @property {boolean} haveupVoted
 */

function QueueItemCard({ item, onVote }) {
  return (
    <div className="border rounded-lg p-4 shadow-md flex items-center space-x-4">
      <img src={item.thumbnail} alt={item.title} className="w-24 h-16 object-cover rounded" />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-500">Submitted by {item.submittedBy}</p>
        <div className="flex items-center mt-2 space-x-2">
          {item.haveupVoted ? <button
            className={`px-2 py-1 text-white rounded ${item.hasVoted === "down" ? "bg-red-600" : "bg-gray-400"}`}
            onClick={() => onVote(item.id, "down")}
          >
            👎
          </button> : <button
            className={`px-2 py-1 text-white rounded ${item.hasVoted === "up" ? "bg-green-600" : "bg-gray-400"}`}
            onClick={() => onVote(item.id, "up")}
          >
            👍
          </button>}

          <span>{item.votes}</span>

        </div>
      </div>
    </div>
  );
}

export default QueueItemCard;
