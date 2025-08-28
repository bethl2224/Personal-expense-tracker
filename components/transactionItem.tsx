import React from "react";
import { formatCreatedDate } from "~/utils/date";

// only type salary is income

const TransactionItem = ({
  date,
  category,
  amount,
  type,
}: TransactionItemProps) => {
  return (
    <div className=" border border-gray-300 rounded-xl mt-8 p-10">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <img
              className="w-5 h-5"
              src={`./assets/icons/${category}.svg`}
              alt={category}
            />

            <span className="text-gray-500 font-light sm:text-xl md:text-2xl    ">
              {category}
            </span>
          </div>

          <p className="text-gray-500 sm:text-xl md:text-2xl  font-light text-xl">
            {formatCreatedDate(date)}
          </p>
        </div>

        <p
          className={`mt-5 text-lg sm:text-xl md:text-2xl  ${type === "income" ? "text-green-500" : "text-red-500"}`}
        >
          {`$${amount}`}
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;
