import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router";
import * as yup from "yup";
import { LockClosedIcon } from "@heroicons/react/solid";
import { useFormik } from "formik";
import { verifyResetPassword } from "@/redux/slices/verifySlice";

//Form schema
const formSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must at least 6 characters"),
  retypePassword: yup
    .string()
    .required("Please retype your password")
    .oneOf([yup.ref("password")], "Password does not match"),
});

function ResetPassword(props) {
  const dispatch = useDispatch();
  const { token } = useParams();

  const formik = useFormik({
    initialValues: {
      password: "",
      retypePassword: "",
    },
    onSubmit: (values) => {
      //dispath the action
      const data = {
        password: values?.password,
        token,
      };
      dispatch(verifyResetPassword(data));
    },
    validationSchema: formSchema,
  });

  const verifyStore = useSelector((store) => store?.verify);
  const { passwordReset, loading, appErr, serverErr } = verifyStore;

  if (passwordReset) {
    setTimeout(() => {
      return <Navigate to="/login" />;
    }, 5000);
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Password Reset
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <a className="font-medium text-indigo-600 hover:text-indigo-500">
              Reset your password if you have forgotten
            </a>
          </p>
        </div>
        {/* Err msg */}
        <div className="text-red-500 text-center">
          {appErr || serverErr ? (
            <h3>
              {serverErr} {appErr}
            </h3>
          ) : null}
        </div>

        {/* Sucess msg */}
        <div className="text-green-700 text-center">
          {passwordReset && (
            <h3>
              Password Reset Successfully. You will be redirected to login with
              5 seconds
            </h3>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Enter Your New Password
              </label>
              <input
                type="password"
                autoComplete="password"
                value={formik.values.password}
                onChange={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter new Password"
              />
              {/* Err msg */}
              <div className="text-red-400 mb-2">
                {formik.touched.password && formik.errors.password}
              </div>
            </div>
          </div>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Retype your password
              </label>
              <input
                type="password"
                value={formik.values.retypePassword}
                onChange={formik.handleChange("retypePassword")}
                onBlur={formik.handleBlur("retypePassword")}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Retype your password"
              />
              {/* Err msg */}
              <div className="text-red-400 mb-2">
                {formik.touched.retypePassword && formik.errors.retypePassword}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between"></div>

          <div>
            {loading ? (
              <button
                disabled
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 "
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Loading please wait...
              </button>
            ) : (
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Reset Password
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

ResetPassword.propTypes = {};

export default ResetPassword;
