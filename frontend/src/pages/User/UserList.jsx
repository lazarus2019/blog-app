import { useEffect } from "react";
import PropTypes from "prop-types";
import UserListHeader from "./UserListHeader";
import UserItem from "./UserItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsersAction } from "@/redux/slices/userSlice";
import LoadingCircle from "@/components/Loading/LoadingCircle";

function UserList(props) {
  const dispatch = useDispatch();
  const userStore = useSelector((store) => store?.user);
  const { loading, appErr, serverErr, userList, block, unblock } = userStore;

  useEffect(() => {
    dispatch(fetchAllUsersAction());
  }, [dispatch, block, unblock]);

  return (
    <section className="py-8 bg-gray-900 min-h-screen">
      <UserListHeader />
      {loading ? (
        <LoadingCircle />
      ) : appErr || serverErr ? (
        <h2 className="text-yellow-400 text-2xl">
          {serverErr} {appErr}
        </h2>
      ) : userList?.length <= 0 ? (
        <h1 className="text-yellow-400 text-lg text-center">No Users Found</h1>
      ) : (
        userList?.map((user) => (
          <div key={user?._id} className="container px-4 mx-auto">
            <UserItem user={user} />
          </div>
        ))
      )}
    </section>
  );
}

UserList.propTypes = {};

export default UserList;
