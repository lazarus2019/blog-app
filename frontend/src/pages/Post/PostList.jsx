import LoadingCircle from "@/components/Loading/LoadingCircle";
import { fetchAllCategoryAction } from "@/redux/slices/categorySlice";
import {
  fetchAllPostAction,
  toggleAddLikesToPost,
  toggleAddDisLikesToPost,
} from "@/redux/slices/postSlice";
import dateFormatter from "@/utils/DateFormatter";
import { ThumbUpIcon, ThumbDownIcon, EyeIcon } from "@heroicons/react/solid";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

function PostList() {
  const postStore = useSelector((store) => store?.post);
  const { postList, loading, appErr, serverErr, likes, disLikes } = postStore;

  const categoryStore = useSelector((store) => store?.category);
  const {
    categoryList,
    loading: cateLoading,
    appErr: cateAppErr,
    serverErr: cateServerApp,
  } = categoryStore;

  const dispatch = useDispatch();

  // Fetch all post
  useEffect(() => {
    // empty string => /posts?category => all posts without filter category
    dispatch(fetchAllPostAction(""));
  }, [dispatch, likes, disLikes]);

  // Fetch all category
  useEffect(() => {
    dispatch(fetchAllCategoryAction());
  }, [dispatch]);

  return (
    <>
      <section>
        <div className="py-20 bg-gray-900 min-h-screen radius-for-skewed">
          <div className="container mx-auto px-4">
            <div className="mb-16 flex flex-wrap items-center">
              <div className="w-full lg:w-1/2">
                <span className="text-green-600 font-bold">
                  Latest Posts from our awesome authors
                </span>
                <h2 className="text-4xl text-gray-300 lg:text-5xl font-bold font-heading">
                  Latest Post
                </h2>
              </div>
              <div className=" block text-right w-1/2">
                {/* View All */}
                <button
                  onClick={() => dispatch(fetchAllPostAction(""))}
                  className="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-green-600 hover:bg-green-700 text-gray-50 font-bold leading-loose transition duration-200"
                >
                  View All Posts
                </button>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3">
              <div className="mb-8 lg:mb-0 w-full lg:w-1/4 px-3">
                <div className="py-4 px-6 bg-gray-600 shadow rounded">
                  <h4 className="mb-4 text-gray-500 font-bold uppercase">
                    Categories
                  </h4>
                  <ul>
                    {cateLoading ? (
                      <LoadingCircle />
                    ) : cateAppErr || cateServerApp ? (
                      <h2 className="text-center text-3xl text-red-600">
                        {cateServerApp} - {cateAppErr}
                      </h2>
                    ) : categoryList?.length <= 0 ? (
                      <div className="text-red-400 text-base">
                        Categories Error goes here
                      </div>
                    ) : (
                      categoryList?.map((category) => (
                        <li key={category?._id}>
                          <p
                            onClick={() =>
                              dispatch(fetchAllPostAction(category?.title))
                            }
                            className="block cursor-pointer py-2 px-3 mb-4 rounded text-yellow-500 font-bold bg-gray-500 hover:bg-blue-600"
                          >
                            {category?.title}
                          </p>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
              <div className="w-full lg:w-3/4 px-3">
                {/* Post goes here */}
                {loading ? (
                  <LoadingCircle />
                ) : appErr || serverErr ? (
                  <h1 className="text-yellow-600 text-center text-lg ">
                    {serverErr} {appErr}
                  </h1>
                ) : postList?.length <= 0 ? (
                  <h1 className="text-yellow-400 text-lg text-center">
                    No Post Found
                  </h1>
                ) : (
                  postList?.map((post) => (
                    <div
                      className="flex flex-wrap bg-gray-900 -mx-3  lg:mb-6"
                      key={post?._id}
                    >
                      <div className="mb-10  w-full lg:w-1/4 px-3">
                        <Link to={`/posts/${post?._id}`}>
                          {/* Post image */}
                          <img
                            className="w-full h-full object-cover rounded"
                            src={post?.image}
                            alt={post?.title}
                          />
                        </Link>
                        {/* Likes, views dislikes */}
                        <div className="flex flex-row bg-gray-300 justify-center w-full  items-center ">
                          {/* Likes */}
                          <div className="flex flex-row justify-center items-center ml-4 mr-4 pb-2 pt-1">
                            {/* Togle like  */}
                            <div className="">
                              <ThumbUpIcon
                                onClick={() =>
                                  dispatch(toggleAddLikesToPost(post?._id))
                                }
                                className="h-7 w-7 text-indigo-600 cursor-pointer"
                              />
                            </div>
                            <div className="pl-2 text-gray-600">
                              {post?.likes?.length}
                            </div>
                          </div>
                          {/* Dislike */}
                          <div className="flex flex-row  justify-center items-center ml-4 mr-4 pb-2 pt-1">
                            <div>
                              <ThumbDownIcon
                                onClick={() =>
                                  dispatch(toggleAddDisLikesToPost(post?._id))
                                }
                                className="h-7 w-7 cursor-pointer text-gray-600"
                              />
                            </div>
                            <div className="pl-2 text-gray-600">
                              {post?.disLikes?.length}
                            </div>
                          </div>
                          {/* Views */}
                          <div className="flex flex-row justify-center items-center ml-4 mr-4 pb-2 pt-1">
                            <div>
                              <EyeIcon className="h-7 w-7  text-gray-400" />
                            </div>
                            <div className="pl-2 text-gray-600">
                              {post?.numViews}2
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-3/4 px-3">
                        <Link
                          to={`/posts/${post?._id}`}
                          className="hover:underline"
                        >
                          <h3 className="mb-1 text-2xl text-green-400 font-bold font-heading">
                            {/* {capitalizeWord(post?.title)} */} {post?.title}
                          </h3>
                        </Link>
                        <p className="text-gray-300 line-clamp-2">
                          {post?.description}
                        </p>
                        {/* Read more */}
                        <Link
                          to={`/posts/${post?._id}`}
                          className="text-indigo-500 hover:underline"
                        >
                          Read More
                        </Link>
                        {/* User Avatar */}
                        <div className="mt-6 flex items-center">
                          <div className="flex-shrink-0">
                            <Link>
                              <img
                                className="h-10 w-10 rounded-full"
                                src={post?.user?.profilePhoto}
                                alt=""
                              />
                            </Link>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              <Link className="text-yellow-400 hover:underline ">
                                {post?.user?.firstName} {post?.user?.lastName}
                              </Link>
                            </p>
                            <div className="flex space-x-1 text-sm text-green-500">
                              <time>{dateFormatter(post?.createdAt)}</time>
                              <span aria-hidden="true">&middot;</span>
                            </div>
                          </div>
                        </div>
                        {/* <p className="text-gray-500">
                          Quisque id sagittis turpis. Nulla sollicitudin rutrum
                          eros eu dictum...
                        </p> */}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-900">
          <div className="skew bg-green-500 skew-bottom mr-for-radius">
            <svg
              className="h-8 md:h-12 lg:h-10 w-full text-gray-900"
              viewBox="0 0 10 10"
              preserveAspectRatio="none"
            >
              <polygon fill="currentColor" points="0 0 10 0 0 10"></polygon>
            </svg>
          </div>
          <div className="skew bg-gray-500  skew-bottom ml-for-radius">
            <svg
              className="h-8 bg-gray-500 md:h-12 lg:h-20 w-full text-gray-900"
              viewBox="0 0 10 10"
              preserveAspectRatio="none"
            >
              <polygon fill="currentColor" points="0 0 10 0 10 10"></polygon>
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}

export default PostList;
