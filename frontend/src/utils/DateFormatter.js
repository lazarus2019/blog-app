import Moment from "moment";
const dateFormatter = (date) => {
  return Moment(date).format("D MMM YYYY");
};

export default dateFormatter;
