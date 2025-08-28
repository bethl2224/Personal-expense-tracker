import { Avatar } from "@mui/material";
import { getTodaysDate, stringAvatar } from "~/utils/date";

const HeaderBar = ({ userInfo }: User) => {
  return (
    <article className="flex justify-between items-start mb-20">
      <div>
        <h1 className="text-black font-bold text-4xl pb-2">
          {`Hi ${userInfo?.name} 👋`}
        </h1>
        <h3 className="text-gray-700 text-xl">{getTodaysDate()}</h3>
      </div>
      <Avatar {...stringAvatar(userInfo?.name)} />
    </article>
  );
};

export default HeaderBar;
