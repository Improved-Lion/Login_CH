import { UserImage } from "./Home.styled";

interface UserInfoProps {
  userName: string;
  userImage: string;
}

const UserInfo = ({ userName, userImage }: UserInfoProps) => {
  return (
    <>
      <h1>Welcome, {userName}</h1>
      {userImage && <UserImage src={userImage} alt={userName} />}
    </>
  );
};

export default UserInfo;
