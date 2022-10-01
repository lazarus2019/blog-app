import { Link } from "react-router-dom";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { fromNowDateFormatter } from "@/utils/DateFormatter";
import PropTypes from "prop-types";
import usePostPermission from "@/hooks/usePostPermission";
import { useDispatch } from "react-redux";
import { deleteCommentAction } from "@/redux/slices/commentSlice";

function CommentItem({ comment }) {
  const dispatch = useDispatch();
  let isPermission = false;
  if (comment) {
    isPermission = usePostPermission({ userId: comment?.user?._id });
  }

  return (
    <li className="py-4  w-full">
      <div className="flex space-x-3">
        <img
          className="h-6 w-6 rounded-full"
          src={comment?.user?.profilePhoto}
          alt=""
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-green-400">
              {comment?.user?.firstName} {comment?.user?.lastName}
            </h3>
            <p className="text-bold text-yellow-500 text-base ml-5">
              {fromNowDateFormatter(comment?.createdAt)}
            </p>
          </div>
          <p
            className="text-sm text-gray-400"
            // contentEditable={isPermission} // Not recommend
            // suppressContentEditableWarning={isPermission} // Not recommend
            onChange={(e) => {
              console.log("changed");
            }}
          >
            {comment?.description}
          </p>
          {/* Check if is the same user created this comment */}

          {isPermission ? (
            <p className="flex">
              <Link className="p-3">
                <PencilAltIcon className="h-5 mt-3 text-yellow-300" />
              </Link>
              <button
                onClick={() => dispatch(deleteCommentAction(comment?._id))}
                className="ml-3"
              >
                <TrashIcon className="h-5 mt-3 text-red-600" />
              </button>
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default CommentItem;
