import CommentForm from "@/components/Comment/CommentForm";
import CommentList from "@/components/Comment/CommentList";
import LoadingCircle from "@/components/Loading/LoadingCircle";
import usePostPermission from "@/hooks/usePostPermission";
import { deletePostAction, fetchOnePostAction } from "@/redux/slices/postSlice";
import dateFormatter from "@/utils/DateFormatter";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";

function PostDetails(props) {
  const dispatch = useDispatch();
  const { id } = useParams();

  // select post details from store
  const postStore = useSelector((store) => store?.post);
  const { post, loading, appErr, serverErr, isDeleted } = postStore;

  // comment
  const commentStore = useSelector((store) => store?.comment);
  const { commentCreated, commentDeleted } = commentStore;

  // Current logged user
  const userStore = useSelector((store) => store?.user);
  const { userAuth } = userStore;

  useEffect(() => {
    dispatch(fetchOnePostAction(id));
  }, [dispatch, id, commentCreated, commentDeleted]);

  let isPermission = false;
  if (post) {
    isPermission = usePostPermission({ userId: post?.user?._id });
  }

  if (isDeleted) return <Navigate to="/posts" />;

  return (
    <>
      {loading ? (
        <LoadingCircle />
      ) : appErr || serverErr ? (
        <h1 className="text-yellow-600 text-center text-lg ">
          {serverErr} {appErr}
        </h1>
      ) : (
        <section className="py-20 2xl:py-40 bg-gray-800 overflow-hidden">
          <div className="container px-4 mx-auto">
            {/* Post Image */}
            <img
              className="mb-24 w-full h-96 object-cover"
              src={post?.image}
              alt=""
            />
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="mt-7 mb-14 text-6xl 2xl:text-7xl text-white font-bold font-heading">
                {post?.title}
              </h2>

              {/* User */}
              <div className="inline-flex pt-14 mb-14 items-center border-t border-gray-500">
                <img
                  className="mr-8 w-20 lg:w-24 h-20 lg:h-24 rounded-full"
                  src={post?.user?.profilePhoto}
                  alt=""
                />
                <div className="text-left">
                  <Link to={`/profile/${post?.user?.id}`}>
                    <h4 className="mb-1 text-2xl font-bold text-gray-50">
                      <span className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-orange-600">
                        {post?.user?.firstName} {post?.user?.lastName}
                      </span>
                    </h4>
                  </Link>
                  <p className="text-gray-500">
                    {dateFormatter(post?.createdAt)}
                  </p>
                </div>
              </div>
              {/* Post description */}
              <div className="max-w-xl mx-auto">
                <p className="mb-6 text-left  text-xl text-gray-200">
                  {post?.description}

                  {/* Show delete and update btn if created user */}
                  {isPermission ? (
                    <span className="flex">
                      <Link to={`/edit-post/${id}`} className="p-3">
                        <PencilAltIcon className="h-8 mt-3 text-yellow-300" />
                      </Link>
                      <button
                        onClick={() => dispatch(deletePostAction(id))}
                        className="ml-3"
                      >
                        <TrashIcon className="h-8 mt-3 text-red-600" />
                      </button>
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
          </div>
          {/* Add comment Form component here */}
          {userAuth ? (
            <CommentForm postId={id} userAuth={userAuth} />
          ) : (
            <h1 className="text-yellow-400 text-lg text-center">
              You must be logged in to post a comment
            </h1>
          )}

          <div className="flex justify-center  items-center">
            <CommentList comments={post?.comments} postId={post?._id} />
          </div>
        </section>
      )}
    </>
  );
}

PostDetails.propTypes = {};

export default PostDetails;
