import PropTypes from "prop-types";
import CommentItem from "./CommentItem";

function CommentList({ comments }) {
  return (
    <div>
      <ul className="divide-y bg-gray-700 w-96 divide-gray-200 p-3 mt-5">
        <div className="text-gray-400">
          {comments?.length <= 0
            ? "No comment yet"
            : `${comments?.length} ${
                comments?.length > 1 ? "Comments" : "Comment"
              }`}
        </div>
        <>
          {comments?.length <= 0 ? (
            <h1 className="text-yellow-400 text-lg text-center">No comments</h1>
          ) : (
            comments?.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))
          )}
        </>
      </ul>
    </div>
  );
}

CommentList.propTypes = {
  comments: PropTypes.array,
};

export default CommentList;
