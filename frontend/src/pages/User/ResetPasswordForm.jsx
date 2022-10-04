import { useDispatch, useSelector } from "react-redux";
import { LockClosedIcon } from "@heroicons/react/solid";
import * as yup from "yup";
import { useFormik } from "formik";
import { generateResetPassword } from "@/redux/slices/verifySlice";

//Form schema
const formSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
});

function ResetPasswordForm(props) {
  const dispatch = useDispatch();
  //formik
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      dispatch(generateResetPassword(values));
    },
    validationSchema: formSchema,
  });

  const verifyStore = useSelector((store) => store?.verify);
  const { passwordToken, loading, appErr, serverErr } = verifyStore;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Password Reset Form
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
          {passwordToken && (
            <h3>
              Email is successfully sent to your email. Verify it within 10
              minutes.
            </h3>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Enter Your Email Address
              </label>
              <input
                type="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              {/* Err msg */}
              <div className="text-red-400 mb-2">
                {formik.touched.email && formik.errors.email}
              </div>
            </div>
          </div>

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

ResetPasswordForm.propTypes = {};

export default ResetPasswordForm;
